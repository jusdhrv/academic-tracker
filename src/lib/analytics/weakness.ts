import type { WeakChapterStat } from '@/types/analytics'

/**
 * Identifies chapters below an accuracy threshold for targeted review.
 */
export function findWeakestChapters(
  chapters: WeakChapterStat[],
  threshold = 75,
): WeakChapterStat[] {
  return [...chapters]
    .filter((chapter) => chapter.accuracy < threshold)
    .sort((a, b) => a.accuracy - b.accuracy)
}
