import type { CatalogTreeItem } from '@/types/catalog'

export interface CatalogFilters {
  search: string
  subjectId: string | null
  sourceId: string | null
  difficulty: string | null
}

function matchesSearch(item: CatalogTreeItem, query: string): boolean {
  if (!query) return true
  return item.name.toLowerCase().includes(query.toLowerCase())
}

function filterNode(item: CatalogTreeItem, filters: CatalogFilters): CatalogTreeItem | null {
  const query = filters.search.trim().toLowerCase()

  if (filters.subjectId && item.type === 'subject' && item.entityId !== filters.subjectId) {
    return null
  }
  if (filters.sourceId && item.type === 'source' && item.entityId !== filters.sourceId) {
    return null
  }
  if (filters.difficulty && item.type === 'difficulty' && item.name !== filters.difficulty) {
    return null
  }

  const filteredChildren = (item.children ?? [])
    .map((child) => filterNode(child, filters))
    .filter((child): child is CatalogTreeItem => child !== null)

  const selfMatches = !query || matchesSearch(item, query)
  const childMatches = filteredChildren.length > 0

  if (!selfMatches && !childMatches) return null

  return {
    ...item,
    children: filteredChildren.length > 0 ? filteredChildren : item.children && query ? filteredChildren : item.children,
  }
}

export function filterCatalogTree(
  tree: CatalogTreeItem[],
  filters: CatalogFilters,
): CatalogTreeItem[] {
  return tree
    .map((item) => filterNode(item, filters))
    .filter((item): item is CatalogTreeItem => item !== null)
}
