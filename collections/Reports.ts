import type { CollectionConfig } from 'payload'

const Reports: CollectionConfig = {
    slug: 'reports',
    admin: {
        useAsTitle: 'title', // Use the report title as the title in the admin UI
    },
    access: {
        read: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
        create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
        update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
        delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
      },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Report Title',
        },
        {
            name: 'date',
            type: 'date',
            required: true,
            label: 'Date of Incident',
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
            label: 'Description',
        },
        {
            name: 'location',
            type: 'text', // Consider using a dedicated 'address' field type
            required: true,
            label: 'Location',
        },
        {
            name: 'involvedPersons',
            type: 'array',
            label: 'Involved Persons',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: 'Name',
                },
                {
                    name: 'role',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Complainant', value: 'complainant' },
                        { label: 'Respondent', value: 'respondent' },
                        { label: 'Witness', value: 'witness' },
                        { label: 'Other', value: 'other' },
                    ],
                    label: 'Role',
                },
                {
                    name: 'statement',
                    type: 'textarea',
                    label: 'Statement',
                },
                {
                    name: 'personalInfo',
                    type: 'relationship',
                    relationTo: 'personal-information',
                    label: 'Personal Information'
                }
            ],
        },
        {
            name: 'supportingDocuments',
            type: 'relationship',
            relationTo: 'supporting-documents',
            hasMany: true,
            label: 'Supporting Documents',
        },
        {
            name: 'reportStatus',
            type: 'select',
            options: [
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'inProgress' },
                { label: 'Closed', value: 'closed' },
            ],
            defaultValue: 'open',
            label: 'Status'
        }
    ],
};

export default Reports;