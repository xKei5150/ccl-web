import { getFinancingData } from './actions'
import FinancingPage from '@/components/pages/financing/FinancingPage'

export const metadata = {
  title: "Financing Records | CCL",
  description: "View and manage financing records",
};

import FinancingPageWrapper from '@/components/pages/financing/FinancingPageWrapper'

export default async function FinancingListPage() {
  const records = await getFinancingData()
  
  return <FinancingPageWrapper data={records} />
} 