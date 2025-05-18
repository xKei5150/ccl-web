'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function ClientReportsButton() {
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;
  
  if (!hasAdminAccess) {
    return null;
  }
  
  return (
    <Link href="/dashboard/finance">
      <Button variant="outline" className="ml-2">
        <BarChart3 className="mr-2 h-4 w-4" />
        Reports & Analytics
      </Button>
    </Link>
  );
} 