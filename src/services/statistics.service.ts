import {
  MOCK_ACCURACY_TREND,
  MOCK_DAILY_STUDY,
  MOCK_ERROR_ANALYSIS,
  MOCK_QUESTIONS_ATTEMPTED,
  MOCK_SOLVE_TIME,
  MOCK_STATISTICS_METRICS,
  MOCK_WEAKEST_CHAPTERS,
} from '@/features/statistics/data/mock-statistics'

export const statisticsService = {
  getMetrics: () => MOCK_STATISTICS_METRICS,
  getDailyStudy: () => MOCK_DAILY_STUDY,
  getQuestionsAttempted: () => MOCK_QUESTIONS_ATTEMPTED,
  getAccuracyTrend: () => MOCK_ACCURACY_TREND,
  getSolveTimeByDifficulty: () => MOCK_SOLVE_TIME,
  getWeakestChapters: () => MOCK_WEAKEST_CHAPTERS,
  getErrorAnalysis: () => MOCK_ERROR_ANALYSIS,
}
