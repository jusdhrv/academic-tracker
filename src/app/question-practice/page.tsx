import { PracticeSetupPage } from '@/features/practice/components/practice-setup-page'
import { practiceService } from '@/services/practice.service'

export default async function Page() {
  const filterOptions = await practiceService.getFilterOptions()
  return <PracticeSetupPage {...filterOptions} />
}
