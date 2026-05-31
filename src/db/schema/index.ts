/**
 * Database entity shapes shared across repositories.
 * Replace with Prisma-generated types when persistence is added.
 */

export interface DbQuestion {
  id: string
  content: string
  source: string
  chapterId: string
  difficulty: string
  concepts: string[]
}

export interface DbFlashcard {
  id: string
  front: string
  back: string
  subject: string
  chapter: string
  concept: string
  nextReviewAt: Date | null
}

export interface DbCatalogNode {
  id: string
  name: string
  parentId: string | null
  type: 'subject' | 'topic' | 'level'
  questionCount?: number
}
