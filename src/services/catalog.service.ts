import { catalogRepository } from '@/db/repositories/catalog.repository'

export const catalogService = {
  getTree: () => catalogRepository.getTree(),
}
