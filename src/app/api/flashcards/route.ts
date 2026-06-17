import { NextResponse } from 'next/server'
import { flashcardsService } from '@/services/flashcards.service'
import type { FlashcardCreateDto, FlashcardUpdateDto } from '@/types/flashcard'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const idParam = searchParams.get('id')

        if (idParam) {
            const id = Number(idParam)
            if (Number.isNaN(id)) {
                return NextResponse.json({ error: 'Invalid flashcard id' }, { status: 400 })
            }

            const flashcard = await flashcardsService.getFlashcardById(id)
            if (!flashcard) {
                return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
            }

            return NextResponse.json(flashcard)
        }

        const flashcards = await flashcardsService.getAllFlashcards()
        return NextResponse.json(flashcards)
    } catch (error) {
        console.error('Error fetching flashcards:', error)
        return NextResponse.json({ error: 'Unable to fetch flashcards' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as FlashcardCreateDto
        if (!body.front || !body.back || !body.subjectId) {
            return NextResponse.json({ error: 'Missing required flashcard fields' }, { status: 400 })
        }

        const flashcard = await flashcardsService.createFlashcard(body)
        return NextResponse.json(flashcard)
    } catch (error) {
        console.error('Error creating flashcard:', error)
        return NextResponse.json({ error: 'Unable to create flashcard' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = (await request.json()) as FlashcardUpdateDto
        if (!body.id) {
            return NextResponse.json({ error: 'Flashcard id is required' }, { status: 400 })
        }

        const flashcard = await flashcardsService.updateFlashcard(body)
        return NextResponse.json(flashcard)
    } catch (error) {
        console.error('Error updating flashcard:', error)
        return NextResponse.json({ error: 'Unable to update flashcard' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const idParam = searchParams.get('id')
        if (!idParam) {
            return NextResponse.json({ error: 'Flashcard id is required' }, { status: 400 })
        }

        const id = Number(idParam)
        if (Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid flashcard id' }, { status: 400 })
        }

        await flashcardsService.deleteFlashcard(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting flashcard:', error)
        return NextResponse.json({ error: 'Unable to delete flashcard' }, { status: 500 })
    }
}
