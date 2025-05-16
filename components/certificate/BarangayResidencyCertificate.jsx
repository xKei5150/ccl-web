import React from 'react';
import { CertificateLayout } from './CertificateLayout';
import Image from 'next/image';

function BarangayResidencyCertificate({ requestData = {}, settings = {} }) {
  const { person = {}, purpose, additionalInformation = {}, createdAt, certificateDetails = {} } = requestData;
  const { name = {}, contact = {}, demographics = {} } = person;
  const { ctcDetails = {}, payment = {}, approver = {} } = certificateDetails;

  // Get citizenship from settings or fallback
  const defaultCitizenship = settings?.general?.defaultCitizenship || 'Filipino';
  
  // Get data from certificateDetails if available, otherwise use placeholder
  const controlNumber = certificateDetails.controlNumber || `${settings?.general?.controlNumberPrefix?.residency || 'BRGY-RES'}-2024-XXXX`;
  const age = demographics.age || calculateAge(demographics.birthDate) || '__';
  const citizenship = person.citizenship || defaultCitizenship;
  
  // Format dates
  const dateIssued = certificateDetails.dateIssued 
    ? new Date(certificateDetails.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : (createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '_______________');
  
  const duration = additionalInformation.duration || '_____________';

  // Payment details
  const orNumber = payment?.orNumber || 'Not Provided';
  const paymentAmount = payment?.amount || 'Not Provided';
  
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
  const certificateTitle = settings?.certificateTypes?.residency?.title || 'BARANGAY RESIDENCY';
  const bodyText = settings?.certificateTypes?.residency?.bodyText || 'This is to certify that as per record the person signature appearing here is a bonafide resident of this barangay for _____ with the following detail/s;';
  const purposeText = settings?.certificateTypes?.residency?.purposeText || 'This certification is issued upon the request of the interested party for reference and whatever legal purpose it may serve.';
  const signatureLabel = settings?.general?.signatureLabel || 'Signature Over Printed Name of Client';
  
  // Officials information for attestation
  const captain = settings?.barangayOfficials?.captain || { name: 'CONVERSION M. LAMOCA', title: 'Punong Barangay' };

  return (
    <CertificateLayout settings={settings}>
      <div className="text-sm print:text-[8pt]">
        <h2 className="text-center font-bold underline text-lg print:text-[12pt] mb-4 print:mb-3 uppercase">
          {certificateTitle}
        </h2>

        <div className="space-y-2 print:space-y-1 mb-4 print:mb-3 text-left">
          <div className="flex">
            <span className="w-28 print:w-24 font-medium">NAME:</span>
            <span className="flex-1 border-b border-black px-2">{applicantName}</span>
          </div>
          <div className="flex">
            <span className="w-28 print:w-24 font-medium">ADDRESS:</span>
            <span className="flex-1 px-2">{applicantAddress}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 print:gap-x-1">
            <div className="flex">
              <span className="w-28 print:w-24 font-medium">MARITAL STATUS:</span>
              <span className="flex-1 border-b border-black px-2">{demographics.maritalStatus || '_______________'}</span>
            </div>
            <div className="flex">
              <span className="w-20 print:w-16 font-medium">BIRTHDATE:</span>
              <span className="flex-1 border-b border-black px-2">{demographics.birthDate ? new Date(demographics.birthDate).toLocaleDateString() : '_______________'}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-2 print:gap-x-1">
            <div className="flex">
              <span className="w-12 print:w-10 font-medium">SEX:</span>
              <span className="flex-1 border-b border-black px-2">{demographics.sex || '________'}</span>
            </div>
            <div className="flex">
              <span className="w-12 print:w-10 font-medium">AGE:</span>
              <span className="flex-1 border-b border-black px-2">{age}</span>
            </div>
            <div className="flex">
              <span className="w-20 print:w-18 font-medium">CITIZENSHIP:</span>
              <span className="flex-1 border-b border-black px-2">{citizenship}</span>
            </div>
          </div>
          <div className="flex pt-1">
            <span className="w-28 print:w-24 font-medium">CONTROL NO:</span>
            <span className="font-semibold px-2">{controlNumber}</span>
          </div>
          <div className="flex">
            <span className="w-28 print:w-24 font-medium">PURPOSE:</span>
            <span className="flex-1 border-b border-black px-2">{purpose || '___________________________'}</span>
          </div>
        </div>

        <div className="mb-4 print:mb-3 text-justify indent-8 print:text-[8pt]">
          <p className="font-bold mb-2 print:mb-1">TO WHOM IT MAY CONCERN:</p>
          <p className="leading-tight print:leading-tight">
            {bodyText.replace('_____', duration)}
          </p>
        </div>

        <div className="mb-4 print:mb-3 text-justify indent-8 print:text-[8pt]">
          <p className="leading-tight print:leading-tight">
            {purposeText}
          </p>
        </div>
        
        <p className="mb-6 print:mb-4 print:text-[8pt]">
            Issued this <span className="font-semibold underline px-2">{dateIssued.split(' ')[1].replace(',','')}</span> day of <span className="font-semibold underline px-2">{dateIssued.split(' ')[0]}</span>, <span className="font-semibold underline px-2">{dateIssued.split(' ')[2]}</span> at Barangay {barangayName}, {municipality}, {province}.
        </p>

        <div className="flex justify-end mt-10 print:mt-6">
          <div className="w-56 print:w-48 text-center">
            <div className="border-t border-black pt-1">
              {signatureLabel}
            </div>
          </div>
        </div>

        <div className="mt-8 print:mt-4">
          <p className="font-medium">Attested By:</p>
          <div className="mt-6 print:mt-3 w-56 print:w-48 text-center relative">
            {/* Captain's signature (if available) */}
            {settings?.images?.captainSignature?.url && (
              <div className="absolute -top-12 print:-top-8 left-0 right-0 h-12 print:h-8 flex items-center justify-center">
                <Image 
                  src={settings.images.captainSignature.url}
                  alt="Captain's Signature"
                  width={120}
                  height={48}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <p className="font-bold uppercase border-t border-black pt-1">{captain.name}</p>
            <p className="text-xs print:text-[7pt]">{captain.title}</p>
          </div>
        </div>

        {/* CTC Details Section */}
        <div className="mt-6 print:mt-3 border-t border-dashed pt-2 print:pt-1 text-xs print:text-[7pt]">
          <p className="font-semibold mb-0">CTC Details:</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0 print:gap-x-1">
            <div><span className="font-medium">CTC No.:</span> {formattedCtcDetails.ctcNo}</div>
            <div><span className="font-medium">Issued at:</span> {formattedCtcDetails.placeIssued}</div>
            <div><span className="font-medium">Date Issued:</span> {formattedCtcDetails.dateIssued}</div>
            <div><span className="font-medium">Amount Paid:</span> {formattedCtcDetails.amount}</div>
          </div>
          <div className="mt-1 print:mt-0">
            <div><span className="font-medium">OR Number:</span> {orNumber}</div>
            <div><span className="font-medium">Amount:</span> {paymentAmount}</div>
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

export { BarangayResidencyCertificate }; 