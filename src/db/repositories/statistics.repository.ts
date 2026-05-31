import { metricSnapshotRepository } from '@/db/repositories/metric-snapshot.repository'
import type {
  AccuracyTrendPoint,
  DailyStudyPoint,
  ErrorBreakdown,
  QuestionsAttemptedPoint,
  SolveTimeByDifficulty,
  WeakChapterStat,
} from '@/types/analytics'

type StatisticsMetrics = {
  totalStudyTime: string
  studyTimeDelta: string
  questionsAttempted: number
  flashcardsReviewed: number
  overallAccuracy: string
  accuracyDelta: string
  avgSolveTime: string
  solveTimeDelta: string
}

export class StatisticsRepository {
  async getMetrics(): Promise<StatisticsMetrics> {
    return metricSnapshotRepository.getJson<StatisticsMetrics>('statistics.metrics')
  }

  async getDailyStudy(): Promise<DailyStudyPoint[]> {
    return metricSnapshotRepository.getJson<DailyStudyPoint[]>('statistics.dailyStudy')
  }

  async getQuestionsAttempted(): Promise<QuestionsAttemptedPoint[]> {
    return metricSnapshotRepository.getJson<QuestionsAttemptedPoint[]>('statistics.questionsAttempted')
  }

  async getAccuracyTrend(): Promise<AccuracyTrendPoint[]> {
    return metricSnapshotRepository.getJson<AccuracyTrendPoint[]>('statistics.accuracyTrend')
  }

  async getSolveTimeByDifficulty(): Promise<SolveTimeByDifficulty[]> {
    return metricSnapshotRepository.getJson<SolveTimeByDifficulty[]>('statistics.solveTime')
  }

  async getWeakestChapters(): Promise<WeakChapterStat[]> {
    return metricSnapshotRepository.getJson<WeakChapterStat[]>('statistics.weakestChapters')
  }

  async getErrorAnalysis(): Promise<ErrorBreakdown[]> {
    return metricSnapshotRepository.getJson<ErrorBreakdown[]>('statistics.errorAnalysis')
  }
}

export const statisticsRepository = new StatisticsRepository()
