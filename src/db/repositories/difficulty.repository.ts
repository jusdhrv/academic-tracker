import { prisma } from '@/db/prisma/client'

export class DifficultyRepository {
  async getAllNames(): Promise<string[]> {
    const difficulties = await prisma.difficulty.findMany({ orderBy: { sortOrder: 'asc' } })
    return difficulties.map((d) => d.name)
  }
}

export const difficultyRepository = new DifficultyRepository()
