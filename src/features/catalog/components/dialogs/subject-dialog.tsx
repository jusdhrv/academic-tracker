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
  createSubjectAction,
  updateSubjectAction,
} from '@/features/catalog/actions/catalog.actions'

interface SubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  initial?: { id: string; name: string; chartColor?: string | null }
}

export function SubjectDialog({ open, onOpenChange, mode, initial }: SubjectDialogProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [chartColor, setChartColor] = useState('#7a6ee8')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setChartColor(initial?.chartColor ?? '#7a6ee8')
      setError('')
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result =
      mode === 'create'
        ? await createSubjectAction({ name, chartColor })
        : await updateSubjectAction(initial!.id, { name, chartColor })
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
            {mode === 'create' ? 'Create Subject' : 'Edit Subject'}
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
            <Label className="text-foreground">Chart Color</Label>
            <Input
              value={chartColor}
              onChange={(e) => setChartColor(e.target.value)}
              className="bg-secondary border-border text-foreground mt-1"
              placeholder="#7a6ee8"
            />
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
