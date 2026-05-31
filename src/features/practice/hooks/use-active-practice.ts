'use client'

import { useEffect, useState } from 'react'
import type { PracticeQuestion, QuestionOutcome, QuestionSubmissionFeedback } from '@/types/question'

const INITIAL_SUBMISSION: QuestionSubmissionFeedback = {
  isOpen: false,
  confidence: 3,
  errorType: 'calculation',
  questionType: 'numerical',
}

export function useActivePractice(questions: PracticeQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submission, setSubmission] = useState<QuestionSubmissionFeedback>(INITIAL_SUBMISSION)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const moveToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setTime(0)
      setIsRunning(false)
      setSubmitted(false)
      setSubmission((prev) => ({ ...prev, isOpen: false }))
    }
  }

  const handleSubmission = (type: QuestionOutcome) => {
    setSubmitted(true)
    if (type === 'skipped') {
      moveToNext()
    } else {
      setSubmission((prev) => ({ ...prev, isOpen: true }))
    }
  }

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    time,
    isRunning,
    setIsRunning,
    submitted,
    submission,
    setSubmission,
    handleSubmission,
    moveToNext,
  }
}
