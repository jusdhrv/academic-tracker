'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CatalogTreeNode } from '@/features/catalog/components/catalog-tree-node'
import { CatalogDetailPanel } from '@/features/catalog/components/catalog-detail-panel'
import { DeleteConfirmDialog } from '@/features/catalog/components/delete-confirm-dialog'
import { SubjectDialog } from '@/features/catalog/components/dialogs/subject-dialog'
import { SourceDialog } from '@/features/catalog/components/dialogs/source-dialog'
import { ChapterDialog } from '@/features/catalog/components/dialogs/chapter-dialog'
import { ConceptDialog } from '@/features/catalog/components/dialogs/concept-dialog'
import { DifficultyDialog } from '@/features/catalog/components/dialogs/difficulty-dialog'
import { QuestionDialog } from '@/features/catalog/components/dialogs/question-dialog'
import { useCatalogTree } from '@/features/catalog/hooks/use-catalog-tree'
import { filterCatalogTree } from '@/features/catalog/utils/tree-filter'
import {
  deleteChapterAction,
  deleteConceptAction,
  deleteDifficultyAction,
  deleteQuestionAction,
  deleteSourceAction,
  deleteSubjectAction,
  getCatalogNodeDetailAction,
  getChapterForEditAction,
  getConceptForEditAction,
  getDifficultyByNameAction,
  getQuestionForEditAction,
  getSourceForEditAction,
  getSubjectForEditAction,
} from '@/features/catalog/actions/catalog.actions'
import type {
  CatalogFormOptions,
  CatalogNodeDetail,
  CatalogNodeType,
  CatalogTreeItem,
} from '@/types/catalog'

export type CatalogPageProps = {
  catalogTree: CatalogTreeItem[]
  formOptions: CatalogFormOptions
}

type DialogState =
  | { type: 'subject'; mode: 'create' | 'edit'; data?: { id: string; name: string; chartColor?: string | null } }
  | { type: 'source'; mode: 'create' | 'edit'; data?: { id: string; name: string } }
  | { type: 'chapter'; mode: 'create' | 'edit'; data?: { id: string; name: string; subjectId: string; sourceId: string; displayDifficultyId?: string | null }; defaults?: { subjectId?: string; sourceId?: string } }
  | { type: 'concept'; mode: 'create' | 'edit'; data?: { id: string; name: string; chapterId: string }; defaults?: { chapterId?: string } }
  | { type: 'difficulty'; mode: 'create' | 'edit'; data?: { id: string; name: string; sortOrder?: number } }
  | { type: 'question'; mode: 'create' | 'edit'; data?: { id: number; content: string; sourceId: string; difficultyId: string; chapterIds: string[]; conceptIds: string[]; questionNumber?: number | null }; defaults?: { sourceId?: string; difficultyId?: string; chapterIds?: string[]; conceptIds?: string[] } }
  | null

export function CatalogPage({ catalogTree, formOptions }: CatalogPageProps) {
  const router = useRouter()
  const { expanded, toggleExpand } = useCatalogTree()

  const [search, setSearch] = useState('')
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all')
  const [filterSourceId, setFilterSourceId] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')

  const [selected, setSelected] = useState<CatalogTreeItem | null>(null)
  const [detail, setDetail] = useState<CatalogNodeDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [dialog, setDialog] = useState<DialogState>(null)
  const [deleteTarget, setDeleteTarget] = useState<CatalogTreeItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredTree = useMemo(
    () =>
      filterCatalogTree(catalogTree, {
        search,
        subjectId: filterSubjectId === 'all' ? null : filterSubjectId,
        sourceId: filterSourceId === 'all' ? null : filterSourceId,
        difficulty: filterDifficulty === 'all' ? null : filterDifficulty,
      }),
    [catalogTree, search, filterSubjectId, filterSourceId, filterDifficulty],
  )

  const loadDetail = useCallback(async (item: CatalogTreeItem) => {
    setDetailLoading(true)
    const result = await getCatalogNodeDetailAction(item.type, item.entityId, item.context ?? {})
    setDetail(result)
    setDetailLoading(false)
  }, [])

  useEffect(() => {
    if (selected) loadDetail(selected)
    else setDetail(null)
  }, [selected, loadDetail])

  function handleSelect(item: CatalogTreeItem) {
    setSelected(item)
  }

  async function handleEdit() {
    if (!selected) return
    const { type, entityId, context } = selected

    switch (type) {
      case 'subject': {
        const data = await getSubjectForEditAction(entityId)
        if (data) setDialog({ type: 'subject', mode: 'edit', data })
        break
      }
      case 'source': {
        const data = await getSourceForEditAction(entityId)
        if (data) setDialog({ type: 'source', mode: 'edit', data })
        break
      }
      case 'chapter': {
        const data = await getChapterForEditAction(entityId)
        if (data && data.sourceId)
          setDialog({
            type: 'chapter',
            mode: 'edit',
            data: {
              id: data.id,
              name: data.name,
              subjectId: data.subjectId,
              sourceId: data.sourceId,
              displayDifficultyId: data.displayDifficultyId,
            },
          })
        break
      }
      case 'concept': {
        const data = await getConceptForEditAction(entityId)
        if (data && data.chapterId)
          setDialog({ type: 'concept', mode: 'edit', data: { ...data, chapterId: data.chapterId } })
        break
      }
      case 'difficulty': {
        const data = await getDifficultyByNameAction(entityId)
        if (data) setDialog({ type: 'difficulty', mode: 'edit', data })
        break
      }
      case 'question': {
        const q = await getQuestionForEditAction(Number(entityId))
        if (q)
          setDialog({
            type: 'question',
            mode: 'edit',
            data: {
              id: q.id,
              content: q.content,
              sourceId: q.sourceId,
              difficultyId: q.difficultyId,
              chapterIds: q.chapters.map((c) => c.chapterId),
              conceptIds: q.concepts.map((c) => c.conceptId),
              questionNumber: q.questionNumber,
            },
          })
        break
      }
    }
  }

  function handleCreateChild(childType: CatalogNodeType) {
    if (!selected) return
    const ctx = selected.context ?? {}

    switch (childType) {
      case 'chapter':
        setDialog({
          type: 'chapter',
          mode: 'create',
          defaults: { subjectId: ctx.subjectId, sourceId: ctx.sourceId ?? selected.entityId },
        })
        break
      case 'concept':
        setDialog({
          type: 'concept',
          mode: 'create',
          defaults: { chapterId: ctx.chapterId ?? selected.entityId },
        })
        break
      case 'question': {
        const difficulty = formOptions.difficulties.find(
          (d) => d.name === (selected.type === 'difficulty' ? selected.name : undefined),
        )
        setDialog({
          type: 'question',
          mode: 'create',
          defaults: {
            sourceId: ctx.sourceId,
            difficultyId: difficulty?.id,
            chapterIds: ctx.chapterId ? [ctx.chapterId] : undefined,
            conceptIds: ctx.conceptId ? [ctx.conceptId] : undefined,
          },
        })
        break
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const { type, entityId } = deleteTarget
    let result

    switch (type) {
      case 'subject':
        result = await deleteSubjectAction(entityId)
        break
      case 'source':
        result = await deleteSourceAction(entityId)
        break
      case 'chapter':
        result = await deleteChapterAction(entityId)
        break
      case 'concept':
        result = await deleteConceptAction(entityId)
        break
      case 'difficulty': {
        const d = await getDifficultyByNameAction(entityId)
        result = d ? await deleteDifficultyAction(d.id) : { success: false, error: 'Not found' }
        break
      }
      case 'question':
        result = await deleteQuestionAction(Number(entityId))
        break
      default:
        result = { success: false, error: 'Cannot delete this item' }
    }

    setDeleteLoading(false)
    if (result.success) {
      setDeleteTarget(null)
      setSelected(null)
      router.refresh()
    }
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Study Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Browse and organize your study materials by subject and topic.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground"
              onClick={() => setDialog({ type: 'subject', mode: 'create' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Subject
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border"
              onClick={() => setDialog({ type: 'source', mode: 'create' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Source
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border"
              onClick={() => setDialog({ type: 'difficulty', mode: 'create' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Difficulty
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border"
              onClick={() => setDialog({ type: 'question', mode: 'create' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Question
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border space-y-3">
              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground placeholder-muted-foreground"
              />
              <div className="grid grid-cols-1 gap-2">
                <Select value={filterSubjectId} onValueChange={setFilterSubjectId}>
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground text-xs h-8">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All subjects</SelectItem>
                    {formOptions.subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterSourceId} onValueChange={setFilterSourceId}>
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground text-xs h-8">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    {formOptions.sources.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground text-xs h-8">
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All difficulties</SelectItem>
                    {formOptions.difficulties.map((d) => (
                      <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filteredTree.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">No items match your filters</p>
              ) : (
                filteredTree.map((item) => (
                  <CatalogTreeNode
                    key={item.id}
                    item={item}
                    level={0}
                    expanded={expanded}
                    selectedId={selected?.id ?? null}
                    onToggle={toggleExpand}
                    onSelect={handleSelect}
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-span-2">
            <CatalogDetailPanel
              selected={selected}
              detail={detail}
              loading={detailLoading}
              onEdit={handleEdit}
              onDelete={() => selected && setDeleteTarget(selected)}
              onCreateChild={handleCreateChild}
            />
          </div>
        </div>
      </div>

      <SubjectDialog
        open={dialog?.type === 'subject'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'subject' ? dialog.mode : 'create'}
        initial={dialog?.type === 'subject' ? dialog.data : undefined}
      />
      <SourceDialog
        open={dialog?.type === 'source'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'source' ? dialog.mode : 'create'}
        initial={dialog?.type === 'source' ? dialog.data : undefined}
      />
      <ChapterDialog
        open={dialog?.type === 'chapter'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'chapter' ? dialog.mode : 'create'}
        formOptions={formOptions}
        defaults={dialog?.type === 'chapter' ? dialog.defaults : undefined}
        initial={dialog?.type === 'chapter' && dialog.mode === 'edit' ? dialog.data : undefined}
      />
      <ConceptDialog
        open={dialog?.type === 'concept'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'concept' ? dialog.mode : 'create'}
        formOptions={formOptions}
        defaults={dialog?.type === 'concept' ? dialog.defaults : undefined}
        initial={dialog?.type === 'concept' && dialog.mode === 'edit' ? dialog.data : undefined}
      />
      <DifficultyDialog
        open={dialog?.type === 'difficulty'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'difficulty' ? dialog.mode : 'create'}
        initial={dialog?.type === 'difficulty' ? dialog.data : undefined}
      />
      <QuestionDialog
        open={dialog?.type === 'question'}
        onOpenChange={(open) => !open && setDialog(null)}
        mode={dialog?.type === 'question' ? dialog.mode : 'create'}
        formOptions={formOptions}
        defaults={dialog?.type === 'question' ? dialog.defaults : undefined}
        initial={dialog?.type === 'question' && dialog.mode === 'edit' ? dialog.data : undefined}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type ?? 'item'}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </AppShell>
  )
}
