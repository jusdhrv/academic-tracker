import { CatalogPage } from '@/features/catalog/components/catalog-page'
import { catalogService } from '@/services/catalog.service'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [catalogTree, formOptions] = await Promise.all([
    catalogService.getTree(),
    catalogService.getFormOptions(),
  ])

  return <CatalogPage catalogTree={catalogTree} formOptions={formOptions} />
}
