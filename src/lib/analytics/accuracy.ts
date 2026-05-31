/**
 * Accuracy and performance analytics helpers.
 * Used by dashboard and statistics features.
 */

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function formatAccuracyDelta(current: number, previous: number): number {
  return current - previous
}
