import { prisma } from '@/db/prisma/client'
import { slugify, uniqueSlug } from '@/lib/utils/slug'

export class CatalogCrudRepository {
  // --- Subject ---
  async createSubject(data: { name: string; chartColor?: string }) {
    const slug = await uniqueSlug(data.name, (s) =>
      prisma.subject.findUnique({ where: { slug: s } }).then(Boolean),
    )
    return prisma.subject.create({
      data: { name: data.name, slug, chartColor: data.chartColor },
    })
  }

  async updateSubject(id: string, data: { name: string; chartColor?: string }) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.subject.findUnique({ where: { slug: s } })
      return !!existing && existing.id !== id
    })
    return prisma.subject.update({
      where: { id },
      data: { name: data.name, slug, chartColor: data.chartColor },
    })
  }

  async deleteSubject(id: string) {
    return prisma.subject.delete({ where: { id } })
  }

  // --- Source ---
  async createSource(data: { name: string }) {
    const slug = await uniqueSlug(data.name, (s) =>
      prisma.source.findUnique({ where: { slug: s } }).then(Boolean),
    )
    return prisma.source.create({ data: { name: data.name, slug } })
  }

  async updateSource(id: string, data: { name: string }) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.source.findUnique({ where: { slug: s } })
      return !!existing && existing.id !== id
    })
    return prisma.source.update({ where: { id }, data: { name: data.name, slug } })
  }

  async deleteSource(id: string) {
    const linked = await prisma.question.count({ where: { sourceId: id } })
    if (linked > 0) throw new Error(`Cannot delete source: ${linked} question(s) still reference it`)
    return prisma.source.delete({ where: { id } })
  }

  // --- Chapter ---
  async createChapter(data: {
    name: string
    subjectId: string
    sourceId: string
    displayDifficultyId?: string
    catalogQuestionCount?: number
  }) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.chapter.findFirst({
        where: { subjectId: data.subjectId, slug: s },
      })
      return !!existing
    })
    return prisma.chapter.create({
      data: {
        name: data.name,
        slug,
        nodeType: 'CHAPTER',
        subjectId: data.subjectId,
        sourceId: data.sourceId,
        displayDifficultyId: data.displayDifficultyId,
        catalogQuestionCount: data.catalogQuestionCount,
      },
    })
  }

  async updateChapter(
    id: string,
    data: {
      name: string
      subjectId: string
      sourceId: string
      displayDifficultyId?: string | null
      catalogQuestionCount?: number | null
    },
  ) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.chapter.findFirst({
        where: { subjectId: data.subjectId, slug: s, NOT: { id } },
      })
      return !!existing
    })
    return prisma.chapter.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        subjectId: data.subjectId,
        sourceId: data.sourceId,
        displayDifficultyId: data.displayDifficultyId,
        catalogQuestionCount: data.catalogQuestionCount,
      },
    })
  }

  async deleteChapter(id: string) {
    return prisma.chapter.delete({ where: { id } })
  }

  // --- Concept ---
  async createConcept(data: { name: string; chapterId: string }) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.concept.findFirst({
        where: { chapterId: data.chapterId, slug: s },
      })
      return !!existing
    })
    return prisma.concept.create({
      data: { name: data.name, slug, chapterId: data.chapterId },
    })
  }

  async updateConcept(id: string, data: { name: string; chapterId: string }) {
    const slug = await uniqueSlug(data.name, async (s) => {
      const existing = await prisma.concept.findFirst({
        where: { chapterId: data.chapterId, slug: s, NOT: { id } },
      })
      return !!existing
    })
    return prisma.concept.update({
      where: { id },
      data: { name: data.name, slug, chapterId: data.chapterId },
    })
  }

  async deleteConcept(id: string) {
    return prisma.concept.delete({ where: { id } })
  }

  // --- Difficulty ---
  async createDifficulty(data: { name: string; sortOrder?: number }) {
    const slug = slugify(data.name)
    return prisma.difficulty.create({
      data: { name: data.name, slug, sortOrder: data.sortOrder ?? 0 },
    })
  }

  async updateDifficulty(
    id: string,
    data: { name: string; sortOrder?: number },
  ) {
    const slug = slugify(data.name)
    return prisma.difficulty.update({
      where: { id },
      data: { name: data.name, slug, sortOrder: data.sortOrder },
    })
  }

  async deleteDifficulty(id: string) {
    const linked = await prisma.question.count({ where: { difficultyId: id } })
    if (linked > 0) {
      throw new Error(`Cannot delete difficulty: ${linked} question(s) still reference it`)
    }
    return prisma.difficulty.delete({ where: { id } })
  }

  // --- Question ---
  async createQuestion(data: {
    content: string
    sourceId: string
    difficultyId: string
    chapterIds: string[]
    conceptIds: string[]
    questionNumber?: number
  }) {
    return prisma.question.create({
      data: {
        content: data.content,
        sourceId: data.sourceId,
        difficultyId: data.difficultyId,
        questionNumber: data.questionNumber,
        chapters: { create: data.chapterIds.map((chapterId) => ({ chapterId })) },
        concepts: { create: data.conceptIds.map((conceptId) => ({ conceptId })) },
      },
    })
  }

  async updateQuestion(
    id: number,
    data: {
      content: string
      sourceId: string
      difficultyId: string
      chapterIds: string[]
      conceptIds: string[]
      questionNumber?: number | null
    },
  ) {
    await prisma.questionChapter.deleteMany({ where: { questionId: id } })
    await prisma.questionConcept.deleteMany({ where: { questionId: id } })

    return prisma.question.update({
      where: { id },
      data: {
        content: data.content,
        sourceId: data.sourceId,
        difficultyId: data.difficultyId,
        questionNumber: data.questionNumber,
        chapters: { create: data.chapterIds.map((chapterId) => ({ chapterId })) },
        concepts: { create: data.conceptIds.map((conceptId) => ({ conceptId })) },
      },
    })
  }

  async deleteQuestion(id: number) {
    return prisma.question.delete({ where: { id } })
  }

  async getQuestionForEdit(id: number) {
    return prisma.question.findUnique({
      where: { id },
      include: {
        chapters: true,
        concepts: true,
      },
    })
  }
}

export const catalogCrudRepository = new CatalogCrudRepository()
