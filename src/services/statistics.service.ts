import { statisticsRepository } from '@/db/repositories/statistics.repository'

export const statisticsService = {
  getMetrics: () => statisticsRepository.getMetrics(),
  getDailyStudy: () => statisticsRepository.getDailyStudy(),
  getQuestionsAttempted: () => statisticsRepository.getQuestionsAttempted(),
  getAccuracyTrend: () => statisticsRepository.getAccuracyTrend(),
  getSolveTimeByDifficulty: () => statisticsRepository.getSolveTimeByDifficulty(),
  getWeakestChapters: () => statisticsRepository.getWeakestChapters(),
  getErrorAnalysis: () => statisticsRepository.getErrorAnalysis(),
}
