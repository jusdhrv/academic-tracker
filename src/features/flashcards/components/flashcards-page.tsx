'use client'

import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { useFlashcardSession } from '@/features/flashcards/hooks/use-flashcard-session'
import type { Flashcard } from '@/types/flashcard'

export type FlashcardsPageProps = {
  flashcards: Flashcard[]
  dueCount: number
}

export function FlashcardsPage({ flashcards, dueCount }: FlashcardsPageProps) {
  const {
    currentCard,
    currentIndex,
    totalCards,
    dueCards,
    isFlipped,
    setIsFlipped,
    progress,
    handleResponse,
    countByResponse,
  } = useFlashcardSession(flashcards, dueCount)

  if (!currentCard) return null

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Theory Practice</h1>
          <p className="text-muted-foreground mt-1">Review concepts using spaced repetition flashcards.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Cards Due Today</div>
              <div className="text-3xl font-bold text-foreground">{dueCards}</div>
              <div className="text-xs text-muted-foreground mt-2">Cards awaiting review</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-2">Current Queue</div>
              <div className="text-2xl font-bold text-foreground">
                {currentIndex + 1}/{totalCards}
              </div>
              <div className="text-xs text-muted-foreground mt-2">Session progress</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-3">Session Progress</div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-foreground mt-2 font-medium">{Math.round(progress)}%</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-sm text-muted-foreground mb-4">Response Distribution</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Again</span>
                  <span className="text-red-400 font-semibold">{countByResponse('again')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Hard</span>
                  <span className="text-orange-400 font-semibold">{countByResponse('hard')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Good</span>
                  <span className="text-green-400 font-semibold">{countByResponse('good')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Easy</span>
                  <span className="text-blue-400 font-semibold">{countByResponse('easy')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-card border border-border rounded-lg p-12 min-h-[600px] flex flex-col justify-between">
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
    </AppShell>
  )
}
