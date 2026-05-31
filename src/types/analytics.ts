export interface DailyStudyPoint {
  date: string
  minutes: number
}

export interface QuestionsAttemptedPoint {
  date: string
  attempted: number
}

export interface AccuracyTrendPoint {
  date: string
  accuracy: number
}

export interface SolveTimeByDifficulty {
  difficulty: string
  avgTime: number
}

export interface WeakChapterStat {
  chapter: string
  accuracy: number
  attempted: number
}

export interface ErrorBreakdown {
  errorType: string
  count: number
  percentage: number
}

export interface WeeklyActivityPoint {
  day: string
  questions: number
  flashcards: number
  minutes: number
}

export interface SubjectDistributionPoint {
  name: string
  value: number
  color: string
}
