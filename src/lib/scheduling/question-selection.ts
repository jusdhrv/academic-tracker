/**
 * Estimates how many questions fit in a practice session.
 */
export function estimateQuestionCount(
  sessionMinutes: number,
  minutesPerQuestion: number,
): number {
  if (minutesPerQuestion <= 0) return 0
  return Math.floor(sessionMinutes / minutesPerQuestion)
}

/**
 * Calculates the difficulty weight factor for priority scoring.
 */
export function getDifficultyWeight(difficultyName: string): number {
  const weights: Record<string, number> = {
    'Easy': 0.5,
    'Medium': 1.0,
    'Hard': 1.5,
    'Very Hard': 2.0,
  }
  return weights[difficultyName] ?? 1.0
}

/**
 * Calculates days since the question was last seen.
 * Returns 0 if never seen (prioritizes new/unseen questions).
 */
export function getDaysSinceLastSeen(lastSeenDate: Date | null): number {
  if (!lastSeenDate) return 0
  const now = new Date()
  const daysDiff = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0, daysDiff)
}

/**
 * Computes the priority score for a question based on spaced repetition and mastery.
 *
 * Priority formula:
 * priorityScore = masteryFactor × forgettingFactor × difficultyFactor × failureFactor × consecutiveFastSuccessesFactor
 *
 * - masteryFactor: higher when mastery is low (1 - masteryScore)
 * - forgettingFactor: higher when not seen recently (1 / (1 + daysSinceLastSeen))
 * - difficultyFactor: higher for harder questions
 * - failureFactor: higher after repeated failures
 * - consecutiveFastSuccessesFactor: reduced if many fast successes
 */
export function calculatePriorityScore(question: {
  masteryScore: number
  lastSeen: Date | null
  difficultyName: string
  failures: number
  totalAttempts: number
  consecutiveFastSuccesses: number
}): number {
  // masteryFactor: ranges from 0 to 1, higher when low mastery
  const masteryFactor = 1 - question.masteryScore

  // forgettingFactor: ranges from 0.5 to 1+, higher for older questions
  // unseen questions (lastSeen = null) get a moderate boost
  const daysSince = getDaysSinceLastSeen(question.lastSeen)
  const forgettingFactor = 1 / (1 + daysSince)

  // difficultyFactor: weights harder questions higher
  const difficultyFactor = getDifficultyWeight(question.difficultyName)

  // failureFactor: increases with more failures relative to attempts
  const attemptRate = Math.max(1, question.totalAttempts)
  const failureFactor = 1 + question.failures / attemptRate

  // consecutiveFastSuccessesFactor: reduces priority if many recent fast successes
  // each consecutive fast success reduces priority by 20%
  const consecutiveFastSuccessesFactor = Math.max(
    0,
    1 - question.consecutiveFastSuccesses * 0.2,
  )

  const priorityScore =
    masteryFactor *
    forgettingFactor *
    difficultyFactor *
    failureFactor *
    consecutiveFastSuccessesFactor

  return Math.max(0, priorityScore)
}

/**
 * Performs weighted random sampling to select questions based on priority scores.
 * Uses the Efraimidis-Spirakis algorithm (exponential variate method).
 *
 * @param questions - Array of questions with priority scores
 * @param count - Number of questions to select
 * @returns Array of selected questions
 */
export function weightedRandomSelection<T extends { id: number; priorityScore: number }>(
  questions: T[],
  count: number,
): T[] {
  if (questions.length === 0) return []
  if (count >= questions.length) return questions

  // Use Efraimidis-Spirakis algorithm: assign each item a key = random^(1/weight)
  // Then sort by key descending and take top count items
  const keyed = questions.map((q) => ({
    item: q,
    key:
      q.priorityScore > 0
        ? Math.random() ** (1 / q.priorityScore)
        : -Math.random(), // negative priority gets very low key
  }))

  keyed.sort((a, b) => b.key - a.key)

  return keyed.slice(0, count).map((k) => k.item)
}

