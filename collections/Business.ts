import type { CollectionConfig } from 'payload'

const Business: CollectionConfig = {
  slug: 'business',
  admin: {
    useAsTitle: 'businessName',
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
      label: 'Business Name',
    },
    {
      name: 'address',
      type: 'text', // Consider using an 'address' field type or a separate 'Addresses' collection later
      required: true,
      label: 'Address',
    },
    {
      name: 'registrationDate',
      type: 'date',
      required: true,
      label: 'Registration Date',
    },
    {
      name: 'eligibility',
      type: 'date',
      label: 'Eligibility Date', // You might want to clarify what this date represents
    },
    {
      name: 'typeOfOwnership',
      type: 'select',
      required: true,
      options: [
        { label: 'Sole Proprietorship', value: 'sole-proprietorship' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Corporation', value: 'corporation' },
        { label: 'LLC', value: 'llc' },
      ],
      label: 'Type of Ownership',
    },
    {
      name: 'owners',
      type: 'array',
      label: 'Owners',
      fields: [
        {
          name: 'ownerName',
          type: 'text',
          required: true,
          label: 'Owner Name',
        },
      ],
    },
    {
      name: 'typeOfCorporation',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Non-profit', value: 'non-profit' },
      ],
      label: 'Type of Corporation', // Only relevant if 'typeOfOwnership' is 'corporation'
    },
    {
      name: 'businessContactNo',
      type: 'text', // You might want to add validation for phone number format
      label: 'Business Contact Number',
    },
    {
      name: 'businessEmailAddress',
      type: 'email',
      required: true,
      unique: true,
      label: 'Business Email Address',
    },
    {
      name: 'supportingDocuments',
      type: 'relationship',
      relationTo: 'supporting-documents',
      hasMany: true, // Allows multiple supporting documents
      label: 'Supporting Documents',
    },
    {
        name: 'permits',
        type: 'relationship',
        relationTo: 'business-permits',
        hasMany: true,
        label: 'Permits'
    }
  ],
};

export default Business;