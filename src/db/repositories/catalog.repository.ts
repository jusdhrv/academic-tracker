import type { CatalogTreeItem } from '@/types/catalog'
import { MOCK_CATALOG_TREE } from '@/features/catalog/data/mock-catalog'

/**
 * Catalog data access. Pages and components must use this layer, not Prisma directly.
 */
export class CatalogRepository {
  async getTree(): Promise<CatalogTreeItem[]> {
    return MOCK_CATALOG_TREE
  }
}

export const catalogRepository = new CatalogRepository()
