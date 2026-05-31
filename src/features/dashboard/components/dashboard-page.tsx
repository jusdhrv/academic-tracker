'use client'

import {
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
import { Play, TrendingUp } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
} from '@/constants/chart-theme'
import type { SubjectDistributionPoint, WeeklyActivityPoint } from '@/types/analytics'

export type DashboardPageProps = {
  metrics: {
    questionsDueToday: number
    questionsDueDelta: string
    flashcardsDueToday: number
    flashcardsDueChapters: string
    studyTimeThisWeek: string
    studyTimeDelta: string
    accuracyRate: string
    accuracyLabel: string
  }
  weeklyData: WeeklyActivityPoint[]
  subjectData: SubjectDistributionPoint[]
  performanceData: { date: string; accuracy: number }[]
}

export function DashboardPage({ metrics, weeklyData, subjectData, performanceData }: DashboardPageProps) {

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your study overview.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <Play className="w-4 h-4" />
            Start Study Session
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Questions Due Today</div>
            <div className="text-3xl font-bold text-foreground">{metrics.questionsDueToday}</div>
            <div className="text-xs text-primary mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metrics.questionsDueDelta}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Flashcards Due Today</div>
            <div className="text-3xl font-bold text-foreground">{metrics.flashcardsDueToday}</div>
            <div className="text-xs text-muted-foreground mt-2">{metrics.flashcardsDueChapters}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Study Time This Week</div>
            <div className="text-3xl font-bold text-foreground">{metrics.studyTimeThisWeek}</div>
            <div className="text-xs text-primary mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metrics.studyTimeDelta}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Accuracy Rate</div>
            <div className="text-3xl font-bold text-foreground">{metrics.accuracyRate}</div>
            <div className="text-xs text-foreground/50 mt-2">{metrics.accuracyLabel}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Study Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="day" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} />
                <Bar dataKey="questions" fill="#7a6ee8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flashcards" fill="#65b741" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Subject Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {subjectData.map((subject) => (
                <div key={subject.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="text-muted-foreground">{subject.name}</span>
                  </div>
                  <span className="text-foreground font-semibold">{subject.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
              <XAxis dataKey="date" stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
              <YAxis stroke={CHART_AXIS_STROKE} style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={CHART_TOOLTIP_LABEL_STYLE} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#7a6ee8"
                strokeWidth={3}
                dot={{ fill: '#7a6ee8', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  )
}
