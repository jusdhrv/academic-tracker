import { ActivePracticePage } from '@/features/practice/components/active-practice-page'
import { practiceService } from '@/services/practice.service'

export default async function Page() {
  const questions = await practiceService.getPracticeSession()
  return <ActivePracticePage questions={questions} />
}
