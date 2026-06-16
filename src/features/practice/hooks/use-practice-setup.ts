'use client'

import { useState } from 'react'
import { estimateQuestionCount } from '@/lib/scheduling/question-selection'
import { toggleFilterValue } from '@/features/practice/utils/filters'
import { practiceService } from '@/services/practice.service'
import type { PracticeSessionFilters } from '@/types/practice-session'

export type PracticeSetupOptions = {
  subjects: string[]
  sources: string[]
  difficulties: string[]
}

export function usePracticeSetup({ subjects, sources, difficulties }: PracticeSetupOptions) {
  const [sessionTime, setSessionTime] = useState(30)
  const [timePerQuestion, setTimePerQuestion] = useState(2.5)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([subjects[0] ?? 'Physics'])
  const [selectedSources, setSelectedSources] = useState<string[]>([sources[0] ?? 'JEE Main'])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['Medium', 'Hard'])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const estimatedQuestions = estimateQuestionCount(sessionTime, timePerQuestion)

  const startSession = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const filters: PracticeSessionFilters = {
        subjectIds: selectedSubjects.length > 0 ? selectedSubjects : undefined,
        sourceIds: selectedSources.length > 0 ? selectedSources : undefined,
        difficultyIds: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
      }

      const session = await practiceService.startSession({
        sessionDuration: sessionTime * 60, // convert to seconds
        targetTimePerQuestion: timePerQuestion,
        filters,
      })

      if (session.error) {
        setError(session.error)
        return null
      }

      return session
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start session'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sessionTime,
    setSessionTime,
    timePerQuestion,
    setTimePerQuestion,
    selectedSubjects,
    setSelectedSubjects,
    selectedSources,
    setSelectedSources,
    selectedDifficulties,
    setSelectedDifficulties,
    estimatedQuestions,
    subjects,
    sources,
    difficulties,
    toggleFilter: toggleFilterValue,
    isLoading,
    error,
    startSession,
  }
}
