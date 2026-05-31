export type CatalogNodeType = 'subject' | 'topic' | 'level'

export type CatalogDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard'

export interface CatalogTreeItem {
  id: string
  name: string
  type: CatalogNodeType
  questionCount?: number
  difficulty?: CatalogDifficulty
  expanded?: boolean
  children?: CatalogTreeItem[]
}
