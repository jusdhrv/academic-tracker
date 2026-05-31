export type FlashcardResponse = 'again' | 'hard' | 'good' | 'easy'

export interface Flashcard {
  id: number
  subject: string
  chapter: string
  concept: string
  front: string
  back: string
}
