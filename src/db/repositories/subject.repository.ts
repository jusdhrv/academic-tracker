import { prisma } from '@/db/prisma/client'

export class SubjectRepository {
  async getAllNames(): Promise<string[]> {
    const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
    return subjects.map((s) => s.name)
  }
}

export const subjectRepository = new SubjectRepository()
