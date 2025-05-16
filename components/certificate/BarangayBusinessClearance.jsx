import React from 'react';
import { CertificateLayout } from './CertificateLayout';
import Image from 'next/image';

function BarangayBusinessClearance({ requestData = {}, settings = {} }) {
  const { business = {}, validity, officialReceiptNo, issuedTo, amount, paymentDate, createdAt } = requestData;
  
  console.log('Business data in certificate component:', business); // For debugging

  // Format dates
  const dateIssued = paymentDate 
    ? new Date(paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : (createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '_______________');
  
  const validUntil = validity
    ? new Date(validity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '_______________';
  
  // Get permit number (control number)
  const permitNo = requestData.id 
    ? `${settings?.general?.controlNumberPrefix?.businessClearance || 'BC'} No. ${new Date().getFullYear()}-${String(requestData.id).padStart(3, '0')}`
    : `${settings?.general?.controlNumberPrefix?.businessClearance || 'BC'} No. ${new Date().getFullYear()}-XXX`;
  
  // Extract business details - handle both direct access and relationship population
  // First check if business.businessName exists, then check for business.name (from populated relationship)
  // Also check if business is a populated object that might have a document property with the name
  const businessName = business?.businessName || 
                      business?.name || 
                      (business?.document?.businessName) || 
                      (business?.document?.name) || 
                      '___________________________';
  
  const businessAddress = business?.address || 
                         (business?.document?.address) ||
                         `BRGY. ${settings?.barangayDetails?.barangayName || 'MALABANBAN NORTE'}, ${settings?.barangayDetails?.municipality || 'CANDELARIA'}, ${settings?.barangayDetails?.province || 'QUEZON'}`;
  
  // Format payment details
  const formattedAmount = amount ? `₱${parseFloat(amount).toFixed(2)}` : '_______________';
  const formattedReceiptNo = officialReceiptNo || '_______________';
  
  // Get certificate text from settings
  const certificateTitle = settings?.certificateTypes?.businessClearance?.title || 'BARANGAY BUSINESS CLEARANCE';
  const conditionsText = settings?.certificateTypes?.businessClearance?.conditionsText || 
    'The issuance of this clearance is subject to the condition that the above enterprise has complied and shall continue to comply with all existing national and local government laws, rules and regulations, Barangay Ordinances pertaining to the operations of the business establishment and its operation shall not pose any environmental and social hazard to the public.';
  const revocationText = settings?.certificateTypes?.businessClearance?.revocationText || 
    'This clearance shall be deemed automatically revoked and considered null and void should above enterprise be found to have violated or failed to comply with the conditions.';
  const contactText = settings?.certificateTypes?.businessClearance?.contactText || 
    'For comply please notify: Conversion "Bobot" Lamoca/Punong Barangay';
  
  // Officials information for signature
  const captain = settings?.barangayOfficials?.captain || { name: 'CONVERSION M. LAMOCA', title: 'Punong Barangay' };
  const treasurer = settings?.barangayOfficials?.treasurer || { name: 'NORELYN D. SARAZA', title: 'Barangay Treasurer' };

  return (
    <CertificateLayout settings={settings}>
      <div className="text-sm print:text-[8pt] certificate-content">
        <h2 className="text-center font-bold text-xl print:text-[14pt] mb-4 print:mb-3 uppercase text-blue-800 print:text-blue-800">
          {certificateTitle}
        </h2>
        
        {/* Business Name Field */}
        <div className="mb-6 print:mb-4 border-b border-black pb-1">
          <div className="text-center text-[9pt] text-gray-600 print:text-[7pt]">Name of Business</div>
          <div className="text-center font-semibold">{businessName}</div>
        </div>
        
        {/* Main Certificate Details */}
        <div className="grid grid-cols-2 gap-4 print:gap-2 mb-6 print:mb-4">
          <div className="space-y-2 print:space-y-1">
            <div>
              <span className="font-semibold">Permit No.:</span> <span className="text-red-700">{permitNo}</span>
            </div>
            <div>
              <span className="font-semibold">Valid Until:</span> <span>{validUntil}</span>
            </div>
            <div>
              <span className="font-semibold">Official Receipt No.:</span> <span>{formattedReceiptNo}</span>
            </div>
          </div>
          
          <div className="space-y-2 print:space-y-1">
            <div>
              <span className="font-semibold">Issued to:</span> <span>{issuedTo || businessName}</span>
            </div>
            <div>
              <span className="font-semibold">Address:</span> <span>{businessAddress}</span>
            </div>
            <div>
              <span className="font-semibold">Date:</span> <span>{dateIssued}</span>
            </div>
            <div>
              <span className="font-semibold">Amount:</span> <span>{formattedAmount}</span>
            </div>
          </div>
        </div>
        
        {/* Administration and Prepared By Section */}
        <div className="grid grid-cols-2 gap-4 print:gap-2 mb-6 print:mb-4">
          <div>
            <p className="text-blue-800 font-semibold mb-1 print:mb-0 uppercase text-[9pt] print:text-[8pt]">
              UNDER THE ADMINISTRATION OF:
            </p>
            <div className="mt-10 print:mt-8 text-center w-56 print:w-48 relative">
              {/* Captain's signature (if available) */}
              {settings?.images?.captainSignature?.url && (
                <div className="absolute -top-10 print:-top-6 left-0 right-0 h-10 print:h-6 flex items-center justify-center">
                  <Image 
                    src={settings.images.captainSignature.url}
                    alt="Captain's Signature"
                    width={100}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
              <p className="font-bold uppercase border-t border-black pt-1">{captain.name}</p>
              <p className="text-xs print:text-[7pt]">{captain.title}</p>
            </div>
          </div>
          
          <div>
            <p className="text-blue-800 font-semibold mb-1 print:mb-0 uppercase text-[9pt] print:text-[8pt]">
              Prepared By:
            </p>
            <div className="mt-10 print:mt-8 text-center w-56 print:w-48 relative">
              <p className="font-bold uppercase border-t border-black pt-1">{treasurer.name}</p>
              <p className="text-xs print:text-[7pt]">{treasurer.title}</p>
            </div>
          </div>
        </div>
        
        {/* Conditions Text Section */}
        <div className="mt-2 space-y-2 print:space-y-1 text-[9pt] print:text-[7pt] text-justify">
          <p>{conditionsText}</p>
          <p>{revocationText}</p>
          <p className="text-red-700">{contactText}</p>
        </div>
        
        {/* Tagline */}
        <div className="mt-3 print:mt-2 text-center text-blue-800 font-semibold text-[9pt] print:text-[7pt]">
          "{settings?.barangayDetails?.tagline || 'MADALING LAPITAN, MAAASAHAN SA ORAS NG PANGANGAILANGAN'}"
        </div>
      </div>
    </CertificateLayout>
  );
}

export { BarangayBusinessClearance }; 