'use client'

import { useState } from 'react'
import type { Flashcard, FlashcardResponse } from '@/types/flashcard'
import {
  calculateSessionProgress,
  countResponsesByType,
} from '@/features/flashcards/utils/session-progress'

export function useFlashcardSession(flashcards: Flashcard[], dueCards: number) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [responses, setResponses] = useState<Record<number, FlashcardResponse>>({})
  const [dueCount, setDueCount] = useState(dueCards)

  const currentCard = flashcards[currentIndex]
  const totalCards = flashcards.length
  const progress = calculateSessionProgress(responses, totalCards)

  const handleResponse = async (response: FlashcardResponse) => {
    if (!currentCard) return

    try {
      const res = await fetch('/api/flashcards/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcardId: currentCard.id, response }),
      })

      if (res.ok) {
        const result = await res.json()
        if (typeof result.dueCount === 'number') {
          setDueCount(result.dueCount)
        } else {
          setDueCount((prev) => Math.max(prev - 1, 0))
        }
      } else {
        console.error('Failed to save flashcard review')
      }
    } catch (error) {
      console.error('Error submitting flashcard review:', error)
    }

    setResponses((prev) => ({ ...prev, [currentCard.id]: response }))

    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  return {
    currentCard,
    currentIndex,
    totalCards,
    dueCards: dueCount,
    isFlipped,
    setIsFlipped,
    progress,
    responses,
    handleResponse,
    countByResponse: (type: FlashcardResponse) => countResponsesByType(responses, type),
  }
}
