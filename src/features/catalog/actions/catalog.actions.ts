'use server'

import { revalidatePath } from 'next/cache'
import { catalogCrudRepository } from '@/db/repositories/catalog-crud.repository'
import { catalogRepository } from '@/db/repositories/catalog.repository'
import type { CatalogNodeDetail } from '@/types/catalog'

function revalidate() {
  revalidatePath('/cataloging')
}

export type ActionResult = { success: true } | { success: false; error: string }

async function run(action: () => Promise<void>): Promise<ActionResult> {
  try {
    await action()
    revalidate()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// Subject
export async function createSubjectAction(data: {
  name: string
  chartColor?: string
}): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createSubject(data))
}

export async function updateSubjectAction(
  id: string,
  data: { name: string; chartColor?: string },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateSubject(id, data))
}

export async function deleteSubjectAction(id: string): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteSubject(id))
}

// Source
export async function createSourceAction(data: { name: string }): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createSource(data))
}

export async function updateSourceAction(
  id: string,
  data: { name: string },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateSource(id, data))
}

export async function deleteSourceAction(id: string): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteSource(id))
}

// Chapter
export async function createChapterAction(data: {
  name: string
  subjectId: string
  sourceId: string
  displayDifficultyId?: string
}): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createChapter(data))
}

export async function updateChapterAction(
  id: string,
  data: {
    name: string
    subjectId: string
    sourceId: string
    displayDifficultyId?: string | null
  },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateChapter(id, data))
}

export async function deleteChapterAction(id: string): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteChapter(id))
}

// Concept
export async function createConceptAction(data: {
  name: string
  chapterId: string
}): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createConcept(data))
}

export async function updateConceptAction(
  id: string,
  data: { name: string; chapterId: string },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateConcept(id, data))
}

export async function deleteConceptAction(id: string): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteConcept(id))
}

// Difficulty
export async function createDifficultyAction(data: {
  name: string
  sortOrder?: number
}): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createDifficulty(data))
}

export async function updateDifficultyAction(
  id: string,
  data: { name: string; sortOrder?: number },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateDifficulty(id, data))
}

export async function deleteDifficultyAction(id: string): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteDifficulty(id))
}

// Question
export async function createQuestionAction(data: {
  content: string
  sourceId: string
  difficultyId: string
  chapterIds: string[]
  conceptIds: string[]
  questionNumber?: number
}): Promise<ActionResult> {
  return run(() => catalogCrudRepository.createQuestion(data))
}

export async function updateQuestionAction(
  id: number,
  data: {
    content: string
    sourceId: string
    difficultyId: string
    chapterIds: string[]
    conceptIds: string[]
    questionNumber?: number | null
  },
): Promise<ActionResult> {
  return run(() => catalogCrudRepository.updateQuestion(id, data))
}

export async function deleteQuestionAction(id: number): Promise<ActionResult> {
  return run(() => catalogCrudRepository.deleteQuestion(id))
}

export async function getChapterForEditAction(id: string) {
  const { prisma } = await import('@/db/prisma/client')
  return prisma.chapter.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      subjectId: true,
      sourceId: true,
      displayDifficultyId: true,
    },
  })
}

export async function getConceptForEditAction(id: string) {
  const { prisma } = await import('@/db/prisma/client')
  return prisma.concept.findUnique({
    where: { id },
    select: { id: true, name: true, chapterId: true },
  })
}

export async function getQuestionForEditAction(id: number) {
  return catalogCrudRepository.getQuestionForEdit(id)
}

export async function getSubjectForEditAction(id: string) {
  const { prisma } = await import('@/db/prisma/client')
  return prisma.subject.findUnique({
    where: { id },
    select: { id: true, name: true, chartColor: true },
  })
}

export async function getSourceForEditAction(id: string) {
  const { prisma } = await import('@/db/prisma/client')
  return prisma.source.findUnique({
    where: { id },
    select: { id: true, name: true },
  })
}

export async function getDifficultyByNameAction(name: string) {
  const { prisma } = await import('@/db/prisma/client')
  return prisma.difficulty.findFirst({
    where: { name },
    select: { id: true, name: true, sortOrder: true },
  })
}

export async function getCatalogNodeDetailAction(
  type: string,
  entityId: string,
  context: Record<string, string | number | undefined> = {},
): Promise<CatalogNodeDetail | null> {
  return catalogRepository.getNodeDetail(type, entityId, context)
}
