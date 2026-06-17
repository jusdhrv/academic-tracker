import { prisma } from '@/db/prisma/client'
import { calculateAccuracy } from '@/lib/analytics/accuracy'
import { formatStudyDuration } from '@/lib/analytics/study-time'
import { groupAttemptsByDay, groupAttemptsByWeek, groupAttemptsByDifficulty, groupQuestionsByDay, buildWeakChapterStats, buildErrorBreakdown } from '@/lib/analytics/aggregators'
import type {
  AccuracyTrendPoint,
  AnalyticsFilters,
  ChapterOption,
  DailyStudyPoint,
  ErrorBreakdown,
  QuestionsAttemptedPoint,
  SolveTimeByDifficulty,
  StatisticsMetrics,
  SubjectOption,
  WeakChapterStat,
} from '@/types/analytics'

const solvedOutcomes = new Set(['solved-fast', 'solved-slow'])

export class StatisticsRepository {
  async getAnalyticsData(filters: AnalyticsFilters = {}) {
    const [currentRangeAttempts, previousRangeAttempts, flashcardsReviewed] = await Promise.all([
      this.getAttemptRecords(filters),
      this.getAttemptRecords(this.getPreviousRange(filters)),
      prisma.flashcardReview.count({
        where: this.buildFlashcardReviewFilter(filters),
      }),
    ])

    const currentStats = this.buildMetrics(currentRangeAttempts, previousRangeAttempts, flashcardsReviewed)

    return {
      metrics: currentStats,
      dailyStudyData: this.buildDailyStudyPoints(currentRangeAttempts, filters),
      questionsData: this.buildQuestionsAttemptedPoints(currentRangeAttempts, filters),
      accuracyTrendData: this.buildAccuracyTrendPoints(currentRangeAttempts, filters),
      solveTimeData: this.buildSolveTimeByDifficulty(currentRangeAttempts),
      weakestChapters: this.buildWeakestChapters(currentRangeAttempts),
      errorAnalysis: this.buildErrorAnalysis(currentRangeAttempts),
    }
  }

  async getSubjectOptions(): Promise<SubjectOption[]> {
    const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
    return subjects.map((subject) => ({ id: subject.id, name: subject.name }))
  }

  async getChapterOptions(subjectId?: string): Promise<ChapterOption[]> {
    return prisma.chapter.findMany({
      where: subjectId ? { subjectId } : {},
      orderBy: { name: 'asc' },
      select: { id: true, name: true, subjectId: true },
    })
  }

  private async getAttemptRecords(filters: AnalyticsFilters = {}) {
    const where = this.buildAttemptFilter(filters)

    return prisma.practiceQuestionAttempt.findMany({
      where,
      select: {
        startedAt: true,
        elapsedSeconds: true,
        outcome: true,
        errorType: true,
        questionType: true,
        question: {
          select: {
            difficulty: { select: { name: true } },
            masteryScore: true,
            chapters: {
              select: {
                chapter: { select: { id: true, name: true, subjectId: true } },
              },
            },
          },
        },
      },
    })
  }

  private getPreviousRange(filters: AnalyticsFilters): AnalyticsFilters {
    if (!filters.startDate || !filters.endDate) return {}
    const start = new Date(filters.startDate)
    const end = new Date(filters.endDate)
    const delta = end.getTime() - start.getTime()
    const previousEnd = new Date(start.getTime() - 1)
    const previousStart = new Date(previousEnd.getTime() - delta)

    return {
      ...filters,
      startDate: previousStart.toISOString().slice(0, 10),
      endDate: previousEnd.toISOString().slice(0, 10),
    }
  }

  private buildAttemptFilter(filters: AnalyticsFilters) {
    const where: any = {}

    if (filters.startDate || filters.endDate) {
      where.startedAt = {}
      if (filters.startDate) where.startedAt.gte = new Date(filters.startDate)
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        where.startedAt.lte = end
      }
    }

    if (filters.chapterId) {
      where.question = {
        chapters: {
          some: { chapterId: filters.chapterId },
        },
      }
    } else if (filters.subjectId) {
      where.question = {
        chapters: {
          some: {
            chapter: {
              subjectId: filters.subjectId,
            },
          },
        },
      }
    }

    return where
  }

  private buildFlashcardReviewFilter(filters: AnalyticsFilters = {}) {
    const where: any = {}

    if (filters.startDate || filters.endDate) {
      where.reviewedAt = {}
      if (filters.startDate) where.reviewedAt.gte = new Date(filters.startDate)
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        where.reviewedAt.lte = end
      }
    }

    return where
  }

  private buildMetrics(
    currentAttempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>,
    previousAttempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>,
    flashcardsReviewed: number,
  ): StatisticsMetrics {
    const currentMinutes = currentAttempts.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0) / 60
    const previousMinutes = previousAttempts.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0) / 60

    const currentSolved = currentAttempts.filter((attempt) => solvedOutcomes.has(attempt.outcome)).length
    const currentTotal = currentAttempts.filter((attempt) => attempt.outcome !== 'skipped').length
    const previousSolved = previousAttempts.filter((attempt) => solvedOutcomes.has(attempt.outcome)).length
    const previousTotal = previousAttempts.filter((attempt) => attempt.outcome !== 'skipped').length

    const currentAvgSolve = this.calculateAverageSolveTime(currentAttempts)
    const previousAvgSolve = this.calculateAverageSolveTime(previousAttempts)

    const currentMastery = this.calculateAverageMastery(currentAttempts)
    const previousMastery = this.calculateAverageMastery(previousAttempts)

    const accuracy = calculateAccuracy(currentSolved, currentTotal)
    const previousAccuracy = calculateAccuracy(previousSolved, previousTotal)

    return {
      totalStudyTime: formatStudyDuration(Math.round(currentMinutes)),
      studyTimeDelta: this.renderDelta(currentMinutes, previousMinutes, 'm'),
      questionsAttempted: currentAttempts.length,
      flashcardsReviewed,
      overallAccuracy: `${accuracy}%`,
      accuracyDelta: this.renderDelta(accuracy, previousAccuracy, '%'),
      avgSolveTime: `${Math.round(currentAvgSolve)}m`,
      solveTimeDelta: this.renderDelta(previousAvgSolve - currentAvgSolve, 0, 'm', true),
      masteryGrowth: `${this.renderDelta(currentMastery, previousMastery, '%', false)}`,
    }
  }

  private calculateAverageSolveTime(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>) {
    const solvedAttempts = attempts.filter((attempt) => solvedOutcomes.has(attempt.outcome))
    if (!solvedAttempts.length) return 0
    return solvedAttempts.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0) / solvedAttempts.length / 60
  }

  private calculateAverageMastery(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>) {
    const masteries = attempts
      .map((attempt) => attempt.question.masteryScore)
      .filter((score): score is number => typeof score === 'number')

    if (!masteries.length) return 0
    return Math.round((masteries.reduce((sum, score) => sum + score, 0) / masteries.length) * 100)
  }

  private renderDelta(current: number, previous: number, unit: string, invert = false) {
    if (previous === 0) {
      if (current === 0) return `0${unit}`
      return `+${current.toFixed(1)}${unit} vs prior`
    }
    const diff = +(current - previous).toFixed(1)
    const sign = diff === 0 ? '' : diff > 0 ? '+' : ''
    if (invert) {
      return `${sign}${diff}${unit} vs prior`
    }
    return `${sign}${diff}${unit} vs prior`
  }

  private buildDailyStudyPoints(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>, filters: AnalyticsFilters): DailyStudyPoint[] {
    return groupAttemptsByDay(attempts, filters.startDate, filters.endDate)
  }

  private buildQuestionsAttemptedPoints(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>, filters: AnalyticsFilters): QuestionsAttemptedPoint[] {
    return groupQuestionsByDay(attempts, filters.startDate, filters.endDate)
  }

  private buildAccuracyTrendPoints(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>, filters: AnalyticsFilters): AccuracyTrendPoint[] {
    return groupAttemptsByWeek(attempts, filters.startDate, filters.endDate)
  }

  private buildSolveTimeByDifficulty(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>) {
    return groupAttemptsByDifficulty(attempts)
  }

  private buildWeakestChapters(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>) {
    return buildWeakChapterStats(attempts)
  }

  private buildErrorAnalysis(attempts: Array<Awaited<ReturnType<StatisticsRepository['getAttemptRecords']>>[number]>) {
    return buildErrorBreakdown(attempts)
  }
}

export const statisticsRepository = new StatisticsRepository()
