'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createQuestionAction,
  updateQuestionAction,
} from '@/features/catalog/actions/catalog.actions'
import type { CatalogFormOptions } from '@/types/catalog'

interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  formOptions: CatalogFormOptions
  defaults?: {
    sourceId?: string
    difficultyId?: string
    chapterIds?: string[]
    conceptIds?: string[]
  }
  initial?: {
    id: number
    content: string
    sourceId: string
    difficultyId: string
    chapterIds: string[]
    conceptIds: string[]
    questionNumber?: number | null
  }
}

export function QuestionDialog({
  open,
  onOpenChange,
  mode,
  formOptions,
  defaults,
  initial,
}: QuestionDialogProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [difficultyId, setDifficultyId] = useState('')
  const [chapterIds, setChapterIds] = useState<string[]>([])
  const [conceptIds, setConceptIds] = useState<string[]>([])
  const [questionNumber, setQuestionNumber] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setContent(initial?.content ?? '')
      setSourceId(initial?.sourceId ?? defaults?.sourceId ?? formOptions.sources[0]?.id ?? '')
      setDifficultyId(
        initial?.difficultyId ??
          defaults?.difficultyId ??
          formOptions.difficulties.find((d) => d.name === 'Medium')?.id ??
          formOptions.difficulties[0]?.id ??
          '',
      )
      setChapterIds(initial?.chapterIds ?? defaults?.chapterIds ?? [])
      setConceptIds(initial?.conceptIds ?? defaults?.conceptIds ?? [])
      setQuestionNumber(initial?.questionNumber?.toString() ?? '')
      setError('')
    }
  }, [open, initial, defaults, formOptions])

  function toggleId(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (chapterIds.length === 0 || conceptIds.length === 0) {
      setError('Select at least one chapter and one concept')
      return
    }
    setLoading(true)
    setError('')
    const payload = {
      content,
      sourceId,
      difficultyId,
      chapterIds,
      conceptIds,
      questionNumber: questionNumber ? Number(questionNumber) : undefined,
    }
    const result =
      mode === 'create'
        ? await createQuestionAction(payload)
        : await updateQuestionAction(initial!.id, {
            ...payload,
            questionNumber: questionNumber ? Number(questionNumber) : null,
          })
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Create Question' : 'Edit Question'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground">Question Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-secondary border-border text-foreground mt-1 min-h-[100px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Source</Label>
              <Select value={sourceId} onValueChange={setSourceId}>
                <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.sources.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Difficulty</Label>
              <Select value={difficultyId} onValueChange={setDifficultyId}>
                <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.difficulties.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-foreground">Question Number (optional)</Label>
            <Input
              type="number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground mb-2 block">Chapters (multiple)</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto bg-secondary rounded p-3">
              {formOptions.chapters.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <Checkbox
                    checked={chapterIds.includes(c.id)}
                    onCheckedChange={() => setChapterIds(toggleId(chapterIds, c.id))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-foreground mb-2 block">Concepts (multiple)</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto bg-secondary rounded p-3">
              {formOptions.concepts.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <Checkbox
                    checked={conceptIds.includes(c.id)}
                    onCheckedChange={() => setConceptIds(toggleId(conceptIds, c.id))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" className="border-border" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
              {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
