import {
  MOCK_DASHBOARD_METRICS,
  MOCK_PERFORMANCE_TREND,
  MOCK_SUBJECT_DISTRIBUTION,
  MOCK_WEEKLY_ACTIVITY,
} from '@/features/dashboard/data/mock-dashboard'

export const dashboardService = {
  getMetrics: () => MOCK_DASHBOARD_METRICS,
  getWeeklyActivity: () => MOCK_WEEKLY_ACTIVITY,
  getSubjectDistribution: () => MOCK_SUBJECT_DISTRIBUTION,
  getPerformanceTrend: () => MOCK_PERFORMANCE_TREND,
}
