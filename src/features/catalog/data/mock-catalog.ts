import type { CatalogTreeItem } from '@/types/catalog'

export const MOCK_CATALOG_TREE: CatalogTreeItem[] = [
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
        ],
      },
      {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        type: 'topic',
        children: [
          { id: 'thermo-l1', name: 'Level 1', type: 'level', questionCount: 28, difficulty: 'Easy' },
          { id: 'thermo-l2', name: 'Level 2', type: 'level', questionCount: 42, difficulty: 'Medium' },
        ],
      },
    ],
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
        ],
      },
    ],
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
        ],
      },
    ],
  },
]

export const DEFAULT_CATALOG_EXPANDED: Record<string, boolean> = {
  physics: true,
  chemistry: true,
  mathematics: true,
  mechanics: true,
  inorganic: true,
  calculus: true,
}
