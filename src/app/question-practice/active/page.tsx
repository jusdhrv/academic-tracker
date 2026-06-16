import { ActivePracticePage } from '@/features/practice/components/active-practice-page'
import { practiceService } from '@/services/practice.service'
import { questionRepository } from '@/db/repositories/question.repository'

interface PageProps {
  searchParams: Promise<{ sessionId?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionId = params.sessionId

  // If sessionId is provided, this page will become a client-side component
  // that will fetch the session data and questions
  // For now, fall back to the default behavior
  const questions = await (sessionId
    ? questionRepository.getPracticeSession() // Can't fetch session data in server component with async client fetch
    : practiceService.getPracticeSession())

  return <ActivePracticePage questions={questions} sessionId={sessionId} />
}
