export type QuestionOutcome = 'solved-fast' | 'solved-slow' | 'failed' | 'skipped'

export interface PracticeSessionFilters {
    subjectIds?: string[]
    sourceIds?: string[]
    chapterIds?: string[]
    difficultyIds?: string[]
}

export interface CreatePracticeSessionRequest {
    sessionDuration: number // total session duration in seconds
    targetTimePerQuestion: number // target time per question in minutes
    filters: PracticeSessionFilters
}

export interface PracticeSessionResponse {
    id: string
    sessionDuration: number
    targetTimePerQuestion: number
    selectedQuestions: number[] // array of question IDs
    filterCriteria: PracticeSessionFilters
    startedAt: Date
    endedAt: Date | null
}

export interface PracticeQuestionAttemptRequest {
    sessionId: string
    questionId: number
    outcome: QuestionOutcome
    elapsedSeconds: number
}

export interface PracticeQuestionAttemptResponse {
    id: string
    sessionId: string
    questionId: number
    outcome: QuestionOutcome
    elapsedSeconds: number
    createdAt: Date
}

export interface QuestionForPractice {
    id: number
    questionNumber: number | null
    source: string
    chapter: string
    concepts: string[]
    difficulty: string
    content: string
    masteryScore: number
    lastSeen: Date | null
    totalAttempts: number
}
