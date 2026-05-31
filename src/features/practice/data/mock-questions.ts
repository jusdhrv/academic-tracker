import type { PracticeQuestion } from '@/types/question'

export const MOCK_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    source: 'JEE Main 2023',
    chapter: 'Kinematics',
    concepts: ['Velocity', 'Acceleration', 'Equations of Motion'],
    difficulty: 'Hard',
    content:
      'A particle starts from rest and moves along a straight line. If its acceleration is given by a = 2t m/s² where t is in seconds, then the distance covered in the first 4 seconds is?',
  },
  {
    id: 2,
    questionNumber: 2,
    source: 'JEE Main 2023',
    chapter: 'Work, Energy & Power',
    concepts: ['Kinetic Energy', 'Potential Energy', 'Conservation'],
    difficulty: 'Hard',
    content:
      'A ball is thrown upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)',
  },
]
