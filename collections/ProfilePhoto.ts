import type { CollectionConfig } from 'payload'

const ProfilePhoto: CollectionConfig = {
  slug: 'profile-photo',
  admin: {
    useAsTitle: 'filename', // Use the filename as the title in the admin UI
  },
  upload: {
    staticDir: 'uploads/media',   // Define where the files will be stored locally
    imageSizes: [         // Define image sizes that will be generated
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'], // Restrict file types
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
};

export default ProfilePhoto;