'use client'

import { Play, Pause, SkipForward, CheckCircle, XCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { QuestionFeedbackModal } from '@/features/practice/components/question-feedback-modal'
import { useActivePractice } from '@/features/practice/hooks/use-active-practice'
import { formatElapsedTime } from '@/features/practice/utils/format-time'
import type { PracticeQuestion } from '@/types/question'

export type ActivePracticePageProps = {
  questions: PracticeQuestion[]
}

export function ActivePracticePage({ questions }: ActivePracticePageProps) {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    time,
    isRunning,
    setIsRunning,
    submitted,
    submission,
    setSubmission,
    handleSubmission,
    moveToNext,
  } = useActivePractice(questions)

  if (!currentQuestion) return null

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Question {currentQuestion.questionNumber}/{totalQuestions}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Session Progress</div>
              <div className="text-lg font-semibold text-foreground">
                {currentIndex}/{totalQuestions}
              </div>
            </div>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-4">
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

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Question Number</div>
              <div className="text-2xl font-bold text-foreground">{currentQuestion.questionNumber}</div>
            </div>
          </div>

          <div className="col-span-3 space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary font-mono mb-4">{formatElapsedTime(time)}</div>
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

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                {currentQuestion.content}
              </h2>

              <div className="bg-secondary rounded-lg p-6 mb-6 min-h-[200px]">
                <div className="text-sm text-muted-foreground">Write your solution here...</div>
              </div>

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

        <QuestionFeedbackModal
          submission={submission}
          onUpdate={(patch) => setSubmission((prev) => ({ ...prev, ...patch }))}
          onNext={moveToNext}
          onClose={() => setSubmission((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </AppShell>
  )
}
