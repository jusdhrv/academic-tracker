import { metricSnapshotRepository } from '@/db/repositories/metric-snapshot.repository'
import { questionRepository } from '@/db/repositories/question.repository'
import { flashcardRepository } from '@/db/repositories/flashcard.repository'
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

export class DashboardRepository {
  async getMetrics(): Promise<DashboardMetrics> {
    const snapshot = await metricSnapshotRepository.getJson<DashboardMetrics>('dashboard.metrics')
    const [questionsDueToday, flashcardsDueToday] = await Promise.all([
      questionRepository.countDue(),
      flashcardRepository.getDueCount(),
    ])

    return {
      ...snapshot,
      questionsDueToday,
      flashcardsDueToday,
    }
  }

  async getWeeklyActivity(): Promise<WeeklyActivityPoint[]> {
    return metricSnapshotRepository.getJson<WeeklyActivityPoint[]>('dashboard.weeklyActivity')
  }

  async getSubjectDistribution(): Promise<SubjectDistributionPoint[]> {
    return metricSnapshotRepository.getJson<SubjectDistributionPoint[]>('dashboard.subjectDistribution')
  }

  async getPerformanceTrend(): Promise<PerformanceTrendPoint[]> {
    return metricSnapshotRepository.getJson<PerformanceTrendPoint[]>('dashboard.performanceTrend')
  }
}

export const dashboardRepository = new DashboardRepository()
