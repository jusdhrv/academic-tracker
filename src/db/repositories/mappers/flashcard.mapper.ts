import type { Chapter, Concept, Flashcard, Subject } from '@prisma/client'
import type { Flashcard as FlashcardDto } from '@/types/flashcard'

export type FlashcardWithRelations = Flashcard & {
  subject: Subject
  chapter: Chapter | null
  concept: Concept | null
}

export function mapFlashcardToDto(flashcard: FlashcardWithRelations): FlashcardDto {
  return {
    id: flashcard.id,
    subject: flashcard.subject.name,
    chapter: flashcard.chapter?.name ?? 'General',
    concept: flashcard.concept?.name ?? 'General',
    front: flashcard.front,
    back: flashcard.back,
    easeFactor: flashcard.easeFactor,
    intervalDays: flashcard.intervalDays,
    reviewCount: flashcard.reviewCount,
    lastReviewDate: flashcard.lastReviewDate?.toISOString(),
    nextReviewDate: flashcard.nextReviewAt?.toISOString(),
  }
}
