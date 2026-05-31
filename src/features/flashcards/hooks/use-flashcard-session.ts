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

  const currentCard = flashcards[currentIndex]
  const totalCards = flashcards.length
  const progress = calculateSessionProgress(responses, totalCards)

  const handleResponse = (response: FlashcardResponse) => {
    if (!currentCard) return
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
    dueCards,
    isFlipped,
    setIsFlipped,
    progress,
    responses,
    handleResponse,
    countByResponse: (type: FlashcardResponse) => countResponsesByType(responses, type),
  }
}
