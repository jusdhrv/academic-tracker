'use client'

import {
  ChevronDown,
  ChevronRight,
  Book,
  FileText,
  FolderOpen,
  Layers,
  Lightbulb,
  Lock,
} from 'lucide-react'
import type { CatalogTreeItem } from '@/types/catalog'
import { cn } from '@/lib/utils'

interface CatalogTreeNodeProps {
  item: CatalogTreeItem
  level: number
  expanded: Record<string, boolean>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect: (item: CatalogTreeItem) => void
}

const typeIcons = {
  subject: Book,
  source: FolderOpen,
  chapter: Layers,
  concept: Lightbulb,
  difficulty: Lock,
  question: FileText,
}

export function CatalogTreeNode({
  item,
  level,
  expanded,
  selectedId,
  onToggle,
  onSelect,
}: CatalogTreeNodeProps) {
  const isExpanded = expanded[item.id] ?? level < 2
  const hasChildren = item.children && item.children.length > 0
  const isSelected = selectedId === item.id
  const Icon = typeIcons[item.type]

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 hover:bg-secondary rounded transition-colors cursor-pointer',
          level === 0 && 'border-b border-border',
          isSelected && 'bg-primary/20 border border-primary/30',
        )}
        onClick={() => onSelect(item)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(item.id)
            }}
            className="p-0.5 hover:bg-secondary rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-primary" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
          <span
            className={cn(
              'text-sm truncate text-foreground',
              item.type === 'subject' ? 'font-semibold' : 'font-medium',
            )}
          >
            {item.name}
          </span>
        </div>

        {(item.questionCount !== undefined && item.type !== 'question') && (
          <div className="flex items-center gap-2 text-xs flex-shrink-0">
            <span className="text-muted-foreground">{item.questionCount} Q</span>
            {item.difficulty && (
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  item.difficulty === 'Easy' && 'bg-green-900/30 text-green-300',
                  item.difficulty === 'Medium' && 'bg-yellow-900/30 text-yellow-300',
                  (item.difficulty === 'Hard' || item.difficulty === 'Very Hard') &&
                    'bg-red-900/30 text-red-300',
                )}
              >
                {item.difficulty}
              </span>
            )}
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-border">
          {item.children!.map((child) => (
            <CatalogTreeNode
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
