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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createChapterAction,
  updateChapterAction,
} from '@/features/catalog/actions/catalog.actions'
import type { CatalogFormOptions } from '@/types/catalog'

interface ChapterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  formOptions: CatalogFormOptions
  defaults?: { subjectId?: string; sourceId?: string }
  initial?: {
    id: string
    name: string
    subjectId: string
    sourceId: string
    displayDifficultyId?: string | null
  }
}

export function ChapterDialog({
  open,
  onOpenChange,
  mode,
  formOptions,
  defaults,
  initial,
}: ChapterDialogProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [displayDifficultyId, setDisplayDifficultyId] = useState<string>('none')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setSubjectId(initial?.subjectId ?? defaults?.subjectId ?? formOptions.subjects[0]?.id ?? '')
      setSourceId(initial?.sourceId ?? defaults?.sourceId ?? formOptions.sources[0]?.id ?? '')
      setDisplayDifficultyId(initial?.displayDifficultyId ?? 'none')
      setError('')
    }
  }, [open, initial, defaults, formOptions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {
      name,
      subjectId,
      sourceId,
      displayDifficultyId: displayDifficultyId === 'none' ? undefined : displayDifficultyId,
    }
    const result =
      mode === 'create'
        ? await createChapterAction(payload)
        : await updateChapterAction(initial!.id, {
            ...payload,
            displayDifficultyId: displayDifficultyId === 'none' ? null : displayDifficultyId,
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
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'create' ? 'Create Chapter' : 'Edit Chapter'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border text-foreground mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-foreground">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Source</Label>
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.sources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Display Difficulty (optional)</Label>
            <Select value={displayDifficultyId} onValueChange={setDisplayDifficultyId}>
              <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {formOptions.difficulties.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
