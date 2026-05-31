'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Question {
  id: number
  questionNumber: number
  source: string
  chapter: string
  concepts: string[]
  difficulty: string
  content: string
}

const questions: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    source: 'JEE Main 2023',
    chapter: 'Kinematics',
    concepts: ['Velocity', 'Acceleration', 'Equations of Motion'],
    difficulty: 'Hard',
    content: 'A particle starts from rest and moves along a straight line. If its acceleration is given by a = 2t m/s² where t is in seconds, then the distance covered in the first 4 seconds is?'
  },
  {
    id: 2,
    questionNumber: 2,
    source: 'JEE Main 2023',
    chapter: 'Work, Energy & Power',
    concepts: ['Kinetic Energy', 'Potential Energy', 'Conservation'],
    difficulty: 'Hard',
    content: 'A ball is thrown upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)'
  },
]

interface SubmissionModal {
  isOpen: boolean
  confidence: number
  errorType: string
  questionType: string
}

export default function ActiveQuestionPracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submission, setSubmission] = useState<SubmissionModal>({
    isOpen: false,
    confidence: 3,
    errorType: 'calculation',
    questionType: 'numerical'
  })

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTime(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmission = (type: 'solved-fast' | 'solved-slow' | 'failed' | 'skipped') => {
    setSubmitted(true)
    if (type === 'failed') {
      setSubmission(prev => ({ ...prev, isOpen: true }))
    } else if (type === 'solved-fast' || type === 'solved-slow') {
      setSubmission(prev => ({ ...prev, isOpen: true }))
    } else {
      moveToNext()
    }
  }

  const moveToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setTime(0)
      setIsRunning(false)
      setSubmitted(false)
      setSubmission(prev => ({ ...prev, isOpen: false }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with progress */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Question {currentQuestion.questionNumber}/{totalQuestions}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Session Progress</div>
                <div className="text-lg font-semibold text-foreground">{currentIndex}/{totalQuestions}</div>
              </div>
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Left Sidebar - Question Metadata */}
            <div className="col-span-1 space-y-4">
              {/* Source & Chapter */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Question Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Source</div>
                    <div className="text-sm font-medium text-foreground">{currentQuestion.source}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Chapter</div>
                    <div className="text-sm font-medium text-foreground">{currentQuestion.chapter}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
                    <div className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded w-fit font-medium">
                      {currentQuestion.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Concepts */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Concepts Tested</h3>
                <div className="space-y-2">
                  {currentQuestion.concepts.map((concept, idx) => (
                    <div key={idx} className="text-xs px-2 py-1.5 bg-primary/20 text-primary rounded">
                      {concept}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Number */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Question Number</div>
                <div className="text-2xl font-bold text-foreground">{currentQuestion.questionNumber}</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-3 space-y-6">
              {/* Timer */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary font-mono mb-4">
                    {formatTime(time)}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`${isRunning ? 'bg-orange-600/80 hover:bg-orange-700/80' : 'bg-primary hover:bg-primary/90'} text-primary-foreground flex items-center gap-2`}
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? 'Pause' : 'Start'} Timer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                  {currentQuestion.content}
                </h2>

                {/* Solution Area (placeholder) */}
                <div className="bg-secondary rounded-lg p-6 mb-6 min-h-[200px]">
                  <div className="text-sm text-muted-foreground">Write your solution here...</div>
                </div>

                {/* Action Buttons */}
                {!submitted ? (
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      onClick={() => handleSubmission('solved-fast')}
                      className="bg-green-700/80 hover:bg-green-800/80 text-white flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Solved Fast</span>
                    </Button>
                    <Button
                      onClick={() => handleSubmission('solved-slow')}
                      className="bg-blue-700/80 hover:bg-blue-800/80 text-white flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Solved Slow</span>
                    </Button>
                    <Button
                      onClick={() => handleSubmission('failed')}
                      className="bg-red-700/80 hover:bg-red-800/80 text-white flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Failed</span>
                    </Button>
                    <Button
                      onClick={() => handleSubmission('skipped')}
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-secondary flex items-center justify-center gap-2"
                    >
                      <SkipForward className="w-4 h-4" />
                      <span className="text-sm">Skip</span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">Proceeding to feedback...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Modal */}
          {submission.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
              <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
                <h2 className="text-xl font-bold text-foreground mb-6">Question Feedback</h2>

                {/* Confidence Rating */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground mb-3 block">How confident were you?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSubmission(prev => ({ ...prev, confidence: rating }))}
                        className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                          submission.confidence === rating
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">1 = Not confident, 5 = Very confident</p>
                </div>

                {/* Error Type */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground mb-3 block">Error Type</label>
                  <select
                    value={submission.errorType}
                    onChange={(e) => setSubmission(prev => ({ ...prev, errorType: e.target.value }))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
                  >
                    <option value="calculation">Calculation Error</option>
                    <option value="conceptual">Conceptual Misunderstanding</option>
                    <option value="careless">Careless Mistake</option>
                    <option value="methodology">Wrong Methodology</option>
                  </select>
                </div>

                {/* Question Type */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground mb-3 block">Question Type</label>
                  <select
                    value={submission.questionType}
                    onChange={(e) => setSubmission(prev => ({ ...prev, questionType: e.target.value }))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
                  >
                    <option value="numerical">Numerical</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="derivation">Derivation</option>
                    <option value="conceptual">Conceptual</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={moveToNext}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Next Question
                  </Button>
                  <Button
                    onClick={() => setSubmission(prev => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
