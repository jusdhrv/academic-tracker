import type { FlashcardResponse } from '@/types/flashcard'

export function calculateSessionProgress(
  responses: Record<number, FlashcardResponse>,
  totalCards: number,
): number {
  if (totalCards === 0) return 0
  return (Object.keys(responses).length / totalCards) * 100
}

export function countResponsesByType(
  responses: Record<number, FlashcardResponse>,
  type: FlashcardResponse,
): number {
  return Object.values(responses).filter((r) => r === type).length
}
