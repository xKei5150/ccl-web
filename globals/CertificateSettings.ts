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
          admin: {
            description: 'Upload a logo image to be displayed on the top left of all certificates (recommended size: 200x200px)',
          },
        },
        {
          name: 'philippineSeal',
          type: 'upload',
          relationTo: 'media',
          label: 'Philippine Seal/Flag',
          admin: {
            description: 'Upload the Philippine seal or flag to be displayed on the top right of all certificates',
          },
        },
        {
          name: 'officialSeal',
          type: 'upload',
          relationTo: 'media',
          label: 'Official Seal (for clearance)',
          admin: {
            description: 'Upload the official barangay seal to be used as a watermark on clearance certificates',
          },
        },
        {
          name: 'captainSignature',
          type: 'upload',
          relationTo: 'media',
          label: 'Barangay Captain Signature',
          admin: {
            description: 'Upload a digital signature of the Barangay Captain for certificates (PNG with transparent background recommended)',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Certificate Background Image',
          admin: {
            description: 'Upload a background image for certificates (will be displayed with reduced opacity)',
          },
        },
        {
          name: 'backgroundOpacity',
          type: 'select',
          label: 'Background Image Opacity',
          options: [
            { label: 'Very Light (5%)', value: '5' },
            { label: 'Light (10%)', value: '10' },
            { label: 'Medium (15%)', value: '15' },
            { label: 'Strong (20%)', value: '20' },
          ],
          defaultValue: '10',
          admin: {
            description: 'Control the opacity/visibility of the background image',
            condition: (data) => Boolean(data?.images?.backgroundImage),
          },
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
            { name: 'MELANIE P. CANIMO', chairmanship: 'Chairman Education & Health' },
            { name: 'ALFREDO I. DELA CRUZ', chairmanship: 'Chairman Infrastructure' },
            { name: 'PEDRO L. DELA CRUZ', chairmanship: 'Chairman Peace & Order' },
            { name: 'ELENITA P. LANDICHO', chairmanship: 'Chairman Sectoral Programs' },
            { name: 'MANUEL C. ALMIAR', chairmanship: 'Chairman Agriculture' },
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
        {
          name: 'businessClearance',
          type: 'group',
          label: 'Barangay Business Clearance',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'BARANGAY BUSINESS CLEARANCE',
            },
            {
              name: 'conditionsText',
              type: 'textarea',
              label: 'Conditions Text',
              defaultValue: 'The issuance of this clearance is subject to the condition that the above enterprise has complied and shall continue to comply with all existing national and local government laws, rules and regulations, Barangay Ordinances pertaining to the operations of the business establishment and its operation shall not pose any environmental and social hazard to the public.',
            },
            {
              name: 'revocationText',
              type: 'textarea',
              label: 'Revocation Notice',
              defaultValue: 'This clearance shall be deemed automatically revoked and considered null and void should above enterprise be found to have violated or failed to comply with the conditions.',
            },
            {
              name: 'contactText',
              type: 'textarea',
              label: 'Contact Information',
              defaultValue: 'For comply please notify: Conversion "Bobot" Lamoca/Punong Barangay',
            },
            {
              name: 'defaultValidity',
              type: 'text',
              label: 'Default Validity Period',
              defaultValue: 'One (1) Year',
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
            {
              name: 'businessClearance',
              type: 'text',
              label: 'Business Clearance Prefix',
              defaultValue: 'BC',
            },
          ],
        },
      ],
    },
  ],
};

export default CertificateSettings; 