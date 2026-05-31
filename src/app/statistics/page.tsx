import { StatisticsPage } from '@/features/statistics/components/statistics-page'
import { statisticsService } from '@/services/statistics.service'

export default async function Page() {
  const [
    metrics,
    dailyStudyData,
    questionsData,
    accuracyTrendData,
    solveTimeData,
    weakestChapters,
    errorAnalysis,
  ] = await Promise.all([
    statisticsService.getMetrics(),
    statisticsService.getDailyStudy(),
    statisticsService.getQuestionsAttempted(),
    statisticsService.getAccuracyTrend(),
    statisticsService.getSolveTimeByDifficulty(),
    statisticsService.getWeakestChapters(),
    statisticsService.getErrorAnalysis(),
  ])

  return (
    <StatisticsPage
      metrics={metrics}
      dailyStudyData={dailyStudyData}
      questionsData={questionsData}
      accuracyTrendData={accuracyTrendData}
      solveTimeData={solveTimeData}
      weakestChapters={weakestChapters}
      errorAnalysis={errorAnalysis}
    />
  )
}
