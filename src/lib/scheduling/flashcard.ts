import type { FlashcardResponse } from '@/types/flashcard'

/**
 * Placeholder for SM-2 / Anki-style interval calculation.
 * Will integrate with persisted review state via repositories.
 */
export function getNextReviewDays(response: FlashcardResponse): number {
  switch (response) {
    case 'again':
      return 0
    case 'hard':
      return 1
    case 'good':
      return 3
    case 'easy':
      return 7
    default:
      return 1
  }
}

export function countDueCards(dueCount: number): number {
  return dueCount
}
