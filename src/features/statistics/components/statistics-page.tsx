'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Input } from '@/components/ui/input'
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_STYLE,
} from '@/constants/chart-theme'
import type {
  AccuracyTrendPoint,
  DailyStudyPoint,
  ErrorBreakdown,
  QuestionsAttemptedPoint,
  SolveTimeByDifficulty,
  WeakChapterStat,
} from '@/types/analytics'

const ERROR_CHART_COLORS = ['#7a6ee8', '#65b741', '#f59e0b', '#ef5350']

export type StatisticsPageProps = {
  metrics: {
    totalStudyTime: string
    studyTimeDelta: string
    questionsAttempted: number
    flashcardsReviewed: number
    overallAccuracy: string
    accuracyDelta: string
    avgSolveTime: string
    solveTimeDelta: string
  }
  dailyStudyData: DailyStudyPoint[]
  questionsData: QuestionsAttemptedPoint[]
  accuracyTrendData: AccuracyTrendPoint[]
  solveTimeData: SolveTimeByDifficulty[]
  weakestChapters: WeakChapterStat[]
  errorAnalysis: ErrorBreakdown[]
}

export function StatisticsPage({
  metrics,
  dailyStudyData,
  questionsData,
  accuracyTrendData,
  solveTimeData,
  weakestChapters,
  errorAnalysis,
}: StatisticsPageProps) {

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Statistics & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive analysis of your study performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input type="date" className="bg-card border-border text-foreground text-sm w-32" />
            <span className="text-muted-foreground">to</span>
            <Input type="date" className="bg-card border-border text-foreground text-sm w-32" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Study Time</div>
            <div className="text-2xl font-bold text-foreground">{metrics.totalStudyTime}</div>
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metrics.studyTimeDelta}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Questions Attempted</div>
            <div className="text-2xl font-bold text-foreground">{metrics.questionsAttempted}</div>
            <div className="text-xs text-muted-foreground mt-1">Total in period</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Flashcards Reviewed</div>
            <div className="text-2xl font-bold text-foreground">{metrics.flashcardsReviewed}</div>
            <div className="text-xs text-muted-foreground mt-1">Total in period</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Overall Accuracy</div>
            <div className="text-2xl font-bold text-foreground">{metrics.overallAccuracy}</div>
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metrics.accuracyDelta}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Avg Solve Time</div>
            <div className="text-2xl font-bold text-foreground">{metrics.avgSolveTime}</div>
            <div className="text-xs text-destructive mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {metrics.solveTimeDelta}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Daily Study Time (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyStudyData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7a6ee8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7a6ee8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="date" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="minutes" stroke="#7a6ee8" fillOpacity={1} fill="url(#colorMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Questions Attempted (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={questionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="date" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="attempted" fill="#65b741" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Accuracy Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={accuracyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="date" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} domain={[60, 90]} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="accuracy" stroke="#65b741" strokeWidth={3} dot={{ fill: '#65b741', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Avg Solve Time by Difficulty</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={solveTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="difficulty" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="avgTime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Weakest Chapters</h2>
            <div className="space-y-3">
              {weakestChapters.map((chapter, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded">
                  <div>
                    <div className="text-sm font-medium text-foreground">{chapter.chapter}</div>
                    <div className="text-xs text-muted-foreground">{chapter.attempted} attempts</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${chapter.accuracy >= 70 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {chapter.accuracy}%
                      </div>
                    </div>
                    <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${chapter.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${chapter.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Error Analysis</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={errorAnalysis}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {errorAnalysis.map((_, idx) => (
                        <Cell key={idx} fill={ERROR_CHART_COLORS[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                {errorAnalysis.map((error, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR_CHART_COLORS[idx] }} />
                      <span className="text-muted-foreground">{error.errorType}</span>
                    </div>
                    <span className="text-foreground font-semibold">{error.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
