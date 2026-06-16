import { StatisticsPage } from '@/features/statistics/components/statistics-page'
import { statisticsService } from '@/services/statistics.service'
import type { AnalyticsFilters } from '@/types/analytics'

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const normalizeParam = (value: string | string[] | undefined) =>
    typeof value === 'string' && value !== '' ? value : undefined

  const filters: AnalyticsFilters = {
    startDate: normalizeParam(searchParams.startDate),
    endDate: normalizeParam(searchParams.endDate),
    subjectId: normalizeParam(searchParams.subjectId),
    chapterId: normalizeParam(searchParams.chapterId),
  }

  const [analyticsData, subjectOptions, chapterOptions] = await Promise.all([
    statisticsService.getAnalyticsData(filters),
    statisticsService.getSubjectOptions(),
    statisticsService.getChapterOptions(filters.subjectId),
  ])

  return (
    <StatisticsPage
      metrics={{
        totalStudyTime: analyticsData.metrics.totalStudyTime,
        studyTimeDelta: analyticsData.metrics.studyTimeDelta,
        questionsAttempted: analyticsData.metrics.questionsAttempted,
        flashcardsReviewed: analyticsData.metrics.reviewQueueSize,
        overallAccuracy: analyticsData.metrics.overallAccuracy,
        accuracyDelta: analyticsData.metrics.accuracyDelta,
        avgSolveTime: analyticsData.metrics.avgSolveTime,
        solveTimeDelta: analyticsData.metrics.solveTimeDelta,
      }}
      dailyStudyData={analyticsData.dailyStudyData}
      questionsData={analyticsData.questionsData}
      accuracyTrendData={analyticsData.accuracyTrendData}
      solveTimeData={analyticsData.solveTimeData}
      weakestChapters={analyticsData.weakestChapters}
      errorAnalysis={analyticsData.errorAnalysis}
      startDate={filters.startDate}
      endDate={filters.endDate}
      selectedSubjectId={filters.subjectId}
      selectedChapterId={filters.chapterId}
      subjectOptions={subjectOptions}
      chapterOptions={chapterOptions}
    />
  )
}
