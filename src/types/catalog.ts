export type CatalogNodeType =
  | 'subject'
  | 'source'
  | 'chapter'
  | 'concept'
  | 'difficulty'
  | 'question'

export type CatalogDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

export interface CatalogSelectionContext {
  subjectId?: string
  sourceId?: string
  chapterId?: string
  conceptId?: string
  difficultyId?: string
  questionId?: number
}

export interface CatalogTreeItem {
  id: string
  entityId: string
  name: string
  type: CatalogNodeType
  questionCount?: number
  difficulty?: CatalogDifficulty
  children?: CatalogTreeItem[]
  context?: CatalogSelectionContext
}

export interface CatalogFormOptions {
  subjects: { id: string; name: string }[]
  sources: { id: string; name: string }[]
  chapters: { id: string; name: string; subjectId: string; sourceId: string | null }[]
  concepts: { id: string; name: string; chapterId: string | null }[]
  difficulties: { id: string; name: string }[]
}

export interface CatalogNodeDetail {
  type: CatalogNodeType
  entityId: string
  name: string
  questionCount: number
  difficultyBreakdown: { name: string; count: number }[]
  tags: string[]
  context: CatalogSelectionContext
  questions: CatalogQuestionSummary[]
}

export interface CatalogQuestionSummary {
  id: number
  content: string
  source: string
  difficulty: string
  chapters: string[]
  concepts: string[]
}
