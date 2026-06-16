import { prisma } from '@/db/prisma/client'
import type { PracticeSessionFilters } from '@/types/practice-session'
import type { QuestionOutcome } from '@/types/question'

export class PracticeRepository {
    /**
     * Create a new practice session and store the selected questions.
     */
    async createSession(data: {
        sessionDuration: number
        targetTimePerQuestion: number
        selectedQuestionIds: number[]
        filterCriteria: PracticeSessionFilters
    }) {
        return prisma.practiceSession.create({
            data: {
                sessionDuration: data.sessionDuration,
                targetTimePerQuestion: data.targetTimePerQuestion,
                selectedQuestions: JSON.stringify(data.selectedQuestionIds),
                filterCriteria: JSON.stringify(data.filterCriteria),
                startedAt: new Date(),
            },
        })
    }

    /**
     * Get a practice session by ID.
     */
    async getSession(sessionId: string) {
        const session = await prisma.practiceSession.findUnique({
            where: { id: sessionId },
            include: {
                practiceAttempts: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        })

        if (!session) return null

        return {
            ...session,
            selectedQuestions: JSON.parse(session.selectedQuestions) as number[],
            filterCriteria: JSON.parse(session.filterCriteria) as PracticeSessionFilters,
        }
    }

    /**
     * End a practice session.
     */
    async endSession(sessionId: string) {
        return prisma.practiceSession.update({
            where: { id: sessionId },
            data: { endedAt: new Date() },
        })
    }

    /**
     * Record a question attempt during a practice session.
     */
    async recordAttempt(data: {
        sessionId: string
        questionId: number
        outcome: QuestionOutcome
        startedAt: Date
        endedAt: Date
        elapsedSeconds: number
    }) {
        return prisma.practiceQuestionAttempt.create({
            data: {
                sessionId: data.sessionId,
                questionId: data.questionId,
                outcome: data.outcome,
                startedAt: data.startedAt,
                endedAt: data.endedAt,
                elapsedSeconds: data.elapsedSeconds,
            },
        })
    }

    /**
     * Get all attempts for a session.
     */
    async getSessionAttempts(sessionId: string) {
        return prisma.practiceQuestionAttempt.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            include: {
                question: {
                    include: {
                        source: true,
                        difficulty: true,
                    },
                },
            },
        })
    }

    /**
     * Update question mastery stats after an attempt.
     * This should be called after recording an attempt to update the question's stats.
     */
    async updateQuestionStats(questionId: number, outcome: QuestionOutcome, elapsedSeconds: number) {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        })

        if (!question) return null

        const targetTimeSeconds = 120 // 2 minutes as a reasonable threshold
        const isFast = elapsedSeconds <= targetTimeSeconds

        let updates: Record<string, any> = {
            lastSeen: new Date(),
            totalAttempts: question.totalAttempts + 1,
        }

        // Update outcome-specific stats
        if (outcome === 'solved-fast') {
            updates.fastSuccesses = question.fastSuccesses + 1
            updates.consecutiveFastSuccesses = question.consecutiveFastSuccesses + 1
            // Increase mastery for successful fast solves
            updates.masteryScore = Math.min(1, question.masteryScore + 0.15)
        } else if (outcome === 'solved-slow') {
            updates.slowSuccesses = question.slowSuccesses + 1
            updates.consecutiveFastSuccesses = 0
            // Increase mastery for successful slow solves (less gain than fast)
            updates.masteryScore = Math.min(1, question.masteryScore + 0.08)
        } else if (outcome === 'failed') {
            updates.failures = question.failures + 1
            updates.consecutiveFastSuccesses = 0
            // Decrease mastery for failures
            updates.masteryScore = Math.max(0, question.masteryScore - 0.1)
        } else if (outcome === 'skipped') {
            updates.skips = question.skips + 1
            updates.consecutiveFastSuccesses = 0
            // Slight mastery decrease for skips
            updates.masteryScore = Math.max(0, question.masteryScore - 0.05)
        }

        return prisma.question.update({
            where: { id: questionId },
            data: updates,
        })
    }
}

export const practiceRepository = new PracticeRepository()
