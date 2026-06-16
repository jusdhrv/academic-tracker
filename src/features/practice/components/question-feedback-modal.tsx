'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { QuestionSubmissionFeedback } from '@/types/question'

interface QuestionFeedbackModalProps {
  submission: QuestionSubmissionFeedback
  onUpdate: (patch: Partial<QuestionSubmissionFeedback>) => void
  onNext: () => void
  onClose: () => void
}

export function QuestionFeedbackModal({
  submission,
  onUpdate,
  onNext,
  onClose,
}: QuestionFeedbackModalProps) {
  const [tagInput, setTagInput] = useState('')

  if (!submission.isOpen) return null

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (submission.tags.includes(trimmed)) {
      setTagInput('')
      return
    }

    onUpdate({ tags: [...submission.tags, trimmed] })
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    onUpdate({ tags: submission.tags.filter((existing) => existing !== tag) })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-foreground mb-6">Question Feedback</h2>

        <div className="mb-6">
          <label className="text-sm font-semibold text-foreground mb-3 block">How confident were you?</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onUpdate({ confidence: rating })}
                className={`py-2 px-3 rounded text-sm font-medium transition-colors ${submission.confidence === rating
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

        <div className="mb-6">
          <label className="text-sm font-semibold text-foreground mb-3 block">Error Type</label>
          <select
            value={submission.errorType}
            onChange={(e) => onUpdate({ errorType: e.target.value })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
          >
            <option value="calculation">Calculation Error</option>
            <option value="conceptual">Conceptual Misunderstanding</option>
            <option value="careless">Careless Mistake</option>
            <option value="methodology">Wrong Methodology</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-foreground mb-3 block">Question Type</label>
          <select
            value={submission.questionType}
            onChange={(e) => onUpdate({ questionType: e.target.value })}
            className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
          >
            <option value="numerical">Numerical</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="derivation">Derivation</option>
            <option value="conceptual">Conceptual</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-foreground mb-3 block">Feedback Tags</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add a tag"
              className="flex-1 bg-secondary border-border text-foreground"
            />
            <Button type="button" onClick={addTag} className="bg-primary text-primary-foreground">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {submission.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="px-3 py-1 rounded-full border border-border bg-secondary text-sm text-foreground hover:bg-border"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            Next Question
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}
