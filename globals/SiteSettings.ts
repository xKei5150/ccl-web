import type { GlobalConfig } from 'payload';

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Site Name',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: 'Site Logo',
    },
    {
      name: 'favicon',
      type: 'relationship',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Site Description',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Contact Phone',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
  ],
}

export default SiteSettings;