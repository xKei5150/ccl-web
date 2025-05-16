import type { CollectionConfig } from 'payload'

const Requests: CollectionConfig = {
  slug: 'requests',
  admin: {
    // Consider using a more descriptive field if you add one later (e.g., 'requestNumber')
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (['admin', 'staff'].includes(user.role)) return true;
      return {
        'person': {
          equals: user.personalInfo
        }
      };
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      if (['admin', 'staff'].includes(user.role)) return true;
      return true; // Allow citizens to create their own requests
    },
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Indigency Certificate', value: 'indigencyCertificate' },
        { label: 'Barangay Clearance', value: 'barangayClearance' },
        { label: 'Barangay Residency', value: 'barangayResidency' },
      ],
      label: 'Request Type',
    },
    {
      name: 'person',
      type: 'relationship',
      label: 'Personal Information',
      required: true,
      relationTo: 'personal-information',
    },
    {
      name: 'purpose',
      type: 'text',
      label: 'Purpose',
    },
    // Conditional Fields (using a group to keep them organized)
    {
      name: 'additionalInformation',
      type: 'group',
      label: 'Additional Information',
      fields: [
        {
          name: 'forWhom',
          type: 'text',
          label: 'For Whom (Beneficiary)',
          admin: {
            condition: (data) => data?.type === 'indigencyCertificate',
          },
        },
        {
          name: 'remarks',
          type: 'text',
          label: 'Remarks',
          admin: {
            condition: (data) => data?.type === 'barangayClearance',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration (e.g., 6 months)',
          admin: {
            condition: (data) => data?.type === 'barangayResidency',
          },
        },
      ],
    },
    {
      name: 'supportingDocuments',
      type: 'relationship',
      relationTo: 'supporting-documents',
      hasMany: true,
      label: 'Supporting Documents',
    },
    // Certificate-specific fields
    {
      name: 'certificateDetails',
      type: 'group',
      label: 'Certificate Details',
      admin: {
        condition: (data) => ['indigencyCertificate', 'barangayClearance', 'barangayResidency'].includes(data?.type),
      },
      fields: [
        {
          name: 'controlNumber',
          type: 'text',
          label: 'Control Number',
          admin: {
            description: 'Automatically generated when certificate is issued',
          },
        },
        {
          name: 'dateIssued',
          type: 'date',
          label: 'Date Issued',
          admin: {
            description: 'Date when the certificate was issued',
          },
        },
        {
          name: 'validUntil',
          type: 'date',
          label: 'Valid Until',
          admin: {
            description: 'Date until when the certificate is valid',
          },
        },
        // CTC Information
        {
          name: 'ctcDetails',
          type: 'group',
          label: 'CTC Details',
          fields: [
            {
              name: 'ctcNo',
              type: 'text',
              label: 'CTC Number',
            },
            {
              name: 'ctcDateIssued',
              type: 'date',
              label: 'CTC Date Issued',
            },
            {
              name: 'ctcAmount',
              type: 'text',
              label: 'CTC Amount',
            },
            {
              name: 'ctcPlaceIssued',
              type: 'text',
              label: 'CTC Place Issued',
            },
          ],
        },
        // Payment Information
        {
          name: 'payment',
          type: 'group',
          label: 'Payment Details',
          fields: [
            {
              name: 'orNumber',
              type: 'text',
              label: 'OR Number',
            },
            {
              name: 'amount',
              type: 'text',
              label: 'Amount Paid',
            },
            {
              name: 'date',
              type: 'date',
              label: 'Payment Date',
            },
            {
              name: 'method',
              type: 'select',
              label: 'Payment Method',
              options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Online Payment', value: 'online' },
                { label: 'Free/Waived', value: 'free' },
              ],
              defaultValue: 'cash',
            },
          ],
        },
        // Approver Information
        {
          name: 'approver',
          type: 'group',
          label: 'Approver Details',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Approved By',
            },
            {
              name: 'position',
              type: 'text',
              label: 'Approver Position',
            },
            {
              name: 'date',
              type: 'date',
              label: 'Approval Date',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' }
      ],
      defaultValue: 'pending',
      label: 'Status'
    }
  ],
};

export default Requests;