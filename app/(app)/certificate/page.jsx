import React from 'react';

const BarangayCertificate = () => {
  return (
    <div className="max-w-[800px] mx-auto p-8 bg-white">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
          <div className="text-center text-xs">Logo</div>
        </div>
        <div className="text-center flex-1 px-4">
          <div className="text-sm">Republic of the Philippines</div>
          <div className="text-sm">Province of Quezon</div>
          <div className="text-sm">Municipality of Candelaria</div>
          <div className="font-bold">BARANGAY MALABANBAN NORTE</div>
        </div>
        <div className="w-24 h-16">
          <div className="h-full bg-blue-100 flex items-center justify-center">
            <div className="text-center text-xs">Flag</div>
          </div>
        </div>
      </div>

      {/* Officials Section */}
      <div className="flex gap-8">
        <div className="w-1/3 bg-gray-50 p-4 rounded">
          <div className="font-bold text-center mb-4">CONVERSION M. LAMOCA</div>
          <div className="text-sm text-center mb-2">Barangay Captain</div>
          
          <div className="text-sm mt-4">COUNCILORS:</div>
          <div className="text-xs space-y-2">
            <div>TERESITA D. ALCANTARA</div>
            <div className="text-xs italic">Chairman Law & Ordinances</div>
            <div>MALVIN M. SALAS</div>
            <div className="text-xs italic">Chairman Budget & Appropriation</div>
            {/* Add more councilors as needed */}
          </div>
        </div>

        {/* Main Form Section */}
        <div className="flex-1">
          <h2 className="text-center font-bold underline mb-6">BARANGAY RESIDENCY</h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="w-24">NAME:</div>
              <div className="flex-1 border-b border-black"></div>
            </div>
            
            <div className="flex gap-2">
              <div>Address:</div>
              <div className="flex-1">Malabanban Norte Candelaria, Quezon</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <div>Marital Status:</div>
                <div className="flex-1 border-b border-black"></div>
              </div>
              <div className="flex gap-2">
                <div>Birthdate:</div>
                <div className="flex-1 border-b border-black"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex gap-2">
                <div>Sex:</div>
                <div className="flex-1 border-b border-black"></div>
              </div>
              <div className="flex gap-2">
                <div>Age:</div>
                <div className="flex-1 border-b border-black"></div>
              </div>
              <div className="flex gap-2">
                <div>Citizenship:</div>
                <div className="flex-1 border-b border-black"></div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4">To Whom It May Concern,</p>
              <p className="text-justify">
                This is to certify that as per record the person signature appearing here is a bonafide resident of this
                barangay for ________ with the following detail/s;
              </p>
            </div>

            <div className="mt-8">
              <p className="text-justify">
                This certification is issued upon the request of the interested party for reference and whatever legal
                purpose it may serve.
              </p>
            </div>

            <div className="mt-16 flex justify-between">
              <div className="flex-1"></div>
              <div className="w-64 text-center">
                <div className="border-t border-black pt-2">
                  Signature Over Printed Name of Client
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-right font-bold">
                CONVERSION M. LAMOCA
                <div className="text-sm font-normal">Punong Barangay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs">
        <div>OFFICE OF THE BARANGAY CHAIRPERSON</div>
        <div>Tibanglan Road Malabanban Norte, Candelaria, Quezon</div>
        <div>Telephone Number: (042) 585-5423</div>
      </div>
    </div>
  );
};

export default BarangayCertificate;