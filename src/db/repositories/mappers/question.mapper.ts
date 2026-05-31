import type { Chapter, Concept, Difficulty, Question, Source } from '@prisma/client'
import type { PracticeQuestion } from '@/types/question'

export type QuestionWithRelations = Question & {
  source: Source
  difficulty: Difficulty
  chapters: { chapter: Chapter }[]
  concepts: { concept: Concept }[]
}

export function mapQuestionToPractice(question: QuestionWithRelations): PracticeQuestion {
  const primaryChapter = question.chapters[0]?.chapter
  return {
    id: question.id,
    questionNumber: question.questionNumber ?? question.id,
    source: question.source.name,
    chapter: primaryChapter?.name ?? 'General',
    concepts: question.concepts.map((link) => link.concept.name),
    difficulty: question.difficulty.name,
    content: question.content,
  }
}
