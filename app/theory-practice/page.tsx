'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { RotateCcw, Zap } from 'lucide-react'

const flashcards = [
  {
    id: 1,
    subject: 'Physics',
    chapter: 'Kinematics',
    concept: 'Equations of Motion',
    front: 'What are the three equations of motion?',
    back: 'The three equations of motion are: v = u + at, s = ut + ½at², and v² = u² + 2as',
  },
  {
    id: 2,
    subject: 'Chemistry',
    chapter: 'Stoichiometry',
    concept: 'Mole Concept',
    front: 'Define Avogadro\'s Number',
    back: 'Avogadro\'s number is 6.022 × 10²³, representing the number of particles in one mole of a substance.',
  },
  {
    id: 3,
    subject: 'Mathematics',
    chapter: 'Calculus',
    concept: 'Derivatives',
    front: 'What is the derivative of sin(x)?',
    back: 'The derivative of sin(x) is cos(x)',
  },
]

export default function TheoryPracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [responses, setResponses] = useState<Record<number, string>>({})

  const currentCard = flashcards[currentIndex]
  const totalCards = flashcards.length
  const dueCards = 47

  const handleResponse = (response: 'again' | 'hard' | 'good' | 'easy') => {
    setResponses(prev => ({
      ...prev,
      [currentCard.id]: response
    }))
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const progress = ((Object.keys(responses).length) / totalCards) * 100

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Theory Practice</h1>
            <p className="text-muted-foreground mt-1">Review concepts using spaced repetition flashcards.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Panel - Stats */}
            <div className="space-y-4">
              {/* Cards Due */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">Cards Due Today</div>
                <div className="text-3xl font-bold text-foreground">{dueCards}</div>
                <div className="text-xs text-muted-foreground mt-2">Cards awaiting review</div>
              </div>

              {/* Current Queue */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-2">Current Queue</div>
                <div className="text-2xl font-bold text-foreground">{currentIndex + 1}/{totalCards}</div>
                <div className="text-xs text-muted-foreground mt-2">Session progress</div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-3">Session Progress</div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-foreground mt-2 font-medium">{Math.round(progress)}%</div>
              </div>

              {/* Difficulty Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-sm text-muted-foreground mb-4">Response Distribution</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Again</span>
                    <span className="text-red-400 font-semibold">{Object.values(responses).filter(r => r === 'again').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Hard</span>
                    <span className="text-orange-400 font-semibold">{Object.values(responses).filter(r => r === 'hard').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Good</span>
                    <span className="text-green-400 font-semibold">{Object.values(responses).filter(r => r === 'good').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Easy</span>
                    <span className="text-blue-400 font-semibold">{Object.values(responses).filter(r => r === 'easy').length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Flashcard */}
            <div className="col-span-2">
              <div className="bg-card border border-border rounded-lg p-12 min-h-[600px] flex flex-col justify-between">
                {/* Card Metadata */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
                      {currentCard.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-xs text-muted-foreground">{currentCard.chapter}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{currentCard.concept}</div>
                </div>

                {/* Flashcard */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 flex items-center justify-center cursor-pointer mb-8 transition-transform duration-500"
                  style={{
                    perspective: '1000px',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div className="w-full bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-xl p-12 text-center">
                    <p className="text-xl font-semibold text-foreground leading-relaxed">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                    <p className="text-xs text-muted-foreground mt-6">
                      {isFlipped ? 'Click to show question' : 'Click to reveal answer'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  <Button
                    onClick={() => handleResponse('again')}
                    variant="outline"
                    className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                  >
                    <span className="text-xs">Again</span>
                  </Button>
                  <Button
                    onClick={() => handleResponse('hard')}
                    variant="outline"
                    className="border-orange-900/50 text-orange-400 hover:bg-orange-900/20"
                  >
                    <span className="text-xs">Hard</span>
                  </Button>
                  <Button
                    onClick={() => handleResponse('good')}
                    variant="outline"
                    className="border-green-900/50 text-green-400 hover:bg-green-900/20"
                  >
                    <span className="text-xs">Good</span>
                  </Button>
                  <Button
                    onClick={() => handleResponse('easy')}
                    variant="outline"
                    className="border-blue-900/50 text-blue-400 hover:bg-blue-900/20"
                  >
                    <span className="text-xs">Easy</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
