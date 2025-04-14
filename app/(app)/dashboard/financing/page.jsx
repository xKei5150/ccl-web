import { getFinancingData } from './actions'
import FinancingPage from '@/components/pages/financing/FinancingPage'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

export const metadata = {
  title: "Financing Records | CCL",
  description: "View and manage financing records",
};

export default async function FinancingListPage() {
  const records = await getFinancingData()
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/dashboard/financing/reports">
          <Button variant="outline" className="ml-2">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports & Analytics
          </Button>
        </Link>
      </div>
      <FinancingPage data={records} />
    </div>
  )
} 