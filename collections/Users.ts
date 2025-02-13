import type { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'citizen',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Citizen', value: 'citizen' },
      ],
    },
    {
      name: 'personalInfo',
      type: 'relationship',
      relationTo: 'personal-information',
      hasMany: false,
    },
    {
      name: 'isActive',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    // update: () => true,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      if (user?.role === 'staff') return true;
      return false;
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return false;
    },
  },
};

export default Users;