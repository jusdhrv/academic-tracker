'use client'

import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { ChevronRight, ChevronDown, Book, Lock, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TreeItem {
  id: string
  name: string
  type: 'subject' | 'topic' | 'level'
  questionCount?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
  expanded?: boolean
  children?: TreeItem[]
}

const catalogData: TreeItem[] = [
  {
    id: 'physics',
    name: 'Physics',
    type: 'subject',
    expanded: true,
    children: [
      {
        id: 'mechanics',
        name: 'Mechanics & Motion',
        type: 'topic',
        expanded: true,
        children: [
          { id: 'mech-l1', name: 'Level 1', type: 'level', questionCount: 35, difficulty: 'Easy' },
          { id: 'mech-l2', name: 'Level 2', type: 'level', questionCount: 48, difficulty: 'Medium' },
          { id: 'mech-l3', name: 'Level 3', type: 'level', questionCount: 20, difficulty: 'Hard' },
        ]
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        type: 'topic',
        children: [
          { id: 'thermo-l1', name: 'Level 1', type: 'level', questionCount: 28, difficulty: 'Easy' },
          { id: 'thermo-l2', name: 'Level 2', type: 'level', questionCount: 42, difficulty: 'Medium' },
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    type: 'subject',
    expanded: true,
    children: [
      {
        id: 'inorganic',
        name: 'Inorganic Chemistry',
        type: 'topic',
        expanded: true,
        children: [
          { id: 'inorg-mole', name: 'Mole Concept', type: 'level', questionCount: 52, difficulty: 'Medium' },
          { id: 'inorg-reactions', name: 'Chemical Reactions', type: 'level', questionCount: 38, difficulty: 'Hard' },
        ]
      }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    type: 'subject',
    expanded: true,
    children: [
      {
        id: 'calculus',
        name: 'Calculus',
        type: 'topic',
        expanded: true,
        children: [
          { id: 'calc-limits', name: 'Limits & Derivatives', type: 'level', questionCount: 64, difficulty: 'Hard' },
          { id: 'calc-integration', name: 'Integration', type: 'level', questionCount: 45, difficulty: 'Hard' },
        ]
      }
    ]
  }
]

export default function CatalogingPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    physics: true,
    chemistry: true,
    mathematics: true,
    mechanics: true,
    inorganic: true,
    calculus: true,
  })

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const TreeNode = ({ item, level }: { item: TreeItem; level: number }) => {
    const isExpanded = expanded[item.id]
    const hasChildren = item.children && item.children.length > 0

    return (
      <div>
        <div className={`flex items-center gap-2 px-4 py-2.5 hover:bg-secondary rounded transition-colors ${level === 0 ? 'border-b border-border' : ''}`}>
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-0.5 hover:bg-secondary rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
          ) : (
            <div className="w-5"></div>
          )}

          <div className="flex-1 flex items-center gap-2">
            {item.type === 'subject' && <Book className="w-4 h-4 text-primary" />}
            {item.type === 'topic' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
            {item.type === 'level' && <Lock className="w-3 h-3 text-muted-foreground" />}

            <span className={`text-sm font-${item.type === 'subject' ? 'semibold' : 'medium'} text-foreground`}>
              {item.name}
            </span>
          </div>

          {item.type === 'level' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{item.questionCount} Q</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.difficulty === 'Easy' ? 'bg-green-900/30 text-green-300' :
                  item.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-300' :
                  'bg-red-900/30 text-red-300'
                }`}>
                  {item.difficulty}
                </span>
              </div>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-border">
            {item.children!.map(child => (
              <TreeNode key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Study Catalog</h1>
            <p className="text-muted-foreground mt-1">Browse and organize your study materials by subject and topic.</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Sidebar Tree */}
            <div className="col-span-1 bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground placeholder-muted-foreground"
                />
              </div>
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {catalogData.map(item => (
                  <TreeNode key={item.id} item={item} level={0} />
                ))}
              </div>
            </div>

            {/* Details Panel */}
            <div className="col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-center py-12">
                  <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Topic</h3>
                  <p className="text-muted-foreground">Click on a topic in the catalog to view details, statistics, and manage questions.</p>
                </div>

                {/* Stats Grid (would show when topic selected) */}
                <div className="hidden space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary rounded p-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Questions</div>
                      <div className="text-2xl font-bold text-foreground">203</div>
                    </div>
                    <div className="bg-secondary rounded p-4">
                      <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground">Easy: 35</span>
                        </div>
                        <div className="h-1.5 bg-green-900/30 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-secondary rounded p-4">
                      <div className="text-xs text-muted-foreground mb-1">Tags</div>
                      <div className="flex gap-1 flex-wrap mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">Mechanics</span>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">Motion</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>
                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Practice
                      </Button>
                      <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
