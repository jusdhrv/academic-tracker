import { CatalogPage } from '@/features/catalog/components/catalog-page'
import { catalogService } from '@/services/catalog.service'

export default async function Page() {
  const catalogTree = await catalogService.getTree()
  return <CatalogPage catalogTree={catalogTree} />
}
