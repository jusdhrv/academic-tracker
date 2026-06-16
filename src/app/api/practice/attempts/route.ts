import { NextResponse } from 'next/server'
import { practiceRepository } from '@/db/repositories/practice.repository'
import type { PracticeQuestionAttemptRequest } from '@/types/practice-session'

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as PracticeQuestionAttemptRequest

        // Validate request
        if (!body.sessionId || !body.questionId || !body.outcome || body.elapsedSeconds === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            )
        }

        // Record the attempt
        const attempt = await practiceRepository.recordAttempt({
            sessionId: body.sessionId,
            questionId: body.questionId,
            outcome: body.outcome,
            startedAt: new Date(),
            endedAt: new Date(),
            elapsedSeconds: body.elapsedSeconds,
        })

        // Update question mastery stats
        await practiceRepository.updateQuestionStats(
            body.questionId,
            body.outcome,
            body.elapsedSeconds,
        )

        return NextResponse.json({
            id: attempt.id,
            sessionId: attempt.sessionId,
            questionId: attempt.questionId,
            outcome: attempt.outcome,
            elapsedSeconds: attempt.elapsedSeconds,
            createdAt: attempt.createdAt,
        })
    } catch (error) {
        console.error('Error recording practice attempt:', error)
        return NextResponse.json(
            { error: 'Failed to record attempt' },
            { status: 500 },
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID required' },
                { status: 400 },
            )
        }

        const attempts = await practiceRepository.getSessionAttempts(sessionId)

        return NextResponse.json({
            attempts,
            count: attempts.length,
        })
    } catch (error) {
        console.error('Error fetching attempts:', error)
        return NextResponse.json(
            { error: 'Failed to fetch attempts' },
            { status: 500 },
        )
    }
}
