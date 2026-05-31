import type { PrismaClient } from '@prisma/client'

export async function seedAnalytics(prisma: PrismaClient) {
  const snapshots = [
    {
      key: 'dashboard.metrics',
      data: {
        questionsDueToday: 47,
        questionsDueDelta: '+12 from yesterday',
        flashcardsDueToday: 23,
        flashcardsDueChapters: '2 chapters',
        studyTimeThisWeek: '7h 20m',
        studyTimeDelta: '+45 min vs last week',
        accuracyRate: '85%',
        accuracyLabel: 'All time average',
      },
    },
    {
      key: 'dashboard.weeklyActivity',
      data: [
        { day: 'Mon', questions: 12, flashcards: 8, minutes: 45 },
        { day: 'Tue', questions: 19, flashcards: 12, minutes: 62 },
        { day: 'Wed', questions: 15, flashcards: 10, minutes: 50 },
        { day: 'Thu', questions: 25, flashcards: 14, minutes: 75 },
        { day: 'Fri', questions: 22, flashcards: 16, minutes: 68 },
        { day: 'Sat', questions: 28, flashcards: 18, minutes: 85 },
        { day: 'Sun', questions: 18, flashcards: 11, minutes: 55 },
      ],
    },
    {
      key: 'dashboard.subjectDistribution',
      data: [
        { name: 'Physics', value: 35, color: '#7a6ee8' },
        { name: 'Chemistry', value: 32, color: '#65b741' },
        { name: 'Mathematics', value: 33, color: '#f59e0b' },
      ],
    },
    {
      key: 'dashboard.performanceTrend',
      data: [
        { date: 'Week 1', accuracy: 72 },
        { date: 'Week 2', accuracy: 75 },
        { date: 'Week 3', accuracy: 78 },
        { date: 'Week 4', accuracy: 82 },
        { date: 'Week 5', accuracy: 85 },
      ],
    },
    {
      key: 'statistics.metrics',
      data: {
        totalStudyTime: '51h 20m',
        studyTimeDelta: '+8h this week',
        questionsAttempted: 847,
        flashcardsReviewed: 324,
        overallAccuracy: '85%',
        accuracyDelta: '+3% this month',
        avgSolveTime: '3.2m',
        solveTimeDelta: '-0.3m vs last week',
      },
    },
    {
      key: 'statistics.dailyStudy',
      data: [
        { date: '1 Nov', minutes: 45 },
        { date: '2 Nov', minutes: 62 },
        { date: '3 Nov', minutes: 38 },
        { date: '4 Nov', minutes: 75 },
        { date: '5 Nov', minutes: 68 },
        { date: '6 Nov', minutes: 85 },
        { date: '7 Nov', minutes: 55 },
      ],
    },
    {
      key: 'statistics.questionsAttempted',
      data: [
        { date: '1 Nov', attempted: 12 },
        { date: '2 Nov', attempted: 19 },
        { date: '3 Nov', attempted: 15 },
        { date: '4 Nov', attempted: 25 },
        { date: '5 Nov', attempted: 22 },
        { date: '6 Nov', attempted: 28 },
        { date: '7 Nov', attempted: 18 },
      ],
    },
    {
      key: 'statistics.accuracyTrend',
      data: [
        { date: 'Week 1', accuracy: 72 },
        { date: 'Week 2', accuracy: 75 },
        { date: 'Week 3', accuracy: 78 },
        { date: 'Week 4', accuracy: 82 },
        { date: 'Week 5', accuracy: 85 },
      ],
    },
    {
      key: 'statistics.solveTime',
      data: [
        { difficulty: 'Easy', avgTime: 1.2 },
        { difficulty: 'Medium', avgTime: 2.5 },
        { difficulty: 'Hard', avgTime: 4.8 },
        { difficulty: 'Very Hard', avgTime: 6.2 },
      ],
    },
    {
      key: 'statistics.weakestChapters',
      data: [
        { chapter: 'Electromagnetism', accuracy: 62, attempted: 24 },
        { chapter: 'Organic Chemistry', accuracy: 68, attempted: 31 },
        { chapter: 'Differential Equations', accuracy: 71, attempted: 28 },
        { chapter: 'Thermodynamics', accuracy: 74, attempted: 22 },
      ],
    },
    {
      key: 'statistics.errorAnalysis',
      data: [
        { errorType: 'Calculation', count: 24, percentage: 35 },
        { errorType: 'Conceptual', count: 16, percentage: 24 },
        { errorType: 'Careless', count: 18, percentage: 26 },
        { errorType: 'Methodology', count: 10, percentage: 15 },
      ],
    },
  ]

  for (const snapshot of snapshots) {
    const data = JSON.stringify(snapshot.data)
    await prisma.metricSnapshot.upsert({
      where: { key: snapshot.key },
      update: { data },
      create: { key: snapshot.key, data },
    })
  }
}
