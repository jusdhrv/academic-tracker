import type { Flashcard } from '@/types/flashcard'
import { MOCK_FLASHCARDS } from '@/features/flashcards/data/mock-flashcards'

export class FlashcardRepository {
  async getSessionQueue(): Promise<Flashcard[]> {
    return MOCK_FLASHCARDS
  }

  async getDueCount(): Promise<number> {
    return 47
  }
}

export const flashcardRepository = new FlashcardRepository()
