import { prisma } from '@/db/prisma/client'

export class MetricSnapshotRepository {
  async getJson<T>(key: string): Promise<T> {
    const row = await prisma.metricSnapshot.findUnique({ where: { key } })
    if (!row) {
      throw new Error(`Missing metric snapshot: ${key}`)
    }
    return JSON.parse(row.data) as T
  }
}

export const metricSnapshotRepository = new MetricSnapshotRepository()
