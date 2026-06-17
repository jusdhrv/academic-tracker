import { NextResponse } from 'next/server'
import { flashcardsService } from '@/services/flashcards.service'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { flashcardId, response } = body as { flashcardId?: number; response?: string }

        if (typeof flashcardId !== 'number' || !response) {
            return NextResponse.json({ error: 'flashcardId and response are required' }, { status: 400 })
        }

        const updatedFlashcard = await flashcardsService.reviewFlashcard(flashcardId, response as any)
        const dueCount = await flashcardsService.getSession().then((session) => session.dueCount)

        return NextResponse.json({ flashcard: updatedFlashcard, dueCount })
    } catch (error) {
        console.error('Error reviewing flashcard:', error)
        return NextResponse.json({ error: 'Unable to submit flashcard review' }, { status: 500 })
    }
}
