import type { CollectionConfig } from 'payload'

const Households: CollectionConfig = {
  slug: 'households',
  admin: {
    useAsTitle: 'familyName', // Use the family name as the title in the admin UI
  },
  fields: [
    {
      name: 'familyName',
      type: 'text',
      required: true,
      label: 'Family Name',
    },
    {
      name: 'members',
      type: 'array',
      label: 'Household Members',
      fields: [
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'personal-information',
          label: 'Member',
        },
      ],
    },
    {
      name: 'localAddress',
      type: 'text', // Consider using a dedicated 'address' field type or a separate 'Addresses' collection
      required: true,
      label: 'Local Address',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      label: 'Status',
    },
    {
      name: 'residencyDate',
      type: 'date',
      label: 'Residency Date',
    },
  ],
};

export default Households;