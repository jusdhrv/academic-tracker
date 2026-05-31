'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'

const dailyStudyData = [
  { date: '1 Nov', minutes: 45 },
  { date: '2 Nov', minutes: 62 },
  { date: '3 Nov', minutes: 38 },
  { date: '4 Nov', minutes: 75 },
  { date: '5 Nov', minutes: 68 },
  { date: '6 Nov', minutes: 85 },
  { date: '7 Nov', minutes: 55 },
]

const questionsData = [
  { date: '1 Nov', attempted: 12 },
  { date: '2 Nov', attempted: 19 },
  { date: '3 Nov', attempted: 15 },
  { date: '4 Nov', attempted: 25 },
  { date: '5 Nov', attempted: 22 },
  { date: '6 Nov', attempted: 28 },
  { date: '7 Nov', attempted: 18 },
]

const accuracyTrendData = [
  { date: 'Week 1', accuracy: 72 },
  { date: 'Week 2', accuracy: 75 },
  { date: 'Week 3', accuracy: 78 },
  { date: 'Week 4', accuracy: 82 },
  { date: 'Week 5', accuracy: 85 },
]

const solveTimeData = [
  { difficulty: 'Easy', avgTime: 1.2 },
  { difficulty: 'Medium', avgTime: 2.5 },
  { difficulty: 'Hard', avgTime: 4.8 },
  { difficulty: 'Very Hard', avgTime: 6.2 },
]

const weakestChapters = [
  { chapter: 'Electromagnetism', accuracy: 62, attempted: 24 },
  { chapter: 'Organic Chemistry', accuracy: 68, attempted: 31 },
  { chapter: 'Differential Equations', accuracy: 71, attempted: 28 },
  { chapter: 'Thermodynamics', accuracy: 74, attempted: 22 },
]

const errorAnalysis = [
  { errorType: 'Calculation', count: 24, percentage: 35 },
  { errorType: 'Conceptual', count: 16, percentage: 24 },
  { errorType: 'Careless', count: 18, percentage: 26 },
  { errorType: 'Methodology', count: 10, percentage: 15 },
]

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Statistics & Analytics</h1>
              <p className="text-muted-foreground mt-1">Comprehensive analysis of your study performance.</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                className="bg-card border-border text-foreground text-sm w-32"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                className="bg-card border-border text-foreground text-sm w-32"
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Total Study Time</div>
              <div className="text-2xl font-bold text-foreground">51h 20m</div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+8h this week</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Questions Attempted</div>
              <div className="text-2xl font-bold text-foreground">847</div>
              <div className="text-xs text-muted-foreground mt-1">Total in period</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Flashcards Reviewed</div>
              <div className="text-2xl font-bold text-foreground">324</div>
              <div className="text-xs text-muted-foreground mt-1">Total in period</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Overall Accuracy</div>
              <div className="text-2xl font-bold text-foreground">85%</div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+3% this month</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Avg Solve Time</div>
              <div className="text-2xl font-bold text-foreground">3.2m</div>
              <div className="text-xs text-destructive mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" />-0.3m vs last week</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Daily Study Time */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Daily Study Time (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyStudyData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7a6ee8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7a6ee8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="date" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }} />
                  <Area type="monotone" dataKey="minutes" stroke="#7a6ee8" fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Questions Attempted */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Questions Attempted (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={questionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="date" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }} />
                  <Bar dataKey="attempted" fill="#65b741" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Accuracy Trend */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Accuracy Trend</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={accuracyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="date" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} domain={[60, 90]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#65b741" strokeWidth={3} dot={{ fill: '#65b741', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Average Solve Time by Difficulty */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Avg Solve Time by Difficulty</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={solveTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="difficulty" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }} />
                  <Bar dataKey="avgTime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Weakest Chapters */}
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
                        <div className={`text-sm font-bold ${chapter.accuracy >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                          {chapter.accuracy}%
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${chapter.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${chapter.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Analysis */}
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
                        <Cell fill="#7a6ee8" />
                        <Cell fill="#65b741" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef5350" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  {errorAnalysis.map((error, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ['#7a6ee8', '#65b741', '#f59e0b', '#ef5350'][idx]
                          }}
                        ></div>
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
      </main>
    </div>
  )
}
