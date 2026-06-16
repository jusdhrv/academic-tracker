import { prisma } from '@/db/prisma/client'
import {
  mapQuestionToPractice,
  type QuestionWithRelations,
} from '@/db/repositories/mappers/question.mapper'
import {
  calculatePriorityScore,
  weightedRandomSelection,
} from '@/lib/scheduling/question-selection'
import type { PracticeQuestion, QuestionForPractice } from '@/types/question'
import type { PracticeSessionFilters } from '@/types/practice-session'

const questionInclude = {
  source: true,
  difficulty: true,
  chapters: { include: { chapter: true } },
  concepts: { include: { concept: true } },
} as const

export class QuestionRepository {
  /**
   * Get practice questions - currently returns all questions (for backward compatibility).
   */
  async getPracticeSession(): Promise<PracticeQuestion[]> {
    const questions = await prisma.question.findMany({
      where: { questionNumber: { not: null } },
      orderBy: { questionNumber: 'asc' },
      take: 2,
      include: questionInclude,
    })

    return questions.map((q) => mapQuestionToPractice(q as QuestionWithRelations))
  }

  /**
   * Get questions filtered by subject, source, chapter, and difficulty.
   * Optionally filter to only include questions from learned chapters.
   */
  async getFilteredQuestions(filters: PracticeSessionFilters, _learnedChaptersOnly = false) {
    const questions = await prisma.question.findMany({
      where: {
        chapters: filters.chapterIds
          ? {
            some: {
              chapterId: {
                in: filters.chapterIds,
              },
            },
          }
          : filters.sourceId
            ? {
              some: {
                chapter: {
                  sourceId: filters.sourceId,
                },
              },
            }
            : undefined,
        source: filters.sourceIds
          ? {
            id: {
              in: filters.sourceIds,
            },
          }
          : undefined,
        difficulty: filters.difficultyIds
          ? {
            id: {
              in: filters.difficultyIds,
            },
          }
          : undefined,
      },
      include: questionInclude,
    })

    return questions.map((q) => this.mapToPracticeQuestion(q as QuestionWithRelations))
  }

  /**
   * Select questions intelligently using weighted random sampling based on priority scores.
   * Questions are selected from the pool of questions matching the filters.
   */
  async selectQuestionsForSession(
    count: number,
    filters: PracticeSessionFilters,
  ): Promise<QuestionForPractice[]> {
    const candidateQuestions = await this.getFilteredQuestions(filters)

    if (candidateQuestions.length === 0) {
      // Fallback: return most recent questions if no filtered questions exist
      return this.getFallbackQuestions(count)
    }

    // Calculate priority scores for each question
    const questionsWithScores = candidateQuestions.map((q) => ({
      ...q,
      priorityScore: calculatePriorityScore({
        masteryScore: q.masteryScore,
        lastSeen: q.lastSeen,
        difficultyName: q.difficulty,
        failures: q.failures,
        totalAttempts: q.totalAttempts,
        consecutiveFastSuccesses: q.consecutiveFastSuccesses,
      }),
    }))

    // Use weighted random sampling to select questions
    const selectedQuestions = weightedRandomSelection(questionsWithScores, count)

    return selectedQuestions.map((q) => ({
      id: q.id,
      questionNumber: q.questionNumber,
      source: q.source,
      chapter: q.chapter,
      concepts: q.concepts,
      difficulty: q.difficulty,
      content: q.content,
      masteryScore: q.masteryScore,
      lastSeen: q.lastSeen,
      totalAttempts: q.totalAttempts,
    }))
  }

  /**
   * Fallback method to get questions when filtered results are empty.
   * Returns questions ordered by question number (seeded data).
   */
  private async getFallbackQuestions(count: number): Promise<QuestionForPractice[]> {
    const questions = await prisma.question.findMany({
      where: { questionNumber: { not: null } },
      orderBy: { questionNumber: 'asc' },
      take: count,
      include: questionInclude,
    })

    return questions.map((q) => this.mapToPracticeQuestion(q as QuestionWithRelations))
  }

  /**
   * Map a question with relations to QuestionForPractice type.
   */
  private mapToPracticeQuestion(question: QuestionWithRelations): QuestionForPractice {
    const primaryChapter = question.chapters[0]?.chapter
    return {
      id: question.id,
      questionNumber: question.questionNumber ?? question.id,
      source: question.source.name,
      chapter: primaryChapter?.name ?? 'General',
      concepts: question.concepts.map((link) => link.concept.name),
      difficulty: question.difficulty.name,
      content: question.content,
      masteryScore: question.masteryScore,
      lastSeen: question.lastSeen,
      totalAttempts: question.totalAttempts,
    }
  }

  /**
   * Count due questions (for compatibility).
   */
  async countDue(): Promise<number> {
    return prisma.question.count({ where: { isDue: true } })
  }
}

export const questionRepository = new QuestionRepository()

