import React, { Suspense } from 'react';
import CertificateSettingsPage from '@/components/pages/certificate-settings/CertificateSettingsPage';
import LoadingSkeleton from '@/components/layout/LoadingSkeleton';
import { getCertificateSettings } from './actions';

export const metadata = {
  title: 'Certificate Settings | CCL',
  description: 'Configure certificate templates and content',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CertificateSettingsRoute() {
  const settings = await getCertificateSettings();
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CertificateSettingsPage initialSettings={settings} />
    </Suspense>
  );
} 