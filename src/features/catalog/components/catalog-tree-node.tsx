'use client'

import { ChevronDown, ChevronRight, Book, Lock } from 'lucide-react'
import type { CatalogTreeItem } from '@/types/catalog'

interface CatalogTreeNodeProps {
  item: CatalogTreeItem
  level: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
}

export function CatalogTreeNode({ item, level, expanded, onToggle }: CatalogTreeNodeProps) {
  const isExpanded = expanded[item.id]
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-2.5 hover:bg-secondary rounded transition-colors ${level === 0 ? 'border-b border-border' : ''}`}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(item.id)}
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

        <div className="flex-1 flex items-center gap-2">
          {item.type === 'subject' && <Book className="w-4 h-4 text-primary" />}
          {item.type === 'topic' && <div className="w-2 h-2 rounded-full bg-accent" />}
          {item.type === 'level' && <Lock className="w-3 h-3 text-muted-foreground" />}

          <span
            className={`text-sm font-${item.type === 'subject' ? 'semibold' : 'medium'} text-foreground`}
          >
            {item.name}
          </span>
        </div>

        {item.type === 'level' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{item.questionCount} Q</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  item.difficulty === 'Easy'
                    ? 'bg-green-900/30 text-green-300'
                    : item.difficulty === 'Medium'
                      ? 'bg-yellow-900/30 text-yellow-300'
                      : 'bg-red-900/30 text-red-300'
                }`}
              >
                {item.difficulty}
              </span>
            </div>
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
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
