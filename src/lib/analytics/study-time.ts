/**
 * Study time aggregation helpers.
 */

export function formatStudyDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function sumDailyMinutes(
  points: ReadonlyArray<{ minutes: number }>,
): number {
  return points.reduce((sum, point) => sum + point.minutes, 0)
}
