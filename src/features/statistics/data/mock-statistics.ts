import type {
  AccuracyTrendPoint,
  DailyStudyPoint,
  ErrorBreakdown,
  QuestionsAttemptedPoint,
  SolveTimeByDifficulty,
  WeakChapterStat,
} from '@/types/analytics'

export const MOCK_STATISTICS_METRICS = {
  totalStudyTime: '51h 20m',
  studyTimeDelta: '+8h this week',
  questionsAttempted: 847,
  flashcardsReviewed: 324,
  overallAccuracy: '85%',
  accuracyDelta: '+3% this month',
  avgSolveTime: '3.2m',
  solveTimeDelta: '-0.3m vs last week',
} as const

export const MOCK_DAILY_STUDY: DailyStudyPoint[] = [
  { date: '1 Nov', minutes: 45 },
  { date: '2 Nov', minutes: 62 },
  { date: '3 Nov', minutes: 38 },
  { date: '4 Nov', minutes: 75 },
  { date: '5 Nov', minutes: 68 },
  { date: '6 Nov', minutes: 85 },
  { date: '7 Nov', minutes: 55 },
]

export const MOCK_QUESTIONS_ATTEMPTED: QuestionsAttemptedPoint[] = [
  { date: '1 Nov', attempted: 12 },
  { date: '2 Nov', attempted: 19 },
  { date: '3 Nov', attempted: 15 },
  { date: '4 Nov', attempted: 25 },
  { date: '5 Nov', attempted: 22 },
  { date: '6 Nov', attempted: 28 },
  { date: '7 Nov', attempted: 18 },
]

export const MOCK_ACCURACY_TREND: AccuracyTrendPoint[] = [
  { date: 'Week 1', accuracy: 72 },
  { date: 'Week 2', accuracy: 75 },
  { date: 'Week 3', accuracy: 78 },
  { date: 'Week 4', accuracy: 82 },
  { date: 'Week 5', accuracy: 85 },
]

export const MOCK_SOLVE_TIME: SolveTimeByDifficulty[] = [
  { difficulty: 'Easy', avgTime: 1.2 },
  { difficulty: 'Medium', avgTime: 2.5 },
  { difficulty: 'Hard', avgTime: 4.8 },
  { difficulty: 'Very Hard', avgTime: 6.2 },
]

export const MOCK_WEAKEST_CHAPTERS: WeakChapterStat[] = [
  { chapter: 'Electromagnetism', accuracy: 62, attempted: 24 },
  { chapter: 'Organic Chemistry', accuracy: 68, attempted: 31 },
  { chapter: 'Differential Equations', accuracy: 71, attempted: 28 },
  { chapter: 'Thermodynamics', accuracy: 74, attempted: 22 },
]

export const MOCK_ERROR_ANALYSIS: ErrorBreakdown[] = [
  { errorType: 'Calculation', count: 24, percentage: 35 },
  { errorType: 'Conceptual', count: 16, percentage: 24 },
  { errorType: 'Careless', count: 18, percentage: 26 },
  { errorType: 'Methodology', count: 10, percentage: 15 },
]
