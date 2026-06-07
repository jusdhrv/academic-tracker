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
  createConceptAction,
  updateConceptAction,
} from '@/features/catalog/actions/catalog.actions'
import type { CatalogFormOptions } from '@/types/catalog'

interface ConceptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  formOptions: CatalogFormOptions
  defaults?: { chapterId?: string }
  initial?: { id: string; name: string; chapterId: string }
}

export function ConceptDialog({
  open,
  onOpenChange,
  mode,
  formOptions,
  defaults,
  initial,
}: ConceptDialogProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const chaptersWithId = formOptions.chapters.filter((c) => c.sourceId)

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setChapterId(
        initial?.chapterId ?? defaults?.chapterId ?? chaptersWithId[0]?.id ?? '',
      )
      setError('')
    }
  }, [open, initial, defaults, chaptersWithId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result =
      mode === 'create'
        ? await createConceptAction({ name, chapterId })
        : await updateConceptAction(initial!.id, { name, chapterId })
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
            {mode === 'create' ? 'Create Concept' : 'Edit Concept'}
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
            <Label className="text-foreground">Chapter</Label>
            <Select value={chapterId} onValueChange={setChapterId}>
              <SelectTrigger className="w-full bg-secondary border-border text-foreground mt-1">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {chaptersWithId.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
