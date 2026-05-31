import type { Flashcard } from '@/types/flashcard'

export const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    subject: 'Physics',
    chapter: 'Kinematics',
    concept: 'Equations of Motion',
    front: 'What are the three equations of motion?',
    back: 'The three equations of motion are: v = u + at, s = ut + ½at², and v² = u² + 2as',
  },
  {
    id: 2,
    subject: 'Chemistry',
    chapter: 'Stoichiometry',
    concept: 'Mole Concept',
    front: "Define Avogadro's Number",
    back: "Avogadro's number is 6.022 × 10²³, representing the number of particles in one mole of a substance.",
  },
  {
    id: 3,
    subject: 'Mathematics',
    chapter: 'Calculus',
    concept: 'Derivatives',
    front: 'What is the derivative of sin(x)?',
    back: 'The derivative of sin(x) is cos(x)',
  },
]

export const MOCK_DUE_CARD_COUNT = 47
