import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getRequest } from '../../dashboard/general-requests/actions';
import { getBusinessPermit } from '../../dashboard/business-permits/actions';
import { getCertificateSettings } from '../../dashboard/certificate-settings/actions';
import { BarangayResidencyCertificate } from '@/components/certificate/BarangayResidencyCertificate';
import { BarangayIndigencyCertificate } from '@/components/certificate/BarangayIndigencyCertificate';
import { BarangayClearanceCertificate } from '@/components/certificate/BarangayClearanceCertificate';
import { BarangayBusinessClearance } from '@/components/certificate/BarangayBusinessClearance';
import { PrintButton } from '@/components/certificate/PrintButton';
import LoadingSkeleton from '@/components/layout/LoadingSkeleton';

// Helper function to calculate age
function calculateAge(birthDateString) {
  if (!birthDateString) return '__';
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : '__';
}

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  const search = await searchParams;
  const type = search?.type || 'request';

  let documentData;
  if (type === 'business') {
    const result = await getBusinessPermit(id);
    if (!result || !result.success || !result.data) {
      return { title: 'Certificate Not Found' };
    }
    documentData = { type: 'businessPermit', ...result.data };
  } else {
    const result = await getRequest(id);
    if (!result || !result.success || !result.data) {
      return { title: 'Certificate Not Found' };
    }
    documentData = result.data;
  }

  let certificateType = 'Certificate';
  switch (documentData.type) {
    case 'barangayResidency':
      certificateType = 'Barangay Residency';
      break;
    case 'indigencyCertificate':
      certificateType = 'Barangay Indigency';
      break;
    case 'barangayClearance':
      certificateType = 'Barangay Clearance';
      break;
    case 'businessPermit':
      certificateType = 'Barangay Business Clearance';
      break;
    default:
      certificateType = 'Barangay Certificate';
  }

  return {
    title: `${certificateType} | CCL Malabanban Norte`,
    description: `View and print ${certificateType.toLowerCase()} for ${type === 'business' ? 'business permit' : 'request'} ${id}`,
  };
}

export default async function CertificatePage({ params, searchParams }) {
  const { id } = await params;
  const search = await searchParams;
  const type = search?.type || 'request';
  const certificateSettings = await getCertificateSettings();
  
  let requestData;
  
  try {
    if (type === 'business') {
      // Handle business permit
      const businessPermitResult = await getBusinessPermit(id);
      
      if (!businessPermitResult || !businessPermitResult.success || !businessPermitResult.data) {
        console.log('Business permit not found or API error. Result:', businessPermitResult);
        notFound();
      }
      
      const businessPermitData = businessPermitResult.data;
      console.log('Business permit data:', businessPermitData);
      
      // Handle business data, which may be populated (object) or just an ID reference
      // If it's an object with a businessName, use that directly
      // If it's an object with a name property (populated relationship), use that
      // Otherwise, leave as is and let the component handle it
      const businessData = businessPermitData.business;
      
      // Format business permit data to match certificate expectations
      requestData = {
        ...businessPermitData,
        type: 'businessPermit',
        id: businessPermitData.id,
        // If business is an object and includes direct data, pass it as is
        // If business is a string ID or an object without businessName/name, pass it as is
        business: businessData,
        validity: businessPermitData.validity,
        officialReceiptNo: businessPermitData.officialReceiptNo,
        issuedTo: businessPermitData.issuedTo,
        amount: businessPermitData.amount,
        paymentDate: businessPermitData.paymentDate,
        createdAt: businessPermitData.createdAt,
      };
      
    } else {
      // Handle general request (default)
      const requestResult = await getRequest(id);
      
      if (!requestResult || !requestResult.success || !requestResult.data) {
        console.log('Request not found or API error. API Result:', requestResult);
        notFound();
      }
      
      requestData = requestResult.data;
      
      // Calculate age if birthDate is available in person object for request-based certificates
      if (requestData.person?.demographics?.birthDate) {
        requestData.age = calculateAge(requestData.person.demographics.birthDate);
      }
    }
  } catch (error) {
    console.error('Error fetching certificate data:', error);
    notFound();
  }

  // Determine which certificate component to use
  let CertificateComponent;
  switch (requestData.type) {
    case 'barangayResidency':
      CertificateComponent = BarangayResidencyCertificate;
      break;
    case 'indigencyCertificate':
      CertificateComponent = BarangayIndigencyCertificate;
      break;
    case 'barangayClearance':
      CertificateComponent = BarangayClearanceCertificate;
      break;
    case 'businessPermit':
      CertificateComponent = BarangayBusinessClearance;
      break;
    default:
      console.error(`Unknown certificate type: ${requestData.type} for ID: ${id}`);
      notFound();
      return null;
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="relative">
        <CertificateComponent 
          requestData={requestData} 
          settings={certificateSettings}
        />
        <PrintButton />
      </div>
    </Suspense>
  );
} 