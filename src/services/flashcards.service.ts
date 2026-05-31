import { flashcardRepository } from '@/db/repositories/flashcard.repository'

export const flashcardsService = {
  getSession: async () => {
    const [flashcards, dueCount] = await Promise.all([
      flashcardRepository.getSessionQueue(),
      flashcardRepository.getDueCount(),
    ])
    return { flashcards, dueCount }
  },
}
