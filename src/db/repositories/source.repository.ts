import { prisma } from '@/db/prisma/client'

export class SourceRepository {
  async getFilterNames(): Promise<string[]> {
    const sources = await prisma.source.findMany({
      where: {
        slug: { in: ['jee-main', 'jee-advanced', 'board', 'neet'] },
      },
      orderBy: { name: 'asc' },
    })
    return sources.map((s) => s.name)
  }
}

export const sourceRepository = new SourceRepository()
