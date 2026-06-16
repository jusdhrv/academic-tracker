import type { AnalyticsFilters } from '@/types/analytics'
import { statisticsRepository } from '@/db/repositories/statistics.repository'

export const statisticsService = {
  getAnalyticsData: (filters?: AnalyticsFilters) => statisticsRepository.getAnalyticsData(filters),
  getSubjectOptions: () => statisticsRepository.getSubjectOptions(),
  getChapterOptions: (subjectId?: string) => statisticsRepository.getChapterOptions(subjectId),
}
