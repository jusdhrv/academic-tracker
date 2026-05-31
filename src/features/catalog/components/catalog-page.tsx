'use client'

import { Book, Edit2 } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { CatalogTreeNode } from '@/features/catalog/components/catalog-tree-node'
import { useCatalogTree } from '@/features/catalog/hooks/use-catalog-tree'
import type { CatalogTreeItem } from '@/types/catalog'

export type CatalogPageProps = {
  catalogTree: CatalogTreeItem[]
}

export function CatalogPage({ catalogTree }: CatalogPageProps) {
  const { expanded, toggleExpand } = useCatalogTree()

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Study Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Browse and organize your study materials by subject and topic.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground placeholder-muted-foreground"
              />
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {catalogTree.map((item) => (
                <CatalogTreeNode
                  key={item.id}
                  item={item}
                  level={0}
                  expanded={expanded}
                  onToggle={toggleExpand}
                />
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-center py-12">
                <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a Topic</h3>
                <p className="text-muted-foreground">
                  Click on a topic in the catalog to view details, statistics, and manage questions.
                </p>
              </div>

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
                      <div className="h-1.5 bg-green-900/30 rounded-full" />
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
    </AppShell>
  )
}
