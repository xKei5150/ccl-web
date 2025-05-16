import React from 'react';
import Image from 'next/image';

function CertificateLayout({ children, settings }) {
  // Use the settings object passed from the server component
  const {
    images = {},
    barangayDetails = {},
    barangayOfficials = {},
  } = settings || {};

  // Get background image opacity
  const backgroundOpacity = images?.backgroundOpacity || '10';
  const opacityValue = parseInt(backgroundOpacity) / 100;

  // Extract officials
  const captain = barangayOfficials?.captain || { name: 'CONVERSION M. LAMOCA', title: 'Punong Barangay' };
  const councilors = barangayOfficials?.councilors || [
    { name: 'TERESITA D. ALCANTARA', chairmanship: 'Chairman Law & Ordinances, KALAPI President' },
    { name: 'MALVIN M. SALAS', chairmanship: 'Chairman Budget & Appropriation' },
    { name: 'MELANIE P. CANIMO', chairmanship: 'Chairman Education & Health' },
    { name: 'ALFREDO I. DELA CRUZ', chairmanship: 'Chairman Infrastructure' },
    { name: 'PEDRO L. DELA CRUZ', chairmanship: 'Chairman Peace & Order' },
    { name: 'ELENITA P. LANDICHO', chairmanship: 'Chairman Sectoral Programs' },
    { name: 'MANUEL C. ALMIAR', chairmanship: 'Chairman Agriculture' },
  ];
  const skChairman = barangayOfficials?.skChairman || { name: 'GERALDINE L. BELEN', title: 'SK Chairman' };
  const secretary = barangayOfficials?.secretary || { name: 'HAZEL GRACE M. AGUDA', title: 'Barangay Secretary' };
  const treasurer = barangayOfficials?.treasurer || { name: 'NORELYN D. SARAZA', title: 'Barangay Treasurer' };

  return (
    <div className="bg-gray-100 p-2 md:p-4 print:p-0 print:bg-white">
      <div className="certificate-container max-w-[8.5in] mx-auto bg-white shadow-lg p-4 md:p-6 print:shadow-none print:p-2 relative print:max-h-[10.5in] print:overflow-hidden">
        {/* Background Image */}
        {images?.backgroundImage?.url && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <Image
              src={images.backgroundImage.url}
              alt="Certificate Background"
              fill
              style={{ objectFit: 'cover', opacity: opacityValue }}
              priority
            />
          </div>
        )}

        {/* Header Section */}
        <header className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black relative z-10 print:mb-2 print:pb-1">
          <div className="w-16 h-16 relative print:w-14 print:h-14">
            {images?.barangayLogo?.url ? (
              <Image 
                src={images.barangayLogo.url} 
                alt="Barangay Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-700 text-xs text-gray-500 print:border-black">
                Brgy Logo
              </div>
            )}
          </div>
          <div className="text-center flex-1 px-2 print:px-1">
            <p className="text-xs print:text-[8pt]">{barangayDetails.headerText || 'Republic of the Philippines'}</p>
            <p className="text-xs print:text-[8pt]">Province of {barangayDetails.province || 'Quezon'}</p>
            <p className="text-xs print:text-[8pt]">Municipality of {barangayDetails.municipality || 'Candelaria'}</p>
            <p className="font-bold text-sm print:text-[10pt]">BARANGAY {barangayDetails.barangayName || 'MALABANBAN NORTE'}</p>
          </div>
          <div className="w-14 h-14 relative print:w-12 print:h-12">
            {images?.philippineSeal?.url ? (
              <Image 
                src={images.philippineSeal.url} 
                alt="Philippine Seal" 
                fill 
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center border border-gray-500 text-xs text-gray-500 print:border-black">
                PH Seal
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area - Reduced spacing */}
        <main className="flex flex-col md:flex-row gap-3 print:gap-2 relative z-10">
          {/* Officials Sidebar - Reduced font sizes and spacing */}
          <aside className="w-full md:w-1/3 bg-yellow-50/30 p-2 border border-yellow-400/50 print:w-[2in] print:p-1 print:border-black print:bg-transparent print:text-[7pt]">
            <div className="text-center mb-3">
              <p className="font-bold text-xs print:text-[8pt]">{captain.name}</p>
              <p className="text-xs italic print:text-[6pt]">{captain.title}</p>
            </div>

            <p className="font-semibold text-center text-xs uppercase mb-0.5 print:text-[7pt]">Councilors</p>
            <ul className="space-y-5 text-xs print:text-[6pt] text-center">
              {councilors.map((councilor, index) => (
                <li key={index || councilor.name}>
                  <p className="font-medium leading-tight">{councilor.name}</p>
                  <p className="text-[10px] italic leading-tight print:text-[5pt]">{councilor.chairmanship}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-0.5 border-t border-yellow-400/50 print:border-black text-center">
              <p className="font-medium text-xs print:text-[6pt]">{skChairman.name}</p>
              <p className="text-[10px] italic print:text-[5pt]">{skChairman.title}</p>
            </div>
            <div className="mt-5 text-center">
              <p className="font-medium text-xs print:text-[6pt]">{secretary.name}</p>
              <p className="text-[10px] italic print:text-[5pt]">{secretary.title}</p>
            </div>
            <div className="mt-5 text-center">
              <p className="font-medium text-xs print:text-[6pt]">{treasurer.name}</p>
              <p className="text-[10px] italic print:text-[5pt]">{treasurer.title}</p>
            </div>
          </aside>

          {/* Certificate Content */}
          <section className="flex-1">
            {children}
          </section>
        </main>

        {/* Footer Section - Reduced spacing */}
        <footer className="mt-3 pt-1 border-t text-center print:mt-2 print:pt-0.5 relative z-10">
          <p className="text-xs font-medium print:text-[6pt]">OFFICE OF THE BARANGAY CHAIRPERSON</p>
          <p className="text-xs print:text-[6pt]">{barangayDetails.barangayAddress || 'Tibanglan Road Malabanban Norte, Candelaria, Quezon'}</p>
          <p className="text-xs print:text-[6pt]">Telephone Number: {barangayDetails.contactNumber || '(042) 585-5423'}</p>
          <p className="text-xs font-semibold mt-0.5 text-blue-600 print:text-[7pt] print:text-black print:mt-0">
            "{barangayDetails.tagline || 'Madaling lapitan, maaasahan sa oras ng pangangailangan'}"
          </p>
        </footer>
      </div>
    </div>
  );
}

export { CertificateLayout }; 