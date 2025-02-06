import type { CollectionConfig } from 'payload'

const SupportingDocuments: CollectionConfig = {
  slug: 'supporting-documents',
  admin: {
    useAsTitle: 'id',
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
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
};  

export default SupportingDocuments;