import type {
  SubjectDistributionPoint,
  WeeklyActivityPoint,
} from '@/types/analytics'

export const MOCK_DASHBOARD_METRICS = {
  questionsDueToday: 47,
  questionsDueDelta: '+12 from yesterday',
  flashcardsDueToday: 23,
  flashcardsDueChapters: '2 chapters',
  studyTimeThisWeek: '7h 20m',
  studyTimeDelta: '+45 min vs last week',
  accuracyRate: '85%',
  accuracyLabel: 'All time average',
} as const

export const MOCK_WEEKLY_ACTIVITY: WeeklyActivityPoint[] = [
  { day: 'Mon', questions: 12, flashcards: 8, minutes: 45 },
  { day: 'Tue', questions: 19, flashcards: 12, minutes: 62 },
  { day: 'Wed', questions: 15, flashcards: 10, minutes: 50 },
  { day: 'Thu', questions: 25, flashcards: 14, minutes: 75 },
  { day: 'Fri', questions: 22, flashcards: 16, minutes: 68 },
  { day: 'Sat', questions: 28, flashcards: 18, minutes: 85 },
  { day: 'Sun', questions: 18, flashcards: 11, minutes: 55 },
]

export const MOCK_SUBJECT_DISTRIBUTION: SubjectDistributionPoint[] = [
  { name: 'Physics', value: 35, color: '#7a6ee8' },
  { name: 'Chemistry', value: 32, color: '#65b741' },
  { name: 'Mathematics', value: 33, color: '#f59e0b' },
]

export const MOCK_PERFORMANCE_TREND = [
  { date: 'Week 1', accuracy: 72 },
  { date: 'Week 2', accuracy: 75 },
  { date: 'Week 3', accuracy: 78 },
  { date: 'Week 4', accuracy: 82 },
  { date: 'Week 5', accuracy: 85 },
]
