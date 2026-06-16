import type {
    AccuracyTrendPoint,
    DailyStudyPoint,
    ErrorBreakdown,
    QuestionsAttemptedPoint,
    SolveTimeByDifficulty,
    WeakChapterStat,
} from '@/types/analytics'

const dayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function normalizeDateRange(startDate?: string, endDate?: string) {
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000)
    end.setHours(23, 59, 59, 999)
    return { start, end }
}

function getIsoDate(value: Date) {
    return value.toISOString().slice(0, 10)
}

function formatDay(value: Date) {
    return dayFormatter.format(value)
}

function iterateDays(startDate: Date, endDate: Date) {
    const days: Date[] = []
    const cursor = new Date(startDate)
    cursor.setHours(0, 0, 0, 0)

    while (cursor <= endDate) {
        days.push(new Date(cursor))
        cursor.setDate(cursor.getDate() + 1)
    }

    return days
}

function groupByAttemptDate(attempts: Array<{ startedAt: Date }>) {
    return attempts.reduce<Record<string, number>>((acc, attempt) => {
        const key = getIsoDate(new Date(attempt.startedAt))
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})
}

export function groupAttemptsByDay(
    attempts: Array<{ startedAt: Date; elapsedSeconds: number }>,
    startDate?: string,
    endDate?: string,
): DailyStudyPoint[] {
    const { start, end } = normalizeDateRange(startDate, endDate)
    const totals = attempts.reduce<Record<string, number>>((acc, attempt) => {
        const key = getIsoDate(new Date(attempt.startedAt))
        acc[key] = (acc[key] || 0) + Math.round(attempt.elapsedSeconds / 60)
        return acc
    }, {})

    return iterateDays(start, end).map((date) => ({
        date: formatDay(date),
        minutes: totals[getIsoDate(date)] ?? 0,
    }))
}

export function groupQuestionsByDay(
    attempts: Array<{ startedAt: Date }>,
    startDate?: string,
    endDate?: string,
): QuestionsAttemptedPoint[] {
    const { start, end } = normalizeDateRange(startDate, endDate)
    const counts = groupByAttemptDate(attempts)

    return iterateDays(start, end).map((date) => ({
        date: formatDay(date),
        attempted: counts[getIsoDate(date)] ?? 0,
    }))
}

export function groupAttemptsByWeek(
    attempts: Array<{ startedAt: Date; outcome: string }>,
    startDate?: string,
    endDate?: string,
): AccuracyTrendPoint[] {
    const { start, end } = normalizeDateRange(startDate, endDate)
    const weeks: Date[] = []
    const cursor = new Date(start)
    cursor.setHours(0, 0, 0, 0)

    while (cursor <= end) {
        weeks.push(new Date(cursor))
        cursor.setDate(cursor.getDate() + 7)
    }

    const buckets = weeks.map((weekStart, index) => ({
        label: `Week ${index + 1}`,
        start: new Date(weekStart),
        end: new Date(Math.min(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1, end.getTime())),
        solved: 0,
        attempted: 0,
    }))

    const solvedOutcomes = new Set(['solved-fast', 'solved-slow'])

    attempts.forEach((attempt) => {
        const ts = new Date(attempt.startedAt).getTime()
        const bucket = buckets.find((bucketItem) => ts >= bucketItem.start.getTime() && ts <= bucketItem.end.getTime())
        if (!bucket) return
        if (attempt.outcome !== 'skipped') {
            bucket.attempted += 1
        }
        if (solvedOutcomes.has(attempt.outcome)) {
            bucket.solved += 1
        }
    })

    return buckets.map((bucket) => ({
        date: bucket.label,
        accuracy: bucket.attempted === 0 ? 0 : Math.round((bucket.solved / bucket.attempted) * 100),
    }))
}

export function groupAttemptsByDifficulty(
    attempts: Array<{ question: { difficulty: { name: string } }; elapsedSeconds: number; outcome: string }>,
): SolveTimeByDifficulty[] {
    const totals: Record<string, { totalSeconds: number; count: number }> = {}
    const solvedOutcomes = new Set(['solved-fast', 'solved-slow'])

    attempts.forEach((attempt) => {
        if (!solvedOutcomes.has(attempt.outcome)) return
        const difficulty = attempt.question.difficulty.name
        totals[difficulty] = totals[difficulty] || { totalSeconds: 0, count: 0 }
        totals[difficulty].totalSeconds += attempt.elapsedSeconds
        totals[difficulty].count += 1
    })

    return Object.entries(totals).map(([difficulty, data]) => ({
        difficulty,
        avgTime: data.count === 0 ? 0 : Math.round((data.totalSeconds / data.count) / 60 * 10) / 10,
    }))
}

export function buildWeakChapterStats(
    attempts: Array<{ question: { chapters: Array<{ chapter: { id: string; name: string } }> }; outcome: string }>,
): WeakChapterStat[] {
    const chapterMap: Record<string, { name: string; attempted: number; solved: number }> = {}
    const solvedOutcomes = new Set(['solved-fast', 'solved-slow'])

    attempts.forEach((attempt) => {
        const solved = solvedOutcomes.has(attempt.outcome)
        attempt.question.chapters.forEach((link) => {
            const chapterId = link.chapter.id
            if (!chapterMap[chapterId]) {
                chapterMap[chapterId] = { name: link.chapter.name, attempted: 0, solved: 0 }
            }
            chapterMap[chapterId].attempted += 1
            if (solved) chapterMap[chapterId].solved += 1
        })
    })

    return Object.values(chapterMap)
        .map((entry) => ({
            chapter: entry.name,
            attempted: entry.attempted,
            accuracy: entry.attempted === 0 ? 0 : Math.round((entry.solved / entry.attempted) * 100),
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 4)
}

export function buildErrorBreakdown(
    attempts: Array<{ errorType: string }>,
): ErrorBreakdown[] {
    const counts: Record<string, number> = {}
    attempts.forEach((attempt) => {
        counts[attempt.errorType] = (counts[attempt.errorType] || 0) + 1
    })

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)

    return Object.entries(counts)
        .map(([errorType, count]) => ({
            errorType,
            count,
            percentage: total === 0 ? 0 : Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count)
}
