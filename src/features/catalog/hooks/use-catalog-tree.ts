'use client'

import { useState } from 'react'
import { DEFAULT_CATALOG_EXPANDED } from '@/features/catalog/data/mock-catalog'

export function useCatalogTree(initialExpanded = DEFAULT_CATALOG_EXPANDED) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return { expanded, toggleExpand }
}
