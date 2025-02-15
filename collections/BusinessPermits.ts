import type { CollectionConfig } from 'payload'

const BusinessPermits: CollectionConfig = {
  slug: 'business-permits',
  admin: {
    useAsTitle: 'officialReceiptNo',
  },
  access: {
    read: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    {
      name: 'business',
      type: 'relationship',
      relationTo: 'business',
      required: true,
      label: 'Business',
    },
    {
      name: 'validity',
      type: 'date',
      required: true,
      label: 'Permit Validity Date',
    },
    {
      name: 'officialReceiptNo',
      type: 'text',
      required: true,
      unique: true,
      label: 'Official Receipt Number',
    },
    {
      name: 'issuedTo',
      type: 'text', // Consider making this non-editable and populate it automatically from the related 'business'
      required: true,
      label: 'Issued To',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount Paid',
    },
    {
      name: 'supportingDocuments',
      type: 'relationship',
      relationTo: 'supporting-documents',
      hasMany: true,
      label: 'Supporting Documents',
    },
    {
      name: 'paymentDate',
      type: 'date',
      label: 'Payment Date',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    }
  ],
};

export default BusinessPermits;