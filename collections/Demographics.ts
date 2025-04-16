import { CollectionConfig } from 'payload'

const Demographics: CollectionConfig = {
    slug: 'demographics',
    admin: {
        useAsTitle: 'year', // Use the year as the title in the admin UI
    },
    access: {
        read: ({ req: { user } }) => {
            if (!user) return false;
            if (['admin', 'staff'].includes(user.role)) return true;
            return {
                submittedBy: {
                    equals: user?.id
                }
            };
        },
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => {
            if (!user) return false;
            if (['admin', 'staff'].includes(user.role)) return true;
            return {
                submittedBy: {
                    equals: user?.id
                }
            };
        },
        delete: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
    },
    fields: [
        {
            name: 'year',
            type: 'number',
            required: true,
            label: 'Year',
            unique: true,
            min: 1900,
            max: 2100,
            admin: {
                description: 'Year of demographic data'
            }
        },
        {
            name: 'maleCount',
            type: 'number',
            required: true,
            label: 'Male Population',
            min: 0,
        },
        {
            name: 'femaleCount',
            type: 'number',
            required: true,
            label: 'Female Population',
            min: 0,
        },
        {
            name: 'totalPopulation',
            type: 'number',
            label: 'Total Population',
            min: 0,
            admin: {
                description: 'Will be calculated from male + female counts'
            }
        },
        {
            name: 'householdsCount',
            type: 'number',
            label: 'Number of Households',
            min: 0,
        },
        {
            name: 'voterCount',
            type: 'number',
            label: 'Number of Registered Voters',
            min: 0,
        },
        {
            name: 'pwdCount',
            type: 'number',
            label: 'Persons with Disability (PWD) Count',
            min: 0,
        },
        {
            name: 'ageGroups',
            type: 'array',
            label: 'Age Groups',
            fields: [
                {
                    name: 'ageRange',
                    type: 'text',
                    required: true,
                    label: 'Age Range',
                },
                {
                    name: 'count',
                    type: 'number',
                    required: true,
                    label: 'Count',
                    min: 0,
                },
            ],
        },
        {
            name: 'chronicDiseases',
            type: 'array',
            label: 'Chronic Diseases',
            fields: [
                {
                    name: 'diseaseName',
                    type: 'text',
                    required: true,
                    label: 'Disease Name',
                },
                {
                    name: 'count',
                    type: 'number',
                    required: true,
                    label: 'Count',
                    min: 0,
                },
            ],
        },
        {
            name: 'submittedBy',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Submitted By',
            defaultValue: ({ user }) => user?.id // Automatically set to current user
        }
    ],
};

export default Demographics;