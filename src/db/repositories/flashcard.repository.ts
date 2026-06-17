import { prisma } from '@/db/prisma/client'
import { mapFlashcardToDto } from '@/db/repositories/mappers/flashcard.mapper'
import type { Flashcard } from '@/types/flashcard'
import type { FlashcardCreateDto, FlashcardUpdateDto, FlashcardResponse } from '@/types/flashcard'
import { getNextReviewSchedule } from '@/lib/scheduling/flashcard'

const flashcardInclude = {
  subject: true,
  chapter: true,
  concept: true,
} as const

export class FlashcardRepository {
  async getSessionQueue(): Promise<Flashcard[]> {
    const cards = await prisma.flashcard.findMany({
      where: {
        OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: new Date() } }],
      },
      orderBy: [
        { nextReviewAt: 'asc' },
        { reviewCount: 'asc' },
        { updatedAt: 'asc' },
      ],
      include: flashcardInclude,
    })

    return cards.map(mapFlashcardToDto)
  }

  async getDueCount(): Promise<number> {
    return prisma.flashcard.count({
      where: {
        OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: new Date() } }],
      },
    })
  }

  async getAllFlashcards(): Promise<Flashcard[]> {
    const cards = await prisma.flashcard.findMany({
      orderBy: [{ subject: { name: 'asc' } }, { chapter: { name: 'asc' } }, { concept: { name: 'asc' } }, { id: 'asc' }],
      include: flashcardInclude,
    })

    return cards.map(mapFlashcardToDto)
  }

  async getFlashcardById(id: number): Promise<Flashcard | null> {
    const card = await prisma.flashcard.findUnique({
      where: { id },
      include: flashcardInclude,
    })

    return card ? mapFlashcardToDto(card) : null
  }

  async createFlashcard(data: FlashcardCreateDto): Promise<Flashcard> {
    const card = await prisma.flashcard.create({
      data: {
        front: data.front,
        back: data.back,
        subjectId: data.subjectId,
        chapterId: data.chapterId,
        conceptId: data.conceptId,
      },
      include: flashcardInclude,
    })

    return mapFlashcardToDto(card)
  }

  async updateFlashcard(data: FlashcardUpdateDto): Promise<Flashcard> {
    const card = await prisma.flashcard.update({
      where: { id: data.id },
      data: {
        front: data.front,
        back: data.back,
        subjectId: data.subjectId,
        chapterId: data.chapterId,
        conceptId: data.conceptId,
      },
      include: flashcardInclude,
    })

    return mapFlashcardToDto(card)
  }

  async deleteFlashcard(id: number): Promise<void> {
    await prisma.flashcard.delete({ where: { id } })
  }

  async reviewFlashcard(flashcardId: number, response: FlashcardResponse) {
    const card = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      include: flashcardInclude,
    })

    if (!card) {
      throw new Error('Flashcard not found')
    }

    const schedule = getNextReviewSchedule(
      response,
      card.intervalDays,
      card.easeFactor,
      card.reviewCount,
    )

    const reviewCount = card.reviewCount + 1
    const now = new Date()

    const [updatedCard] = await prisma.$transaction([
      prisma.flashcard.update({
        where: { id: flashcardId },
        data: {
          easeFactor: schedule.easeFactor,
          intervalDays: schedule.intervalDays,
          reviewCount,
          lastReviewDate: now,
          nextReviewAt: schedule.nextReviewAt,
        },
        include: flashcardInclude,
      }),
      prisma.flashcardReview.create({
        data: {
          flashcardId,
          response,
          previousIntervalDays: card.intervalDays,
          newIntervalDays: schedule.intervalDays,
          previousEaseFactor: card.easeFactor,
          newEaseFactor: schedule.easeFactor,
          previousReviewDate: card.lastReviewDate,
          nextReviewDate: schedule.nextReviewAt,
        },
      }),
    ])

    return mapFlashcardToDto(updatedCard)
  }
}

export const flashcardRepository = new FlashcardRepository()
