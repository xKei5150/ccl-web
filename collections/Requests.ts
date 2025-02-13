import type { CollectionConfig } from 'payload'

const Requests: CollectionConfig = {
  slug: 'requests',
  admin: {
    useAsTitle: 'id', // Consider using a more descriptive field if you add one later (e.g., 'requestNumber')
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