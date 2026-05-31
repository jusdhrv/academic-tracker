import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { dashboardService } from '@/services/dashboard.service'

export default async function Page() {
  const [metrics, weeklyData, subjectData, performanceData] = await Promise.all([
    dashboardService.getMetrics(),
    dashboardService.getWeeklyActivity(),
    dashboardService.getSubjectDistribution(),
    dashboardService.getPerformanceTrend(),
  ])

  return (
    <DashboardPage
      metrics={metrics}
      weeklyData={weeklyData}
      subjectData={subjectData}
      performanceData={performanceData}
    />
  )
}
