import type { CollectionConfig } from 'payload'

const PersonalInformation: CollectionConfig = {
  slug: 'personal-information',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'profile-photo',
      label: 'Photo',
    },
    {
      name: 'name',
      type: 'group',
      label: 'Name',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'middleName',
          type: 'text',
          label: 'Middle Name',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'fullName',
          type: 'text',
          hooks: {
            beforeChange: [
              ({ data }) => {
                if (data.name) {
                  const { firstName, middleName, lastName } = data.name;
                  const middleInitial = middleName ? ` ${middleName.charAt(0)}.` : '';
                  return `${firstName}${middleInitial} ${lastName}`.trim();
                }
                return '';
              },
            ],
          },
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'emailAddress',
          type: 'email',
          unique: true,
          label: 'Email Address',
        },
        {
          name: 'localAddress',
          type: 'text',
          label: 'Local Address',
        },
      ],
    },
    {
      name: 'demographics',
      type: 'group',
      label: 'Demographics',
      fields: [
        {
          name: 'sex',
          type: 'select',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          label: 'Sex',
        },
        {
          name: 'birthDate',
          type: 'date',
          label: 'Date of Birth',
        },
        {
          name: 'maritalStatus',
          type: 'select',
          options: [
            { label: 'Single', value: 'single' },
            { label: 'Married', value: 'married' },
            { label: 'Divorced', value: 'divorced' },
            { label: 'Widowed', value: 'widowed' },
          ],
          label: 'Marital Status',
        },
      ],
    },
    {
      name: 'status',
      type: 'group',
      label: 'Status',
      fields: [
        {
          name: 'residencyStatus',
          type: 'select',
          options: [
            { label: 'Permanent', value: 'permanent' },
            { label: 'Temporary', value: 'temporary' },
          ],
          label: 'Residency Status',
          required: false,
        },
        {
          name: 'lifeStatus',
          type: 'select',
          options: [
            { label: 'Alive', value: 'alive' },
            { label: 'Deceased', value: 'deceased' },
          ],
          label: 'Life Status',
          required: false,
          defaultValue: 'alive',
        },
      ],
    },
  ],
};

export default PersonalInformation;