import React from 'react';
import { CertificateLayout } from './CertificateLayout';
import Image from 'next/image';

function BarangayClearanceCertificate({ requestData = {}, settings = {} }) {
  const { person = {}, purpose, additionalInformation = {}, createdAt, certificateDetails = {} } = requestData;
  const { name = {}, contact = {}, demographics = {} } = person;
  const { ctcDetails = {}, payment = {}, approver = {} } = certificateDetails;

  // Get citizenship from settings or fallback
  const defaultCitizenship = settings?.general?.defaultCitizenship || 'Filipino';
  
  // Get data from certificateDetails if available, otherwise use placeholder
  const controlNumber = certificateDetails.controlNumber || `${settings?.general?.controlNumberPrefix?.clearance || 'BC'}-2024-XXXX`;
  const age = demographics.age || calculateAge(demographics.birthDate) || '__';
  const citizenship = person.citizenship || defaultCitizenship;
  
  // Format dates
  const dateIssued = certificateDetails.dateIssued 
    ? new Date(certificateDetails.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : (createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '_______________');
  
  // Validity period
  const validityPeriod = settings?.certificateTypes?.clearance?.defaultValidity || 'Six (6) Months';
  const validUntil = certificateDetails.validUntil 
    ? new Date(certificateDetails.validUntil).toLocaleDateString()
    : (createdAt ? new Date(new Date(createdAt).setMonth(new Date(createdAt).getMonth() + 6)).toLocaleDateString() : '_______________');
  
  // Additional clearance fields
  const remarks = additionalInformation.remarks || 'None';
  
  // Payment details
  const orNumber = payment?.orNumber || 'Pending';
  const paymentAmount = payment?.amount || 'PHP 50.00';
  
  // CTC Details
  const formattedCtcDetails = {
    dateIssued: ctcDetails.ctcDateIssued ? new Date(ctcDetails.ctcDateIssued).toLocaleDateString() : 'Not Provided',
    ctcNo: ctcDetails.ctcNo || 'Not Provided',
    amount: ctcDetails.ctcAmount || 'Not Provided',
    placeIssued: ctcDetails.ctcPlaceIssued || 'Not Provided',
  };

  const applicantName = name.fullName || '___________________________';
  const barangayName = settings?.barangayDetails?.barangayName || 'Malabanban Norte';
  const municipality = settings?.barangayDetails?.municipality || 'Candelaria';
  const province = settings?.barangayDetails?.province || 'Quezon';
  const applicantAddress = contact.localAddress ? `${contact.localAddress}, ${barangayName} ${municipality}, ${province}` : `${barangayName} ${municipality}, ${province}`;
  
  // Get certificate text from settings
  const certificateTitle = settings?.certificateTypes?.clearance?.title || 'BARANGAY CLEARANCE';
  const bodyText = settings?.certificateTypes?.clearance?.bodyText || 'This is to certify that as per record, the person whose name, photo, and signature appearing herein has requested a CLEARANCE from this office with the following detail/s;';
  const purposeText = settings?.certificateTypes?.clearance?.purposeText || 'This certification is issued upon the request of the above subject for the purpose stated.';
  const signatureLabel = settings?.general?.signatureLabel || 'Signature Over Printed Name of Client';
  const thumbMarkLabel = settings?.certificateTypes?.clearance?.thumbMarkLabel || 'Applicant\'s Right\nThumb Mark';
  
  // Officials information for attestation
  const captain = settings?.barangayOfficials?.captain || { name: 'CONVERSION M. LAMOCA', title: 'Punong Barangay' };

  return (
    <CertificateLayout settings={settings}>
      <div className="text-sm print:text-[10pt] relative">
        {/* Official Seal Watermark - only shown if available in settings */}
        {settings?.images?.officialSeal?.url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print:opacity-5">
            <div className="relative w-[60%] h-[60%]">
              <Image
                src={settings.images.officialSeal.url}
                alt="Official Seal"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        )}
        
        <h2 className="text-center font-bold underline text-lg print:text-[14pt] mb-6 uppercase">
          {certificateTitle}
        </h2>

        <div className="space-y-3 print:space-y-2 mb-6 text-left">
          <div className="grid grid-cols-[2fr,1fr] gap-4">
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 print:w-28 font-medium">NAME:</span>
                <span className="flex-1 border-b border-black px-2">{applicantName}</span>
              </div>
              <div className="flex">
                <span className="w-32 print:w-28 font-medium">ADDRESS:</span>
                <span className="flex-1 px-2">{applicantAddress}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 print:gap-x-2">
                <div className="flex">
                  <span className="w-32 print:w-28 font-medium">MARITAL STATUS:</span>
                  <span className="flex-1 border-b border-black px-2">{demographics.maritalStatus || '_______________'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 print:w-20 font-medium">BIRTHDATE:</span>
                  <span className="flex-1 border-b border-black px-2">{demographics.birthDate ? new Date(demographics.birthDate).toLocaleDateString() : '_______________'}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-x-4 print:gap-x-2">
                <div className="flex">
                  <span className="w-16 print:w-12 font-medium">SEX:</span>
                  <span className="flex-1 border-b border-black px-2">{demographics.sex || '________'}</span>
                </div>
                <div className="flex">
                  <span className="w-16 print:w-12 font-medium">AGE:</span>
                  <span className="flex-1 border-b border-black px-2">{age}</span>
                </div>
                <div className="flex">
                  <span className="w-24 print:w-20 font-medium">CITIZENSHIP:</span>
                  <span className="flex-1 border-b border-black px-2">{citizenship}</span>
                </div>
              </div>
            </div>
            {/* Photo placeholder */}
            <div className="flex flex-col items-center">
              <div className="border-2 border-black h-32 w-28 flex items-center justify-center print:border-black bg-white">
                {person.photo ? (
                  <Image
                    src={person.photo.url}
                    alt="Applicant Photo"
                    width={100}
                    height={120}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-center text-xs px-1">2×2 ID Photo</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 print:gap-x-2 pt-2">
            <div className="flex">
              <span className="w-32 print:w-28 font-medium">CONTROL NO:</span>
              <span className="font-semibold px-2">{controlNumber}</span>
            </div>
            <div className="flex">
              <span className="w-32 print:w-28 font-medium">OR NUMBER:</span>
              <span className="font-semibold px-2">{orNumber}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 print:gap-x-2">
            <div className="flex">
              <span className="w-32 print:w-28 font-medium">AMOUNT:</span>
              <span className="font-semibold px-2">{paymentAmount}</span>
            </div>
            <div className="flex">
              <span className="w-32 print:w-28 font-medium">VALID UNTIL:</span>
              <span className="font-semibold px-2">{validUntil}</span>
            </div>
          </div>
          <div className="flex">
            <span className="w-32 print:w-28 font-medium">PURPOSE:</span>
            <span className="flex-1 border-b border-black px-2">{purpose || '___________________________'}</span>
          </div>
          <div className="flex">
            <span className="w-32 print:w-28 font-medium">REMARKS:</span>
            <span className="flex-1 border-b border-black px-2">{remarks}</span>
          </div>
        </div>

        <div className="mb-8 print:mb-6 text-justify indent-8 print:text-[10pt]">
          <p className="font-bold mb-4 print:mb-2">TO WHOM IT MAY CONCERN:</p>
          <p className="leading-relaxed print:leading-normal">
            {bodyText}
          </p>
        </div>

        <div className="mb-10 print:mb-8 text-justify indent-8 print:text-[10pt]">
          <p className="leading-relaxed print:leading-normal">
            {purposeText}
          </p>
        </div>
        
        <p className="mb-10 print:mb-8 print:text-[10pt]">
          Issued this <span className="font-semibold underline px-2">{dateIssued.split(' ')[1].replace(',','')}</span> day of <span className="font-semibold underline px-2">{dateIssued.split(' ')[0]}</span>, <span className="font-semibold underline px-2">{dateIssued.split(' ')[2]}</span> at Barangay {barangayName}, {municipality}, {province}.
        </p>

        <div className="flex justify-between mt-16 print:mt-12 mb-4">
          <div className="w-32 h-24 border border-black flex items-center justify-center bg-white">
            <p className="text-center text-xs whitespace-pre-line px-1">{thumbMarkLabel}</p>
          </div>
          
          <div className="w-64 print:w-56 text-center">
            <div className="border-t border-black pt-1">
              {signatureLabel}
            </div>
          </div>
        </div>

        <div className="mt-6 print:mt-4 text-right">
          <div className="mt-8 print:mt-6 inline-block w-64 print:w-56 text-center relative">
            {/* Captain's signature (if available) */}
            {settings?.images?.captainSignature?.url && (
              <div className="absolute -top-16 left-0 right-0 h-16 flex items-center justify-center">
                <Image 
                  src={settings.images.captainSignature.url}
                  alt="Captain's Signature"
                  width={150}
                  height={60}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <p className="font-bold uppercase border-t border-black pt-1">{captain.name}</p>
            <p className="text-xs print:text-[8pt]">{captain.title}</p>
          </div>
        </div>

        <div className="mt-8 print:mt-6 border-t border-dashed pt-3 print:pt-2 text-xs print:text-[8pt]">
          <p className="font-semibold mb-1">CTC Details:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 print:gap-x-2">
            <div><span className="font-medium">CTC No.:</span> {formattedCtcDetails.ctcNo}</div>
            <div><span className="font-medium">Issued at:</span> {formattedCtcDetails.placeIssued}</div>
            <div><span className="font-medium">Date Issued:</span> {formattedCtcDetails.dateIssued}</div>
            <div><span className="font-medium">Amount Paid:</span> {formattedCtcDetails.amount}</div>
          </div>
          <div className="mt-2">
            <p className="text-[7pt]">This document is not valid without official signature and seal. Valid for {validityPeriod}.</p>
          </div>
        </div>
      </div>
    </CertificateLayout>
  );
}

// Helper function to calculate age
function calculateAge(birthdate) {
  if (!birthdate) return null;
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export { BarangayClearanceCertificate }; 