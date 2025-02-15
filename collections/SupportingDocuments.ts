import type { CollectionConfig } from 'payload'

const SupportingDocuments: CollectionConfig = {
  slug: 'supporting-documents',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  upload: {
    staticDir: 'uploads/supporting-documents',
    mimeTypes: ['application/pdf', 'image/*', 'video/*'], // Customize allowed file types
  },
  fields: [
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
};  

export default SupportingDocuments;