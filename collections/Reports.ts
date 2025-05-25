import type { CollectionConfig } from 'payload'

const Reports: CollectionConfig = {
    slug: 'reports',
    admin: {
        useAsTitle: 'title', // Use the report title as the title in the admin UI
    },
    access: {
                read: async ({ req: { user } }) => {
            if (!user) return false;
            
            // Admin and staff can see all reports
            if (['admin', 'staff'].includes(user.role)) return true;
            
            // Citizens can see reports they submitted or reports where they are the reporter
            if (user.role === 'citizen') {
                console.log('Reports access control - User:', JSON.stringify(user, null, 2));
                
                // If user has personal information linked, allow them to see reports where they are reportedBy
                if (user.personalInfo) {
                    const personalInfoId = typeof user.personalInfo === 'object' ? user.personalInfo.id : user.personalInfo;
                    console.log('Reports access control - Personal Info ID:', personalInfoId);
                    
                    const accessQuery = {
                        or: [
                            {
                                submittedBy: {
                                    equals: user.id
                                }
                            },
                            {
                                reportedBy: {
                                    equals: personalInfoId
                                }
                            }
                        ]
                    };
                    
                    console.log('Reports access control - Query:', JSON.stringify(accessQuery, null, 2));
                    return accessQuery;
                }
                
                console.log('Reports access control - No personal info, fallback to submitted only');
                // Fallback: only see reports they submitted
                return {
                    submittedBy: {
                        equals: user.id
                    }
                };
            }
            
            return false;
        },
        create: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
                update: async ({ req: { user } }) => {
            if (!user) return false;
            
            // Admin and staff can update all reports
            if (['admin', 'staff'].includes(user.role)) return true;
            
            // Citizens can update reports they submitted or reports where they are the reporter
            if (user.role === 'citizen') {
                if (user.personalInfo) {
                    const personalInfoId = typeof user.personalInfo === 'object' ? user.personalInfo.id : user.personalInfo;
                    return {
                        or: [
                            {
                                submittedBy: {
                                    equals: user.id
                                }
                            },
                            {
                                reportedBy: {
                                    equals: personalInfoId
                                }
                            }
                        ]
                    };
                }
                
                // Fallback: only update reports they submitted
                return {
                    submittedBy: {
                        equals: user.id
                    }
                };
            }
            
            return false;
        },
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
            name: 'reportedBy',
            type: 'relationship',
            relationTo: 'personal-information',
            required: true,
            label: 'Reported By',
            admin: {
                description: 'Select the person who reported this incident',
            },
            hooks: {
                beforeChange: [
                    async ({ req, operation, value }) => {
                        // For create operations, try to find the current user's personal information
                        if (operation === 'create' && !value && req.user) {
                            try {
                                // Try to find personal information linked to the current user
                                const personalInfo = await req.payload.find({
                                    collection: 'personal-information',
                                    where: {
                                        'contact.emailAddress': {
                                            equals: req.user.email
                                        }
                                    },
                                    limit: 1
                                });

                                if (personalInfo.docs.length > 0) {
                                    return personalInfo.docs[0].id;
                                }
                            } catch (error) {
                                console.log('Could not auto-populate reportedBy field:', error);
                            }
                        }
                        return value;
                    }
                ]
            }
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
                { label: 'Requires Presence at Barangay', value: 'requiresPresence' },
                { label: 'Closed', value: 'closed' },
            ],
            defaultValue: 'open',
            label: 'Status'
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

export default Reports;