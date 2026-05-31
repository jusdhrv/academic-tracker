'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Play, TrendingUp } from 'lucide-react'

const weeklyData = [
  { day: 'Mon', questions: 12, flashcards: 8, minutes: 45 },
  { day: 'Tue', questions: 19, flashcards: 12, minutes: 62 },
  { day: 'Wed', questions: 15, flashcards: 10, minutes: 50 },
  { day: 'Thu', questions: 25, flashcards: 14, minutes: 75 },
  { day: 'Fri', questions: 22, flashcards: 16, minutes: 68 },
  { day: 'Sat', questions: 28, flashcards: 18, minutes: 85 },
  { day: 'Sun', questions: 18, flashcards: 11, minutes: 55 },
]

const subjectData = [
  { name: 'Physics', value: 35, color: '#7a6ee8' },
  { name: 'Chemistry', value: 32, color: '#65b741' },
  { name: 'Mathematics', value: 33, color: '#f59e0b' },
]

const performanceData = [
  { date: 'Week 1', accuracy: 72 },
  { date: 'Week 2', accuracy: 75 },
  { date: 'Week 3', accuracy: 78 },
  { date: 'Week 4', accuracy: 82 },
  { date: 'Week 5', accuracy: 85 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      {/* Main content */}
      <main className="ml-64 mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Questions Due Today */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Questions Due Today</div>
              <div className="text-3xl font-bold text-foreground">47</div>
              <div className="text-xs text-primary mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12 from yesterday
              </div>
            </div>

            {/* Flashcards Due */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Flashcards Due Today</div>
              <div className="text-3xl font-bold text-foreground">23</div>
              <div className="text-xs text-muted-foreground mt-2">2 chapters</div>
            </div>

            {/* Study Time This Week */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Study Time This Week</div>
              <div className="text-3xl font-bold text-foreground">7h 20m</div>
              <div className="text-xs text-primary mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +45 min vs last week
              </div>
            </div>

            {/* Overall Accuracy */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Accuracy Rate</div>
              <div className="text-3xl font-bold text-foreground">85%</div>
              <div className="text-xs text-foreground/50 mt-2">All time average</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Weekly Activity */}
            <div className="col-span-2 bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Study Activity</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="day" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }}
                    labelStyle={{ color: '#f2f2f7' }}
                  />
                  <Bar dataKey="questions" fill="#7a6ee8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="flashcards" fill="#65b741" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Distribution */}
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
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }}
                    labelStyle={{ color: '#f2f2f7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {subjectData.map((subject) => (
                  <div key={subject.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }}></div>
                      <span className="text-muted-foreground">{subject.name}</span>
                    </div>
                    <span className="text-foreground font-semibold">{subject.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                <XAxis dataKey="date" stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8b8ba8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #3a3a4a' }}
                  labelStyle={{ color: '#f2f2f7' }}
                />
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
      </main>
    </div>
  )
}
