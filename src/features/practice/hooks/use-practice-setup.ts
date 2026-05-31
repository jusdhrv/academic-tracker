'use client'

import { useState } from 'react'
import { estimateQuestionCount } from '@/lib/scheduling/question-selection'
import { toggleFilterValue } from '@/features/practice/utils/filters'

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

  const estimatedQuestions = estimateQuestionCount(sessionTime, timePerQuestion)

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
  }
}
