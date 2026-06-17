import type { FlashcardResponse } from '@/types/flashcard'

export type FlashcardSchedule = {
  nextReviewAt: Date
  intervalDays: number
  easeFactor: number
}

const MIN_EASE_FACTOR = 1.3

function mapResponseToQuality(response: FlashcardResponse) {
  switch (response) {
    case 'again':
      return 2
    case 'hard':
      return 3
    case 'good':
      return 4
    case 'easy':
      return 5
    default:
      return 3
  }
}

export function getNextReviewSchedule(
  response: FlashcardResponse,
  currentIntervalDays: number,
  currentEaseFactor: number,
  reviewCount: number,
): FlashcardSchedule {
  const quality = mapResponseToQuality(response)
  let easeFactor = currentEaseFactor
  let intervalDays = currentIntervalDays

  if (quality < 3) {
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2)
    intervalDays = 1
  } else {
    const delta = 5 - quality
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor + (0.1 - delta * (0.08 + delta * 0.02)))

    if (reviewCount === 0) {
      intervalDays = 1
    } else if (reviewCount === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor))
    }
  }

  const nextReviewAt = new Date()
  nextReviewAt.setHours(23, 59, 59, 999)
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays)

  return {
    nextReviewAt,
    intervalDays,
    easeFactor,
  }
}
