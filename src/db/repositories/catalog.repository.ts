import { prisma } from '@/db/prisma/client'
import { mapSubjectsToCatalogTree } from '@/db/repositories/mappers/catalog.mapper'
import type {
  CatalogFormOptions,
  CatalogNodeDetail,
  CatalogQuestionSummary,
  CatalogSelectionContext,
  CatalogTreeItem,
} from '@/types/catalog'

const chapterInclude = {
  source: true,
  displayDifficulty: true,
  _count: { select: { questionChapters: true } },
  concepts: {
    orderBy: { name: 'asc' as const },
    include: {
      questionConcepts: {
        include: {
          question: { include: { difficulty: true } },
        },
      },
    },
  },
} as const

export class CatalogRepository {
  async getTree(): Promise<CatalogTreeItem[]> {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: {
        chapters: {
          where: { sourceId: { not: null }, nodeType: 'CHAPTER' },
          orderBy: { name: 'asc' },
          include: chapterInclude,
        },
      },
    })

    return mapSubjectsToCatalogTree(subjects)
  }

  async getFormOptions(): Promise<CatalogFormOptions> {
    const [subjects, sources, chapters, concepts, difficulties] = await Promise.all([
      prisma.subject.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
      prisma.source.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
      prisma.chapter.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, subjectId: true, sourceId: true },
      }),
      prisma.concept.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, chapterId: true },
      }),
      prisma.difficulty.findMany({
        orderBy: { sortOrder: 'asc' },
        select: { id: true, name: true },
      }),
    ])

    return { subjects, sources, chapters, concepts, difficulties }
  }

  async getNodeDetail(
    type: string,
    entityId: string,
    context: CatalogSelectionContext = {},
  ): Promise<CatalogNodeDetail | null> {
    switch (type) {
      case 'subject':
        return this.getSubjectDetail(entityId)
      case 'source':
        return this.getSourceDetail(entityId, context.subjectId as string | undefined)
      case 'chapter':
        return this.getChapterDetail(entityId)
      case 'concept':
        return this.getConceptDetail(entityId)
      case 'difficulty':
        return this.getDifficultyDetail(
          entityId,
          context.conceptId as string | undefined,
        )
      case 'question':
        return this.getQuestionDetail(Number(entityId))
      default:
        return null
    }
  }

  private async getSubjectDetail(id: string): Promise<CatalogNodeDetail> {
    const subject = await prisma.subject.findUniqueOrThrow({
      where: { id },
      include: {
        chapters: {
          include: {
            questionChapters: {
              include: {
                question: {
                  include: {
                    source: true,
                    difficulty: true,
                    concepts: { include: { concept: true } },
                    chapters: { include: { chapter: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    const questions = this.collectQuestionsFromChapters(subject.chapters)
    return {
      type: 'subject',
      entityId: id,
      name: subject.name,
      questionCount: questions.length,
      difficultyBreakdown: this.difficultyBreakdown(questions),
      tags: [],
      context: { subjectId: id },
      questions: questions.slice(0, 20),
    }
  }

  private async getSourceDetail(id: string, subjectId?: string): Promise<CatalogNodeDetail> {
    const source = await prisma.source.findUniqueOrThrow({ where: { id } })
    const chapters = await prisma.chapter.findMany({
      where: { sourceId: id, ...(subjectId ? { subjectId } : {}) },
      include: {
        questionChapters: {
          include: {
            question: {
              include: {
                difficulty: true,
                concepts: { include: { concept: true } },
                chapters: { include: { chapter: true } },
              },
            },
          },
        },
      },
    })

    const questions = this.collectQuestionsFromChapters(chapters)
    return {
      type: 'source',
      entityId: id,
      name: source.name,
      questionCount: questions.length,
      difficultyBreakdown: this.difficultyBreakdown(questions),
      tags: [],
      context: { subjectId, sourceId: id },
      questions: questions.slice(0, 20),
    }
  }

  private async getChapterDetail(id: string): Promise<CatalogNodeDetail> {
    const chapter = await prisma.chapter.findUniqueOrThrow({
      where: { id },
      include: {
        concepts: true,
        questionChapters: {
          include: {
            question: {
              include: {
                difficulty: true,
                concepts: { include: { concept: true } },
                chapters: { include: { chapter: true } },
              },
            },
          },
        },
      },
    })

    const questions = chapter.questionChapters.map((qc) =>
      this.mapQuestionSummary(qc.question),
    )

    return {
      type: 'chapter',
      entityId: id,
      name: chapter.name,
      questionCount: questions.length,
      difficultyBreakdown: this.difficultyBreakdown(questions),
      tags: chapter.concepts.map((c) => c.name),
      context: {
        subjectId: chapter.subjectId,
        sourceId: chapter.sourceId ?? undefined,
        chapterId: id,
      },
      questions,
    }
  }

  private async getConceptDetail(id: string): Promise<CatalogNodeDetail> {
    const concept = await prisma.concept.findUniqueOrThrow({
      where: { id },
      include: {
        chapter: true,
        questionConcepts: {
          include: {
            question: {
              include: {
                difficulty: true,
                concepts: { include: { concept: true } },
                chapters: { include: { chapter: true } },
              },
            },
          },
        },
      },
    })

    const questions = concept.questionConcepts.map((qc) =>
      this.mapQuestionSummary(qc.question),
    )

    return {
      type: 'concept',
      entityId: id,
      name: concept.name,
      questionCount: questions.length,
      difficultyBreakdown: this.difficultyBreakdown(questions),
      tags: [concept.name],
      context: {
        chapterId: concept.chapterId ?? undefined,
        conceptId: id,
      },
      questions,
    }
  }

  private async getDifficultyDetail(
    difficultyName: string,
    conceptId?: string,
  ): Promise<CatalogNodeDetail> {
    const difficulty = await prisma.difficulty.findFirst({
      where: { name: difficultyName },
    })

    const questions = await prisma.question.findMany({
      where: {
        difficulty: { name: difficultyName },
        ...(conceptId ? { concepts: { some: { conceptId } } } : {}),
      },
      include: {
        difficulty: true,
        concepts: { include: { concept: true } },
        chapters: { include: { chapter: true } },
      },
      take: 50,
    })

    const summaries = questions.map((q) => this.mapQuestionSummary(q))

    return {
      type: 'difficulty',
      entityId: difficulty?.id ?? difficultyName,
      name: difficultyName,
      questionCount: summaries.length,
      difficultyBreakdown: [{ name: difficultyName, count: summaries.length }],
      tags: [],
      context: { conceptId, difficultyId: difficulty?.id },
      questions: summaries,
    }
  }

  private async getQuestionDetail(id: number): Promise<CatalogNodeDetail> {
    const question = await prisma.question.findUniqueOrThrow({
      where: { id },
      include: {
        difficulty: true,
        concepts: { include: { concept: true } },
        chapters: { include: { chapter: true } },
      },
    })

    const summary = this.mapQuestionSummary(question)
    return {
      type: 'question',
      entityId: String(id),
      name: summary.content,
      questionCount: 1,
      difficultyBreakdown: [{ name: question.difficulty.name, count: 1 }],
      tags: question.concepts.map((c) => c.concept.name),
      context: { questionId: id },
      questions: [summary],
    }
  }

  private mapQuestionSummary(question: {
    id: number
    content: string
    difficulty: { name: string }
    chapters: { chapter: { name: string } }[]
    concepts: { concept: { name: string } }[]
    source?: { name: string }
  }): CatalogQuestionSummary {
    return {
      id: question.id,
      content: question.content,
      source: question.source?.name ?? 'Unknown',
      difficulty: question.difficulty.name,
      chapters: question.chapters.map((c) => c.chapter.name),
      concepts: question.concepts.map((c) => c.concept.name),
    }
  }

  private collectQuestionsFromChapters(
    chapters: {
      questionChapters: {
        question: {
          id: number
          content: string
          difficulty: { name: string }
          concepts: { concept: { name: string } }[]
          chapters: { chapter: { name: string } }[]
          source?: { name: string }
        }
      }[]
    }[],
  ): CatalogQuestionSummary[] {
    const seen = new Set<number>()
    const result: CatalogQuestionSummary[] = []

    for (const chapter of chapters) {
      for (const qc of chapter.questionChapters) {
        if (seen.has(qc.question.id)) continue
        seen.add(qc.question.id)
        result.push(this.mapQuestionSummary(qc.question))
      }
    }

    return result
  }

  private difficultyBreakdown(
    questions: CatalogQuestionSummary[],
  ): { name: string; count: number }[] {
    const counts = new Map<string, number>()
    for (const q of questions) {
      counts.set(q.difficulty, (counts.get(q.difficulty) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }))
  }
}

export const catalogRepository = new CatalogRepository()
