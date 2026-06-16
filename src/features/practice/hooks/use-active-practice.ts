'use client'

import { useEffect, useState } from 'react'
import { practiceService } from '@/services/practice.service'
import type { PracticeQuestion, QuestionOutcome, QuestionSubmissionFeedback } from '@/types/question'

const INITIAL_SUBMISSION: QuestionSubmissionFeedback = {
  isOpen: false,
  confidence: 3,
  errorType: 'calculation',
  questionType: 'numerical',
  tags: [],
}

export function useActivePractice(
  questions: PracticeQuestion[],
  sessionId?: string,
) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submission, setSubmission] = useState<QuestionSubmissionFeedback>(INITIAL_SUBMISSION)
  const [pendingOutcome, setPendingOutcome] = useState<QuestionOutcome | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)
  const [isRecordingAttempt, setIsRecordingAttempt] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  // Timer loop
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTime((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  // Record question start time when timer starts
  useEffect(() => {
    if (isRunning && !questionStartTime) {
      setQuestionStartTime(new Date())
    }
  }, [isRunning, questionStartTime])

  const saveAttempt = async (outcome: QuestionOutcome) => {
    if (!sessionId || !currentQuestion) {
      console.warn('Missing data to record attempt')
      return
    }

    setIsRecordingAttempt(true)
    try {
      await practiceService.recordAttempt({
        sessionId,
        questionId: currentQuestion.id,
        outcome,
        elapsedSeconds: time,
        confidence: submission.confidence,
        errorType: submission.errorType,
        questionType: submission.questionType,
        tags: submission.tags,
      })
    } catch (error) {
      console.error('Failed to record attempt:', error)
    } finally {
      setIsRecordingAttempt(false)
    }
  }

  const moveToNext = async () => {
    if (pendingOutcome && currentQuestion) {
      await saveAttempt(pendingOutcome)
      setPendingOutcome(null)
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((index) => index + 1)
      setTime(0)
      setIsRunning(false)
      setSubmitted(false)
      setQuestionStartTime(null)
      setSubmission(INITIAL_SUBMISSION)
    }
  }

  const handleSubmission = async (type: QuestionOutcome) => {
    setSubmitted(true)
    setPendingOutcome(type)

    if (type === 'skipped') {
      await saveAttempt(type)
      setPendingOutcome(null)
      setTimeout(() => {
        setSubmission(INITIAL_SUBMISSION)
        moveToNext()
      }, 300)
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
    isRecordingAttempt,
  }
}
