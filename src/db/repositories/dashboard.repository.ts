import { prisma } from '@/db/prisma/client'
import { questionRepository } from '@/db/repositories/question.repository'
import { flashcardRepository } from '@/db/repositories/flashcard.repository'
import { formatStudyDuration } from '@/lib/analytics/study-time'
import type {
  SubjectDistributionPoint,
  WeeklyActivityPoint,
} from '@/types/analytics'

type DashboardMetrics = {
  questionsDueToday: number
  questionsDueDelta: string
  flashcardsDueToday: number
  flashcardsDueChapters: string
  studyTimeThisWeek: string
  studyTimeDelta: string
  accuracyRate: string
  accuracyLabel: string
}

type PerformanceTrendPoint = { date: string; accuracy: number }

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

function iterateDays(start: Date, end: Date) {
  const days = [] as Date[]
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function formatDay(date: Date) {
  return dayFormatter.format(date)
}

function roundPercentage(value: number) {
  return Math.round(value * 10) / 10
}

export class DashboardRepository {
  async getMetrics(): Promise<DashboardMetrics> {
    const [questionsDueToday, flashcardsDueToday, flashcardChapterCount] = await Promise.all([
      questionRepository.countDue(),
      flashcardRepository.getDueCount(),
      prisma.flashcard.findMany({
        where: {
          OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: new Date() } }],
          chapterId: { not: null },
        },
        distinct: ['chapterId'],
        select: { chapterId: true },
      }),
    ])

    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - 6)
    const previousStart = new Date(weekStart)
    previousStart.setDate(previousStart.getDate() - 7)
    const previousEnd = new Date(weekStart)
    previousEnd.setDate(previousEnd.getDate() - 1)

    const [currentStudySeconds, previousStudySeconds, currentAccuracy, previousAccuracy] = await Promise.all([
      this.getStudySecondsForRange(weekStart, today),
      this.getStudySecondsForRange(previousStart, previousEnd),
      this.getAccuracyForRange(weekStart, today),
      this.getAccuracyForRange(previousStart, previousEnd),
    ])

    const currentMinutes = currentStudySeconds / 60
    const previousMinutes = previousStudySeconds / 60
    const studyTimeDelta = this.renderDelta(currentMinutes, previousMinutes, 'm')
    const accuracyRate = `${Math.round(currentAccuracy)}%`
    const accuracyLabel = this.buildAccuracyLabel(currentAccuracy, previousAccuracy)

    return {
      questionsDueToday,
      questionsDueDelta: this.buildQuestionsDueDelta(),
      flashcardsDueToday,
      flashcardsDueChapters: `${flashcardChapterCount.length} chapters`,
      studyTimeThisWeek: formatStudyDuration(Math.round(currentMinutes)),
      studyTimeDelta,
      accuracyRate,
      accuracyLabel,
    }
  }

  async getWeeklyActivity(): Promise<WeeklyActivityPoint[]> {
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const [questionAttempts, flashcardReviews] = await Promise.all([
      prisma.practiceQuestionAttempt.findMany({
        where: { startedAt: { gte: start, lte: end } },
        select: { startedAt: true, elapsedSeconds: true },
      }),
      prisma.flashcardReview.findMany({
        where: { reviewedAt: { gte: start, lte: end } },
        select: { reviewedAt: true },
      }),
    ])

    const questionsByDay = this.groupCountsByDay(questionAttempts.map((attempt) => ({ date: attempt.startedAt, count: 1 })))
    const flashcardsByDay = this.groupCountsByDay(flashcardReviews.map((review) => ({ date: review.reviewedAt, count: 1 })))
    const minutesByDay = this.groupCountsByDay(questionAttempts.map((attempt) => ({ date: attempt.startedAt, count: Math.round(attempt.elapsedSeconds / 60) })))

    return iterateDays(start, end).map((date) => {
      const key = date.toISOString().slice(0, 10)
      return {
        day: formatDay(date),
        questions: questionsByDay[key] ?? 0,
        flashcards: flashcardsByDay[key] ?? 0,
        minutes: minutesByDay[key] ?? 0,
      }
    })
  }

  async getSubjectDistribution(): Promise<SubjectDistributionPoint[]> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const subjects = await prisma.subject.findMany({ select: { id: true, name: true, chartColor: true } })

    const [attempts, reviews] = await Promise.all([
      prisma.practiceQuestionAttempt.findMany({
        where: { startedAt: { gte: thirtyDaysAgo } },
        select: {
          question: {
            select: {
              chapters: {
                take: 1,
                select: {
                  chapter: {
                    select: { subjectId: true },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.flashcardReview.findMany({
        where: { reviewedAt: { gte: thirtyDaysAgo } },
        select: {
          flashcard: {
            select: { subjectId: true },
          },
        },
      }),
    ])

    const counts: Record<string, number> = {}

    attempts.forEach((attempt) => {
      const subjectId = attempt.question.chapters[0]?.chapter.subjectId
      if (subjectId) counts[subjectId] = (counts[subjectId] || 0) + 1
    })

    reviews.forEach((review) => {
      const subjectId = review.flashcard.subjectId
      if (subjectId) counts[subjectId] = (counts[subjectId] || 0) + 1
    })

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)

    return subjects
      .map((subject) => ({
        name: subject.name,
        value: total === 0 ? 0 : roundPercentage((counts[subject.id] ?? 0) / total * 100),
        color: subject.chartColor ?? '#7a6ee8',
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }

  async getPerformanceTrend(): Promise<PerformanceTrendPoint[]> {
    const end = new Date()
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const attempts = await prisma.practiceQuestionAttempt.findMany({
      where: { startedAt: { gte: start, lte: end } },
      select: { startedAt: true, outcome: true },
    })

    const buckets = this.groupByDate(attempts.map((attempt) => ({ date: attempt.startedAt, outcome: attempt.outcome })))
    const solvedOutcomes = new Set(['solved-fast', 'solved-slow'])

    return iterateDays(start, end).map((date) => {
      const key = date.toISOString().slice(0, 10)
      const bucket = buckets[key] ?? { solved: 0, attempted: 0 }
      return {
        date: formatDay(date),
        accuracy: bucket.attempted === 0 ? 0 : Math.round((bucket.solved / bucket.attempted) * 100),
      }
    })
  }

  private async getStudySecondsForRange(start: Date, end: Date) {
    const attempts = await prisma.practiceQuestionAttempt.findMany({
      where: { startedAt: { gte: start, lte: end } },
      select: { elapsedSeconds: true },
    })
    return attempts.reduce((sum, attempt) => sum + attempt.elapsedSeconds, 0)
  }

  private async getAccuracyForRange(start: Date, end: Date) {
    const attempts = await prisma.practiceQuestionAttempt.findMany({
      where: { startedAt: { gte: start, lte: end } },
      select: { outcome: true },
    })
    const solved = attempts.filter((attempt) => attempt.outcome === 'solved-fast' || attempt.outcome === 'solved-slow').length
    const total = attempts.filter((attempt) => attempt.outcome !== 'skipped').length
    return total === 0 ? 0 : (solved / total) * 100
  }

  private groupCountsByDay(items: Array<{ date: Date; count: number }>) {
    return items.reduce<Record<string, number>>((acc, item) => {
      const key = item.date.toISOString().slice(0, 10)
      acc[key] = (acc[key] ?? 0) + item.count
      return acc
    }, {})
  }

  private groupByDate(items: Array<{ date: Date; outcome: string }>) {
    return items.reduce<Record<string, { solved: number; attempted: number }>>((acc, item) => {
      const key = item.date.toISOString().slice(0, 10)
      const solved = item.outcome === 'solved-fast' || item.outcome === 'solved-slow'
      const attempted = item.outcome !== 'skipped' ? 1 : 0

      if (!acc[key]) {
        acc[key] = { solved: 0, attempted: 0 }
      }

      acc[key].solved += solved ? 1 : 0
      acc[key].attempted += attempted
      return acc
    }, {})
  }

  private renderDelta(current: number, previous: number, unit: string) {
    if (previous === 0) {
      return current === 0 ? `0${unit}` : `+${current.toFixed(1)}${unit} vs prior`
    }
    const diff = +(current - previous).toFixed(1)
    const sign = diff === 0 ? '' : diff > 0 ? '+' : ''
    return `${sign}${diff}${unit} vs prior`
  }

  private buildQuestionsDueDelta() {
    return 'No history'
  }

  private buildAccuracyLabel(current: number, previous: number) {
    if (current > previous) return 'Improving performance'
    if (current < previous) return 'Needs attention'
    return 'Stable performance'
  }
}

export const dashboardRepository = new DashboardRepository()
