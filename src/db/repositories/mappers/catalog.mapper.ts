import type { Chapter, Difficulty, Subject } from '@prisma/client'
import type { CatalogDifficulty, CatalogTreeItem } from '@/types/catalog'

type ChapterWithRelations = Chapter & {
  displayDifficulty: Difficulty | null
  _count: { questionChapters: number }
  children: (Chapter & {
    displayDifficulty: Difficulty | null
    _count: { questionChapters: number }
  })[]
}

type SubjectWithChapters = Subject & {
  chapters: ChapterWithRelations[]
}

function mapDifficulty(name: string | undefined): CatalogDifficulty | undefined {
  if (!name) return undefined
  if (name === 'Easy' || name === 'Medium' || name === 'Hard' || name === 'Very Hard') {
    return name
  }
  return undefined
}

function mapLevelChapter(chapter: ChapterWithRelations['children'][number]): CatalogTreeItem {
  const questionCount = chapter.catalogQuestionCount ?? chapter._count.questionChapters
  return {
    id: chapter.slug,
    name: chapter.name,
    type: 'level',
    questionCount,
    difficulty: mapDifficulty(chapter.displayDifficulty?.name),
  }
}

function mapTopicChapter(chapter: ChapterWithRelations): CatalogTreeItem {
  return {
    id: chapter.slug,
    name: chapter.name,
    type: 'topic',
    children: chapter.children.map(mapLevelChapter),
  }
}

export function mapSubjectsToCatalogTree(subjects: SubjectWithChapters[]): CatalogTreeItem[] {
  return subjects.map((subject) => ({
    id: subject.slug,
    name: subject.name,
    type: 'subject',
    children: subject.chapters
      .filter((chapter) => chapter.nodeType === 'TOPIC')
      .map(mapTopicChapter),
  }))
}
