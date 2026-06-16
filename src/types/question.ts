export interface PracticeQuestion {
  id: number
  questionNumber: number
  source: string
  chapter: string
  concepts: string[]
  difficulty: string
  content: string
}

export interface QuestionForPractice extends PracticeQuestion {
  masteryScore: number
  lastSeen: Date | null
  totalAttempts: number
}

export type QuestionOutcome = 'solved-fast' | 'solved-slow' | 'failed' | 'skipped'

export interface QuestionSubmissionFeedback {
  isOpen: boolean
  confidence: number
  errorType: string
  questionType: string
}
