export const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'] as const
export const QUESTION_SOURCES = ['JEE Main', 'JEE Advanced', 'Board', 'NEET'] as const
export const CHAPTERS = [
  'Kinematics',
  'Thermodynamics',
  'Electromagnetism',
  'Organic Chemistry',
  'Stoichiometry',
  'Inorganic Chemistry',
  'Calculus',
  'Algebra',
  'Geometry',
] as const
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Very Hard'] as const

export type Subject = (typeof SUBJECTS)[number]
export type QuestionSource = (typeof QUESTION_SOURCES)[number]
export type Difficulty = (typeof DIFFICULTIES)[number]
