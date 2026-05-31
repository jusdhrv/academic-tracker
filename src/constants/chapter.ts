export const CHAPTER_NODE_TYPE = {
  TOPIC: 'TOPIC',
  LEVEL: 'LEVEL',
} as const

export type ChapterNodeType = (typeof CHAPTER_NODE_TYPE)[keyof typeof CHAPTER_NODE_TYPE]
