import { difficultyRepository } from '@/db/repositories/difficulty.repository'
import { questionRepository } from '@/db/repositories/question.repository'
import { sourceRepository } from '@/db/repositories/source.repository'
import { subjectRepository } from '@/db/repositories/subject.repository'

export const practiceService = {
  getFilterOptions: async () => {
    const [subjects, sources, difficulties] = await Promise.all([
      subjectRepository.getAllNames(),
      sourceRepository.getFilterNames(),
      difficultyRepository.getAllNames(),
    ])
    return { subjects, sources, difficulties }
  },
  getPracticeSession: () => questionRepository.getPracticeSession(),
}
