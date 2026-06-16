import { NextResponse } from 'next/server'
import { practiceRepository } from '@/db/repositories/practice.repository'
import { questionRepository } from '@/db/repositories/question.repository'
import { estimateQuestionCount } from '@/lib/scheduling/question-selection'
import type { CreatePracticeSessionRequest } from '@/types/practice-session'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePracticeSessionRequest

    // Validate request
    if (!body.sessionDuration || !body.targetTimePerQuestion || !body.filters) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Calculate number of questions to select
    const sessionDurationMinutes = body.sessionDuration / 60
    const estimatedCount = estimateQuestionCount(sessionDurationMinutes, body.targetTimePerQuestion)

    // Select questions using intelligent algorithm
    const selectedQuestions = await questionRepository.selectQuestionsForSession(
      estimatedCount,
      body.filters,
    )

    if (selectedQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available matching your filters' },
        { status: 400 },
      )
    }

    // Create practice session
    const session = await practiceRepository.createSession({
      sessionDuration: body.sessionDuration,
      targetTimePerQuestion: body.targetTimePerQuestion,
      selectedQuestionIds: selectedQuestions.map((q) => q.id),
      filterCriteria: body.filters,
    })

    return NextResponse.json({
      id: session.id,
      sessionDuration: session.sessionDuration,
      targetTimePerQuestion: session.targetTimePerQuestion,
      selectedQuestions: selectedQuestions.map((q) => q.id),
      filterCriteria: body.filters,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      questions: selectedQuestions,
    })
  } catch (error) {
    console.error('Error creating practice session:', error)
    return NextResponse.json(
      { error: 'Failed to create practice session' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 },
      )
    }

    const session = await practiceRepository.getSession(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching practice session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 },
    )
  }
}
