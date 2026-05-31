import { prisma } from '@/db/prisma/client'
import { mapSubjectsToCatalogTree } from '@/db/repositories/mappers/catalog.mapper'
import type { CatalogTreeItem } from '@/types/catalog'

export class CatalogRepository {
  async getTree(): Promise<CatalogTreeItem[]> {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          where: { nodeType: 'TOPIC', parentId: null },
          orderBy: { name: 'asc' },
          include: {
            displayDifficulty: true,
            _count: { select: { questionChapters: true } },
            children: {
              where: { nodeType: 'LEVEL' },
              orderBy: { name: 'asc' },
              include: {
                displayDifficulty: true,
                _count: { select: { questionChapters: true } },
              },
            },
          },
        },
      },
    })

    return mapSubjectsToCatalogTree(subjects)
  }
}

export const catalogRepository = new CatalogRepository()
