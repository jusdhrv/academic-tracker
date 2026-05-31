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
