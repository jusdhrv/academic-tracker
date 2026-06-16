import { difficultyRepository } from '@/db/repositories/difficulty.repository'
import { questionRepository } from '@/db/repositories/question.repository'
import { sourceRepository } from '@/db/repositories/source.repository'
import { subjectRepository } from '@/db/repositories/subject.repository'
import { practiceRepository } from '@/db/repositories/practice.repository'
import type { CreatePracticeSessionRequest, PracticeSessionResponse } from '@/types/practice-session'

export const practiceService = {
  getFilterOptions: async () => {
    const [subjects, sources, difficulties] = await Promise.all([
      subjectRepository.getAllNames(),
      sourceRepository.getFilterNames(),
      difficultyRepository.getAllNames(),
    ])
    return { subjects, sources, difficulties }
  },

  /**
   * Create a new practice session with selected questions.
   * Questions are intelligently selected based on priority scoring.
   */
  startSession: async (request: CreatePracticeSessionRequest) => {
    return fetch('/api/practice/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }).then((res) => res.json())
  },

  /**
   * Get session details by ID.
   */
  getSession: async (sessionId: string) => {
    return fetch(`/api/practice/sessions?id=${sessionId}`).then((res) => res.json())
  },

  /**
   * Record a question attempt.
   */
  recordAttempt: async (data: {
    sessionId: string
    questionId: number
    outcome: 'solved-fast' | 'solved-slow' | 'failed' | 'skipped'
    elapsedSeconds: number
    confidence: number
    errorType: string
    questionType: string
    tags: string[]
  }) => {
    return fetch('/api/practice/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  },

  /**
   * Get all attempts for a session.
   */
  getSessionAttempts: async (sessionId: string) => {
    return fetch(`/api/practice/attempts?sessionId=${sessionId}`).then((res) => res.json())
  },

  /**
   * Legacy: Get practice session (backward compatibility).
   */
  getPracticeSession: () => questionRepository.getPracticeSession(),
}

