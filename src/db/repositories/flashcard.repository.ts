import { prisma } from '@/db/prisma/client'
import { mapFlashcardToDto } from '@/db/repositories/mappers/flashcard.mapper'
import type { Flashcard } from '@/types/flashcard'

const flashcardInclude = {
  subject: true,
  chapter: true,
  concept: true,
} as const

export class FlashcardRepository {
  async getSessionQueue(): Promise<Flashcard[]> {
    const cards = await prisma.flashcard.findMany({
      orderBy: { id: 'asc' },
      take: 3,
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
}

export const flashcardRepository = new FlashcardRepository()
