import type { Difficulty } from '@prisma/client'
import type { CatalogDifficulty, CatalogTreeItem } from '@/types/catalog'

type QuestionWithRelations = {
  id: number
  content: string
  difficulty: Difficulty
}

type ConceptWithQuestions = {
  id: string
  name: string
  questionConcepts: { question: QuestionWithRelations }[]
}

type ChapterWithRelations = {
  id: string
  name: string
  slug: string
  sourceId: string | null
  catalogQuestionCount: number | null
  displayDifficulty: Difficulty | null
  source: { id: string; name: string; slug: string } | null
  concepts: ConceptWithQuestions[]
  _count: { questionChapters: number }
}

type SubjectWithTree = {
  id: string
  name: string
  slug: string
  chapters: ChapterWithRelations[]
}

function mapDifficulty(name: string | undefined): CatalogDifficulty | undefined {
  if (!name) return undefined
  if (name === 'Easy' || name === 'Medium' || name === 'Hard' || name === 'Very Hard') {
    return name
  }
  return undefined
}

function mapQuestionLeaf(
  question: QuestionWithRelations,
  context: CatalogTreeItem['context'],
): CatalogTreeItem {
  return {
    id: `question-${question.id}`,
    entityId: String(question.id),
    name: question.content.length > 60 ? `${question.content.slice(0, 60)}…` : question.content,
    type: 'question',
    difficulty: mapDifficulty(question.difficulty.name),
    context: { ...context, questionId: question.id },
  }
}

function mapDifficultyNodes(
  concept: ConceptWithQuestions,
  context: CatalogTreeItem['context'],
): CatalogTreeItem[] {
  const byDifficulty = new Map<string, QuestionWithRelations[]>()

  for (const link of concept.questionConcepts) {
    const diffName = link.question.difficulty.name
    const list = byDifficulty.get(diffName) ?? []
    list.push(link.question)
    byDifficulty.set(diffName, list)
  }

  return Array.from(byDifficulty.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([diffName, questions]) => ({
      id: `difficulty-${concept.id}-${slugify(diffName)}`,
      entityId: diffName,
      name: diffName,
      type: 'difficulty' as const,
      questionCount: questions.length,
      difficulty: mapDifficulty(diffName),
      context: { ...context, conceptId: concept.id },
      children: questions.map((q) =>
        mapQuestionLeaf(q, { ...context, conceptId: concept.id }),
      ),
    }))
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

function mapConceptNode(
  concept: ConceptWithQuestions,
  context: CatalogTreeItem['context'],
): CatalogTreeItem {
  return {
    id: `concept-${concept.id}`,
    entityId: concept.id,
    name: concept.name,
    type: 'concept',
    questionCount: concept.questionConcepts.length,
    context: { ...context, conceptId: concept.id },
    children: mapDifficultyNodes(concept, { ...context, conceptId: concept.id }),
  }
}

function mapChapterNode(
  chapter: ChapterWithRelations,
  context: CatalogTreeItem['context'],
): CatalogTreeItem {
  return {
    id: `chapter-${chapter.id}`,
    entityId: chapter.id,
    name: chapter.name,
    type: 'chapter',
    questionCount: chapter.catalogQuestionCount ?? chapter._count.questionChapters,
    difficulty: mapDifficulty(chapter.displayDifficulty?.name),
    context: { ...context, chapterId: chapter.id },
    children: chapter.concepts.map((c) =>
      mapConceptNode(c, { ...context, chapterId: chapter.id }),
    ),
  }
}

function mapSourceNode(
  source: { id: string; name: string },
  subjectId: string,
  chapters: ChapterWithRelations[],
): CatalogTreeItem {
  const chapterChildren = chapters.map((ch) =>
    mapChapterNode(ch, { subjectId, sourceId: source.id }),
  )

  return {
    id: `source-${subjectId}-${source.id}`,
    entityId: source.id,
    name: source.name,
    type: 'source',
    questionCount: chapterChildren.reduce((sum, ch) => sum + (ch.questionCount ?? 0), 0),
    context: { subjectId, sourceId: source.id },
    children: chapterChildren,
  }
}

export function mapSubjectsToCatalogTree(subjects: SubjectWithTree[]): CatalogTreeItem[] {
  return subjects.map((subject) => {
    const bySource = new Map<string, { source: { id: string; name: string }; chapters: ChapterWithRelations[] }>()

    for (const chapter of subject.chapters) {
      if (!chapter.sourceId || !chapter.source) continue
      const entry = bySource.get(chapter.sourceId) ?? {
        source: chapter.source,
        chapters: [],
      }
      entry.chapters.push(chapter)
      bySource.set(chapter.sourceId, entry)
    }

    const sourceChildren = Array.from(bySource.values())
      .sort((a, b) => a.source.name.localeCompare(b.source.name))
      .map(({ source, chapters }) => mapSourceNode(source, subject.id, chapters))

    return {
      id: `subject-${subject.id}`,
      entityId: subject.id,
      name: subject.name,
      type: 'subject' as const,
      questionCount: sourceChildren.reduce((sum, s) => sum + (s.questionCount ?? 0), 0),
      context: { subjectId: subject.id },
      children: sourceChildren,
    }
  })
}
