'use client'

import { Book, Edit2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CatalogNodeDetail, CatalogTreeItem } from '@/types/catalog'

interface CatalogDetailPanelProps {
  selected: CatalogTreeItem | null
  detail: CatalogNodeDetail | null
  loading: boolean
  onEdit: () => void
  onDelete: () => void
  onCreateChild: (type: CatalogTreeItem['type']) => void
}

const childCreateMap: Partial<Record<CatalogTreeItem['type'], CatalogTreeItem['type']>> = {
  subject: 'chapter',
  source: 'chapter',
  chapter: 'concept',
  concept: 'question',
  difficulty: 'question',
}

export function CatalogDetailPanel({
  selected,
  detail,
  loading,
  onEdit,
  onDelete,
  onCreateChild,
}: CatalogDetailPanelProps) {
  if (!selected) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Select a Topic</h3>
          <p className="text-muted-foreground">
            Click on an item in the catalog to view details, statistics, and manage questions.
          </p>
        </div>
      </div>
    )
  }

  if (loading || !detail) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center py-12 text-muted-foreground">Loading details…</div>
      </div>
    )
  }

  const childType = childCreateMap[selected.type]

  return (
    <div className="bg-card border border-border rounded-lg p-8 space-y-6">
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {selected.type}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{detail.name}</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-secondary rounded p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Questions</div>
          <div className="text-2xl font-bold text-foreground">{detail.questionCount}</div>
        </div>
        <div className="bg-secondary rounded p-4">
          <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
          <div className="space-y-1 mt-2">
            {detail.difficultyBreakdown.length > 0 ? (
              detail.difficultyBreakdown.map((d) => (
                <div key={d.name} className="flex justify-between text-xs">
                  <span className="text-foreground">{d.name}: {d.count}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No questions</span>
            )}
          </div>
        </div>
        <div className="bg-secondary rounded p-4">
          <div className="text-xs text-muted-foreground mb-1">Tags</div>
          <div className="flex gap-1 flex-wrap mt-2">
            {detail.tags.length > 0 ? (
              detail.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </div>

      {detail.questions.length > 0 && (
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Questions</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {detail.questions.map((q) => (
              <div key={q.id} className="bg-secondary rounded p-3 text-sm">
                <p className="text-foreground line-clamp-2">{q.content}</p>
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{q.source}</span>
                  <span>·</span>
                  <span>{q.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {childType && (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onCreateChild(childType)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {childType.charAt(0).toUpperCase() + childType.slice(1)}
            </Button>
          )}
          {selected.type !== 'difficulty' && (
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {selected.type !== 'difficulty' && (
            <Button
              variant="outline"
              className="border-red-900/50 text-red-400 hover:bg-red-900/20"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
