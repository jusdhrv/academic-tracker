/**
 * Mastery level calculations for chapters and concepts.
 * Prepared for dependency-graph aware scheduling.
 */

export function calculateMasteryScore(
  correctAttempts: number,
  totalAttempts: number,
): number {
  if (totalAttempts === 0) return 0
  return Math.round((correctAttempts / totalAttempts) * 100)
}
