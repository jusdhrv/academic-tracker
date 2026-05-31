import { dashboardRepository } from '@/db/repositories/dashboard.repository'

export const dashboardService = {
  getMetrics: () => dashboardRepository.getMetrics(),
  getWeeklyActivity: () => dashboardRepository.getWeeklyActivity(),
  getSubjectDistribution: () => dashboardRepository.getSubjectDistribution(),
  getPerformanceTrend: () => dashboardRepository.getPerformanceTrend(),
}
