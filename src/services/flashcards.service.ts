import { flashcardRepository } from '@/db/repositories/flashcard.repository'
import type { FlashcardCreateDto, FlashcardUpdateDto, FlashcardResponse } from '@/types/flashcard'

export const flashcardsService = {
  getSession: async () => {
    const [flashcards, dueCount] = await Promise.all([
      flashcardRepository.getSessionQueue(),
      flashcardRepository.getDueCount(),
    ])
    return { flashcards, dueCount }
  },
  reviewFlashcard: (flashcardId: number, response: FlashcardResponse) =>
    flashcardRepository.reviewFlashcard(flashcardId, response),
  getAllFlashcards: () => flashcardRepository.getAllFlashcards(),
  getFlashcardById: (id: number) => flashcardRepository.getFlashcardById(id),
  createFlashcard: (data: FlashcardCreateDto) => flashcardRepository.createFlashcard(data),
  updateFlashcard: (data: FlashcardUpdateDto) => flashcardRepository.updateFlashcard(data),
  deleteFlashcard: (id: number) => flashcardRepository.deleteFlashcard(id),
}
