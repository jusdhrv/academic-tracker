import { catalogRepository } from '@/db/repositories/catalog.repository'

export const catalogService = {
  getTree: () => catalogRepository.getTree(),
  getFormOptions: () => catalogRepository.getFormOptions(),
  getNodeDetail: (
    type: string,
    entityId: string,
    context?: Record<string, string | number | undefined>,
  ) => catalogRepository.getNodeDetail(type, entityId, context),
}
