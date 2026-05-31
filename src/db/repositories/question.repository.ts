import type { PracticeQuestion } from '@/types/question'
import { MOCK_PRACTICE_QUESTIONS } from '@/features/practice/data/mock-questions'

export class QuestionRepository {
  async getPracticeSession(): Promise<PracticeQuestion[]> {
    return MOCK_PRACTICE_QUESTIONS
  }
}

export const questionRepository = new QuestionRepository()
