# Certificate Customization Plan

This plan outlines the implementation strategy for making the certificate feature fully customizable by authorized users. The goal is to allow admin/staff users to update certificate assets, official names, text content, and other configuration without requiring code changes.

## 1. PayloadCMS Configuration

### 1.1 Create `CertificateSettings` Global

Create a new global configuration in PayloadCMS (similar to `SiteSettings`) to store certificate-related configuration:

```javascript
// globals/CertificateSettings.ts
import type { GlobalConfig } from 'payload';

const CertificateSettings: GlobalConfig = {
  slug: 'certificate-settings',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    // Images and Assets
    {
      name: 'images',
      type: 'group',
      label: 'Certificate Images',
      fields: [
        {
          name: 'barangayLogo',
          type: 'upload',
          relationTo: 'media',
          label: 'Barangay Logo',
        },
        {
          name: 'philippineSeal',
          type: 'upload',
          relationTo: 'media',
          label: 'Philippine Seal/Flag',
        },
        {
          name: 'officialSeal',
          type: 'upload',
          relationTo: 'media',
          label: 'Official Seal (for clearance)',
        },
      ],
    },
    
    // Barangay Details
    {
      name: 'barangayDetails',
      type: 'group',
      label: 'Barangay Information',
      fields: [
        {
          name: 'headerText',
          type: 'text',
          label: 'Header Text',
          defaultValue: 'Republic of the Philippines',
        },
        {
          name: 'province',
          type: 'text',
          label: 'Province',
          defaultValue: 'Quezon',
        },
        {
          name: 'municipality',
          type: 'text',
          label: 'Municipality',
          defaultValue: 'Candelaria',
        },
        {
          name: 'barangayName',
          type: 'text',
          label: 'Barangay Name',
          defaultValue: 'MALABANBAN NORTE',
        },
        {
          name: 'barangayAddress',
          type: 'text',
          label: 'Barangay Address',
          defaultValue: 'Tibanglan Road Malabanban Norte, Candelaria, Quezon',
        },
        {
          name: 'contactNumber',
          type: 'text',
          label: 'Contact Number',
          defaultValue: '(042) 585-5423',
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Tagline',
          defaultValue: 'Madaling lapitan, maaasahan sa oras ng pangangailangan',
        },
      ],
    },
    
    // Barangay Officials
    {
      name: 'barangayOfficials',
      type: 'group',
      label: 'Barangay Officials',
      fields: [
        {
          name: 'captain',
          type: 'group',
          label: 'Barangay Captain',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              defaultValue: 'CONVERSION M. LAMOCA',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Punong Barangay',
            },
          ],
        },
        {
          name: 'councilors',
          type: 'array',
          label: 'Councilors',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              required: true,
            },
            {
              name: 'chairmanship',
              type: 'text',
              label: 'Chairmanship',
            },
          ],
          defaultValue: [
            { name: 'TERESITA D. ALCANTARA', chairmanship: 'Chairman Law & Ordinances, KALAPI President' },
            { name: 'MALVIN M. SALAS', chairmanship: 'Chairman Budget & Appropriation' },
            // Add remaining councilors as default values
          ],
        },
        {
          name: 'skChairman',
          type: 'group',
          label: 'SK Chairman',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              defaultValue: 'GERALDINE L. BELEN',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'SK Chairman',
            },
          ],
        },
        {
          name: 'secretary',
          type: 'group',
          label: 'Barangay Secretary',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              defaultValue: 'HAZEL GRACE M. AGUDA',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Barangay Secretary',
            },
          ],
        },
        {
          name: 'treasurer',
          type: 'group',
          label: 'Barangay Treasurer',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              defaultValue: 'NORELYN D. SARAZA',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Barangay Treasurer',
            },
          ],
        },
      ],
    },
    
    // Certificate Type-Specific Settings
    {
      name: 'certificateTypes',
      type: 'group',
      label: 'Certificate Type Settings',
      fields: [
        {
          name: 'residency',
          type: 'group',
          label: 'Barangay Residency',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'BARANGAY RESIDENCY',
            },
            {
              name: 'bodyText',
              type: 'textarea',
              label: 'Body Text',
              defaultValue: 'This is to certify that as per record the person signature appearing here is a bonafide resident of this barangay for _____ with the following detail/s;',
            },
            {
              name: 'purposeText',
              type: 'textarea',
              label: 'Purpose Text',
              defaultValue: 'This certification is issued upon the request of the interested party for reference and whatever legal purpose it may serve.',
            },
            {
              name: 'defaultValidity',
              type: 'text',
              label: 'Default Validity',
              defaultValue: '6 months',
            },
          ],
        },
        {
          name: 'indigency',
          type: 'group',
          label: 'Barangay Indigency',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'BARANGAY INDIGENCY',
            },
            {
              name: 'regularBodyText',
              type: 'textarea',
              label: 'Regular Body Text',
              defaultValue: 'This is to certify that ___ and resident of ___ belongs to an indigent family whose income is below threshold level.',
            },
            {
              name: 'medicalBodyText',
              type: 'textarea',
              label: 'Medical Assistance Body Text',
              defaultValue: 'This is to certify that the stated personal details found in the record of Barangay Inhabitants Master List is a Bonafide resident of Barangay and belongs to indigent family and he/she is asking for Medical Assistance for his/her ___.',
            },
            {
              name: 'regularPurposeText',
              type: 'textarea',
              label: 'Regular Purpose Text',
              defaultValue: 'This certification is issued upon the request of the aforementioned for ___ only.',
            },
            {
              name: 'medicalPurposeText',
              type: 'textarea',
              label: 'Medical Purpose Text',
              defaultValue: 'This certification is issued upon the request of the interested party for reference and whatever legal purpose it may serve.',
            },
          ],
        },
        {
          name: 'clearance',
          type: 'group',
          label: 'Barangay Clearance',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'BARANGAY CLEARANCE',
            },
            {
              name: 'bodyText',
              type: 'textarea',
              label: 'Body Text',
              defaultValue: 'This is to certify that as per record, the person whose name, photo, and signature appearing herein has requested a CLEARANCE from this office with the following detail/s;',
            },
            {
              name: 'purposeText',
              type: 'textarea',
              label: 'Purpose Text',
              defaultValue: 'This certification is issued upon the request of the above subject for the purpose stated.',
            },
            {
              name: 'defaultValidity',
              type: 'text',
              label: 'Default Validity Period',
              defaultValue: 'Six (6) Months',
            },
            {
              name: 'thumbMarkLabel',
              type: 'text',
              label: 'Thumbmark Label',
              defaultValue: 'Applicant\'s Right\nThumb Mark',
            },
          ],
        },
      ],
    },
    
    // General Certificate Settings
    {
      name: 'general',
      type: 'group',
      label: 'General Certificate Settings',
      fields: [
        {
          name: 'defaultCitizenship',
          type: 'text',
          label: 'Default Citizenship',
          defaultValue: 'Filipino',
        },
        {
          name: 'signatureLabel',
          type: 'text',
          label: 'Signature Label',
          defaultValue: 'Signature Over Printed Name of Client',
        },
        {
          name: 'controlNumberPrefix',
          type: 'group',
          label: 'Control Number Prefixes',
          fields: [
            {
              name: 'residency',
              type: 'text',
              label: 'Residency Prefix',
              defaultValue: 'BRGY-RES',
            },
            {
              name: 'indigency',
              type: 'text',
              label: 'Indigency Prefix',
              defaultValue: 'BRGY-IND',
            },
            {
              name: 'clearance',
              type: 'text',
              label: 'Clearance Prefix',
              defaultValue: 'BC',
            },
          ],
        },
      ],
    },
  ],
};

export default CertificateSettings;
```

### 1.2 Update PayloadCMS Configuration

Add the new global to `payload.config.ts`:

```javascript
// payload.config.ts
import CertificateSettings from './globals/CertificateSettings';

// ... existing code ...

export default buildConfig({
  // ... existing config ...
  globals: [
    SiteSettings,
    CertificateSettings, // Add this line
    // ... other globals
  ],
  // ... rest of config
});
```

### 1.3 Update Requests Collection (Future Consideration)

For future implementation, the `Requests.ts` collection would be updated to include fields for certificate-specific data:

```javascript
// collections/Requests.ts - Future addition
{
  name: 'certificateData',
  type: 'group',
  label: 'Certificate Information',
  admin: {
    condition: (data) => data?.status === 'approved',
  },
  fields: [
    {
      name: 'controlNumber',
      type: 'text',
      label: 'Control Number',
      admin: {
        description: 'Auto-generated if left blank',
      },
    },
    {
      name: 'ctcDetails',
      type: 'group',
      label: 'CTC Details',
      fields: [
        { name: 'ctcNumber', type: 'text', label: 'CTC Number' },
        { name: 'ctcDateIssued', type: 'date', label: 'CTC Date Issued' },
        { name: 'ctcAmount', type: 'text', label: 'CTC Amount' },
        { name: 'ctcPlaceIssued', type: 'text', label: 'CTC Place Issued' },
      ],
    },
    {
      name: 'orNumber',
      type: 'text',
      label: 'OR Number',
    },
    {
      name: 'amountPaid',
      type: 'text',
      label: 'Amount Paid',
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Valid Until',
    },
  ],
}
```

## 2. Dashboard Interface for Certificate Settings

### 2.1 Create Dashboard Page Component

Create a new page component at `app/(app)/dashboard/certificate-settings/page.jsx`:

```jsx
import React, { Suspense } from 'react';
import CertificateSettingsPage from '@/components/pages/certificate-settings/CertificateSettingsPage';
import LoadingSkeleton from '@/components/layout/LoadingSkeleton';

export const metadata = {
  title: 'Certificate Settings | CCL',
  description: 'Configure certificate templates and content',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CertificateSettingsRoute() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CertificateSettingsPage />
    </Suspense>
  );
}
```

### 2.2 Create Certificate Settings Actions

Create a server actions file for managing certificate settings at `app/(app)/dashboard/certificate-settings/actions.js`:

```javascript
"use server";

import { payload } from "@/lib/payload";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Fetch certificate settings
export async function getCertificateSettings() {
  try {
    const headersList = headers();
    await payload.auth({ headers: headersList });
    
    const certificateSettings = await payload.findGlobal({
      slug: 'certificate-settings',
    });
    
    return certificateSettings;
  } catch (error) {
    console.error('Error fetching certificate settings:', error);
    throw new Error('Failed to fetch certificate settings');
  }
}

// Update certificate settings
export async function updateCertificateSettings(data) {
  try {
    const headersList = headers();
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user || !['admin', 'staff'].includes(user.role)) {
      throw new Error('Unauthorized to update certificate settings');
    }
    
    const updatedSettings = await payload.updateGlobal({
      slug: 'certificate-settings',
      data,
    });
    
    revalidatePath('/dashboard/certificate-settings');
    revalidatePath('/certificate/[id]', 'page');
    
    return {
      success: true,
      data: updatedSettings,
      message: 'Certificate settings updated successfully',
    };
  } catch (error) {
    console.error('Error updating certificate settings:', error);
    return {
      success: false,
      message: error.message || 'Failed to update certificate settings',
    };
  }
}
```

### 2.3 Create Settings UI Components

Create the necessary UI components for the settings page:

1. Create the main settings page component at `components/pages/certificate-settings/CertificateSettingsPage.jsx`
2. Create sub-components for different settings sections:
   - `components/pages/certificate-settings/GeneralSettingsForm.jsx`
   - `components/pages/certificate-settings/BarangayDetailsForm.jsx`
   - `components/pages/certificate-settings/OfficialsForm.jsx`
   - `components/pages/certificate-settings/CertificateTypesForm.jsx`

### 2.4 Add to Sidebar Navigation

Update the sidebar navigation to include the certificate settings:

```jsx
// components/sidebar/SidebarContent.jsx
// ... existing imports ...

function SidebarContent() {
  // ... existing code ...
  return (
    <div>
      {/* ... existing sidebar items ... */}
      
      {isAdmin || isStaff ? (
        <SidebarItem
          href="/dashboard/certificate-settings"
          label="Certificate Settings"
          icon={<DocumentTextIcon className="w-5 h-5" />}
        />
      ) : null}
      
      {/* ... existing sidebar items ... */}
    </div>
  );
}
```

## 3. Modify Certificate Components

### 3.1 Update CertificateLayout.jsx

Refactor `CertificateLayout.jsx` to use the global settings instead of hardcoded values:

```jsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function CertificateLayout({ children, settings }) {
  // Use the settings object passed from the server component
  const {
    images = {},
    barangayDetails = {},
    barangayOfficials = {},
  } = settings || {};

  // Extract officials
  const captain = barangayOfficials?.captain || { name: 'CONVERSION M. LAMOCA', title: 'Punong Barangay' };
  const councilors = barangayOfficials?.councilors || [];
  const skChairman = barangayOfficials?.skChairman || { name: 'GERALDINE L. BELEN', title: 'SK Chairman' };
  const secretary = barangayOfficials?.secretary || { name: 'HAZEL GRACE M. AGUDA', title: 'Barangay Secretary' };
  const treasurer = barangayOfficials?.treasurer || { name: 'NORELYN D. SARAZA', title: 'Barangay Treasurer' };

  return (
    <div className="bg-gray-100 p-2 md:p-8 print:p-0 print:bg-white">
      <div className="max-w-[8.5in] min-h-[11in] mx-auto bg-white shadow-lg p-6 md:p-10 print:shadow-none print:p-2">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
          <div className="w-24 h-24 relative print:w-20 print:h-20">
            {images?.barangayLogo?.url ? (
              <Image 
                src={images.barangayLogo.url} 
                alt="Barangay Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-700 text-xs text-gray-500 print:border-black">
                Brgy Logo
              </div>
            )}
          </div>
          <div className="text-center flex-1 px-2 print:px-1">
            <p className="text-xs md:text-sm print:text-[10pt]">{barangayDetails.headerText || 'Republic of the Philippines'}</p>
            <p className="text-xs md:text-sm print:text-[10pt]">Province of {barangayDetails.province || 'Quezon'}</p>
            <p className="text-xs md:text-sm print:text-[10pt]">Municipality of {barangayDetails.municipality || 'Candelaria'}</p>
            <p className="font-bold text-sm md:text-base print:text-[12pt]">BARANGAY {barangayDetails.barangayName || 'MALABANBAN NORTE'}</p>
          </div>
          <div className="w-20 h-20 relative print:w-16 print:h-16">
            {images?.philippineSeal?.url ? (
              <Image 
                src={images.philippineSeal.url} 
                alt="Philippine Seal" 
                fill 
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center border border-gray-500 text-xs text-gray-500 print:border-black">
                PH Seal
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col md:flex-row gap-6 print:gap-4">
          {/* Officials Sidebar */}
          <aside className="w-full md:w-1/3 bg-yellow-50/30 p-3 border border-yellow-400/50 print:w-[2.5in] print:p-2 print:border-black print:bg-transparent print:text-[9pt]">
            <div className="text-center mb-3">
              <p className="font-bold text-sm print:text-[10pt]">{captain.name}</p>
              <p className="text-xs italic print:text-[8pt]">{captain.title}</p>
            </div>

            <p className="font-semibold text-xs uppercase mb-1 print:text-[8pt]">Councilors:</p>
            <ul className="space-y-1 text-xs print:text-[8pt]">
              {councilors.map((councilor) => (
                <li key={councilor.name}>
                  <p className="font-medium leading-tight">{councilor.name}</p>
                  <p className="text-xs italic leading-tight print:text-[7pt]">{councilor.chairmanship}</p>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-2 border-t border-yellow-400/50 print:border-black">
              <p className="font-medium text-xs print:text-[8pt]">{skChairman.name}</p>
              <p className="text-xs italic print:text-[7pt]">{skChairman.title}</p>
            </div>
            <div className="mt-1">
              <p className="font-medium text-xs print:text-[8pt]">{secretary.name}</p>
              <p className="text-xs italic print:text-[7pt]">{secretary.title}</p>
            </div>
            <div className="mt-1">
              <p className="font-medium text-xs print:text-[8pt]">{treasurer.name}</p>
              <p className="text-xs italic print:text-[7pt]">{treasurer.title}</p>
            </div>
          </aside>

          {/* Certificate Content */}
          <section className="flex-1">
            {children}
          </section>
        </main>

        {/* Footer Section */}
        <footer className="mt-8 pt-4 border-t text-center print:mt-6 print:pt-2">
          <p className="text-xs font-medium print:text-[8pt]">OFFICE OF THE BARANGAY CHAIRPERSON</p>
          <p className="text-xs print:text-[8pt]">{barangayDetails.barangayAddress || 'Tibanglan Road Malabanban Norte, Candelaria, Quezon'}</p>
          <p className="text-xs print:text-[8pt]">Telephone Number: {barangayDetails.contactNumber || '(042) 585-5423'}</p>
          <p className="text-sm font-semibold mt-2 text-blue-600 print:text-[9pt] print:text-black">
            "{barangayDetails.tagline || 'Madaling lapitan, maaasahan sa oras ng pangangailangan'}"
          </p>
        </footer>
      </div>
    </div>
  );
}

export { CertificateLayout };
```

### 3.2 Update Certificate Type Components

Update each certificate type component to use settings from the global configuration.

### 3.3 Update CertificatePage

Modify `app/(app)/certificate/[id]/page.jsx` to fetch and pass along the certificate settings:

```jsx
// Update CertificatePage to fetch and use certificate settings
export default async function CertificatePage({ params }) {
  const { id } = await params;
  const requestAPIResult = await getRequest(id);
  
  // Also fetch certificate settings
  const certificateSettings = await getCertificateSettings();
  
  // ... existing code ...
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="relative">
        <CertificateComponent 
          requestData={certificateProps} 
          settings={certificateSettings} 
        />
        <PrintButton />
      </div>
    </Suspense>
  );
}
```

## 4. Future Certificate Enhancements

### 4.1 Auto-Generate Control Numbers

Implement a server action to auto-generate sequential control numbers based on:
- Certificate type
- Current year
- Sequence number (incrementing per certificate type)

### 4.2 Certificate Preview in Settings

Add a preview feature in the certificate settings page to show how changes affect certificates.

### 4.3 Certificate History Log

Create a log of all generated certificates for audit purposes, including:
- Certificate type
- Generated date
- Request ID
- Generated by (user)
- Control number

## 5. Implementation Timeline

1. **Phase 1: Create PayloadCMS Global**
   - Implement `CertificateSettings` global
   - Add to PayloadCMS configuration

2. **Phase 2: Settings UI**
   - Create certificate settings dashboard page
   - Implement settings forms and validation
   - Add to sidebar navigation

3. **Phase 3: Refactor Certificate Components**
   - Update `CertificateLayout` to use global settings
   - Update individual certificate type components
   - Connect to `CertificatePage`

4. **Phase 4: Testing and Refinement**
   - Test all certificate types with different settings
   - Verify print output
   - Ensure responsive behavior

5. **Phase 5: Future Enhancements**
   - Auto-generate control numbers
   - Certificate preview
   - Certificate history log

## 6. Conclusion

This plan provides a comprehensive approach to making certificates fully customizable through a dedicated dashboard interface. By leveraging PayloadCMS globals and a well-structured settings UI, we can give administrators full control over certificate content, officials' information, and visual assets without requiring code changes. 