'use client'

import { useState } from 'react'
import { DIFFICULTIES, QUESTION_SOURCES, SUBJECTS } from '@/constants/practice'
import { estimateQuestionCount } from '@/lib/scheduling/question-selection'
import { toggleFilterValue } from '@/features/practice/utils/filters'

export function usePracticeSetup() {
  const [sessionTime, setSessionTime] = useState(30)
  const [timePerQuestion, setTimePerQuestion] = useState(2.5)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics'])
  const [selectedSources, setSelectedSources] = useState<string[]>(['JEE Main'])
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
    subjects: SUBJECTS,
    sources: QUESTION_SOURCES,
    difficulties: DIFFICULTIES,
    toggleFilter: toggleFilterValue,
  }
}
