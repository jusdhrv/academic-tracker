import { FlashcardsPage } from '@/features/flashcards/components/flashcards-page'
import { flashcardsService } from '@/services/flashcards.service'

export default async function Page() {
  const { flashcards, dueCount } = await flashcardsService.getSession()
  return <FlashcardsPage flashcards={flashcards} dueCount={dueCount} />
}
