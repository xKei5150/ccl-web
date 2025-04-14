import type { CollectionConfig } from 'payload'

const StorageFolders: CollectionConfig = {
  slug: 'storage-folders',
  access: {
    read: () => true,
    create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'storage-folders',
      hasMany: false,
    },
  ],
  timestamps: true,
}

export default StorageFolders; 