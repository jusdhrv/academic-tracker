import { prisma } from '@/db/prisma/client'
import {
  mapQuestionToPractice,
  type QuestionWithRelations,
} from '@/db/repositories/mappers/question.mapper'
import type { PracticeQuestion } from '@/types/question'

const questionInclude = {
  source: true,
  difficulty: true,
  chapters: { include: { chapter: true } },
  concepts: { include: { concept: true } },
} as const

export class QuestionRepository {
  async getPracticeSession(): Promise<PracticeQuestion[]> {
    const questions = await prisma.question.findMany({
      where: { questionNumber: { not: null } },
      orderBy: { questionNumber: 'asc' },
      take: 2,
      include: questionInclude,
    })

    return questions.map((q) => mapQuestionToPractice(q as QuestionWithRelations))
  }

  async countDue(): Promise<number> {
    return prisma.question.count({ where: { isDue: true } })
  }
}

export const questionRepository = new QuestionRepository()
