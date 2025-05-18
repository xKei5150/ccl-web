'use client';

import FinancingPage from '@/components/pages/financing/FinancingPage';
import { ClientReportsButton } from '@/components/pages/financing/ClientReportsButton';

export default function FinancingPageWrapper({ data }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ClientReportsButton />
      </div>
      <FinancingPage data={data} />
    </div>
  );
} 