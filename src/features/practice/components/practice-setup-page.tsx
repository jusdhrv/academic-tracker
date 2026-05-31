'use client'

import { Play, Clock } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePracticeSetup } from '@/features/practice/hooks/use-practice-setup'

export function PracticeSetupPage() {
  const {
    sessionTime,
    setSessionTime,
    timePerQuestion,
    setTimePerQuestion,
    selectedSubjects,
    setSelectedSubjects,
    selectedSources,
    setSelectedSources,
    selectedDifficulties,
    setSelectedDifficulties,
    estimatedQuestions,
    subjects,
    sources,
    difficulties,
    toggleFilter,
  } = usePracticeSetup()

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Question Practice Setup</h1>
          <p className="text-muted-foreground mt-1">Configure your practice session parameters and filters.</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Session Time</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Total Session Time (minutes)</label>
                  <Input
                    type="number"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(Number(e.target.value))}
                    className="bg-secondary border-border text-foreground"
                    min="5"
                    max="240"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Time Per Question (minutes)</label>
                  <Input
                    type="number"
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                    className="bg-secondary border-border text-foreground"
                    min="0.5"
                    max="10"
                    step="0.5"
                  />
                </div>
                <div className="bg-secondary rounded p-4">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Questions</div>
                  <div className="text-2xl font-bold text-primary">{estimatedQuestions} questions</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubjects(toggleFilter(subject, selectedSubjects))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubjects.includes(subject)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Source</h3>
              <div className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <button
                    key={source}
                    onClick={() => setSelectedSources(toggleFilter(source, selectedSources))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSources.includes(source)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulties(toggleFilter(difficulty, selectedDifficulties))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulties.includes(difficulty)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-foreground mb-4">Session Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Session Duration</div>
                  <div className="text-2xl font-bold text-foreground">{sessionTime} min</div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Time Per Question</div>
                  <div className="text-2xl font-bold text-foreground">{timePerQuestion} min</div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Estimated Questions</div>
                  <div className="text-3xl font-bold text-primary">{estimatedQuestions}</div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Filters Applied</div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">Subjects:</span>
                      <span className="text-foreground ml-2 font-medium">{selectedSubjects.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sources:</span>
                      <span className="text-foreground ml-2 font-medium">{selectedSources.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Difficulties:</span>
                      <span className="text-foreground ml-2 font-medium">{selectedDifficulties.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12">
                <Play className="w-4 h-4" />
                Start Practice Session
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Questions will be selected randomly matching your filters
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
