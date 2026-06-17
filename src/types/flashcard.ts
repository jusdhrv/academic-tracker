export type FlashcardResponse = 'again' | 'hard' | 'good' | 'easy'

export interface Flashcard {
  id: number
  subject: string
  chapter: string
  concept: string
  front: string
  back: string
  easeFactor?: number
  intervalDays?: number
  reviewCount?: number
  lastReviewDate?: string
  nextReviewDate?: string
}

export interface FlashcardCreateDto {
  front: string
  back: string
  subjectId: string
  chapterId?: string
  conceptId?: string
}

export interface FlashcardUpdateDto extends Partial<FlashcardCreateDto> {
  id: number
}

export interface FlashcardReviewRecord {
  id: string
  flashcardId: number
  response: FlashcardResponse
  reviewedAt: string
  previousIntervalDays: number
  newIntervalDays: number
  previousEaseFactor: number
  newEaseFactor: number
  previousReviewDate?: string
  nextReviewDate?: string
}
