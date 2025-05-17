import type { CollectionConfig } from 'payload'

// Define access control
const isLoggedIn = ({ req: { user } }) => Boolean(user);
const isAdminOrStaff = ({ req: { user } }) => {
    if (!user) return false;
    return ['admin', 'staff'].includes(user.role);
};
const isOwnerOrAdminOrStaff = ({ req: { user } }) => {
    if (!user) return false;
    if (['admin', 'staff'].includes(user.role)) return true;
    return { createdBy: { equals: user?.id } };
};

// Define project types
const projectTypes = [
    { label: 'Event', value: 'event' },
    { label: 'Infrastructure', value: 'infrastructure' },
    { label: 'Community Program', value: 'program' },
    { label: 'Administrative Initiative', value: 'initiative' },
    { label: 'Other', value: 'other' },
];

// Define project statuses
const projectStatuses = [
    { label: 'Planning', value: 'planning' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on_hold' },
    { label: 'Cancelled', value: 'cancelled' },
];

const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'projectType', 'status', 'createdBy', 'createdAt'],
        group: 'Operations',
    },
    access: {
        read: isAdminOrStaff,
        update: isOwnerOrAdminOrStaff,
        create: isAdminOrStaff,
        delete: isAdminOrStaff,
    },
    fields: [
        // Core Fields
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Project Title',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Project Description',
        },
        {
            name: 'projectType',
            type: 'select',
            options: projectTypes,
            required: true,
            label: 'Type of Project',
            admin: { position: 'sidebar' }
        },
        {
            name: 'status',
            type: 'select',
            options: projectStatuses,
            defaultValue: 'planning',
            required: true,
            label: 'Current Status',
            admin: { position: 'sidebar' }
        },
        {
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
            },
        },
        {
            name: 'endDate',
            type: 'date',
            label: 'End Date',
            admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
            },
        },
        {
            name: 'location',
            type: 'text',
            label: 'Location',
            admin: { description: 'Specific venue or area for the project.' }
        },

        // People Involved
        {
            name: 'projectLead',
            type: 'text',
            required: false,
            label: 'Project Lead Name',
            admin: { position: 'sidebar', description: 'Name of the primary person responsible.' }
        },
        {
            name: 'teamMembers', 
            label: 'Team Members',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: 'Member Name'
                },
                {
                    name: 'role',
                    type: 'text',
                    required: false,
                    label: 'Role in Project'
                }
            ],
            admin: { 
                description: 'List team members and their roles.',
            }
        },
        {
            name: 'relatedFinancing',
            type: 'relationship',
            relationTo: 'financing',
            hasMany: false,
            label: 'Related Budget/Financing',
            admin: { description: 'Link to the funding source for this project.' }
        },

        // Conditional Fields based on Project Type
        {
            name: 'eventDetails',
            type: 'group',
            label: 'Event Specific Details',
            admin: {
                condition: (data) => data.projectType === 'event',
            },
            fields: [
                {
                    name: 'expectedAttendees',
                    type: 'number',
                    label: 'Expected Attendees',
                    admin: { step: 1 }
                },
                {
                    name: 'actualAttendees',
                    type: 'number',
                    label: 'Actual Attendees',
                    admin: { step: 1 }
                },
                {
                    name: 'attendeeNotes',
                    type: 'textarea',
                    label: 'Attendance Notes',
                    admin: { description: 'Registration details, observations, etc.' }
                }
            ]
        },
        {
            name: 'infrastructureDetails',
            type: 'group',
            label: 'Infrastructure Specific Details',
            admin: {
                condition: (data) => data.projectType === 'infrastructure',
            },
            fields: [
                {
                    name: 'contractor',
                    type: 'text',
                    label: 'Contractor/Vendor',
                },
                {
                    name: 'completionPercentage',
                    type: 'number',
                    label: 'Completion (%)',
                }
            ]
        },
        {
            name: 'programDetails',
            type: 'group',
            label: 'Community Program Specific Details',
            admin: {
                condition: (data) => data.projectType === 'program',
            },
            fields: [
                {
                    name: 'targetBeneficiaries',
                    type: 'textarea',
                    label: 'Target Beneficiaries',
                },
                {
                    name: 'keyPerformanceIndicators',
                    type: 'textarea',
                    label: 'Key Performance Indicators (KPIs)',
                    admin: { description: 'How will success be measured?' }
                }
            ]
        },

        // Meta Fields
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users',
            access: {
                update: () => false,
            },
            admin: {
                readOnly: true,
                position: 'sidebar',
                condition: data => Boolean(data?.createdBy)
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ req, operation, data }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id;
                }
                return data;
            }
        ],
    }
};

export default Projects; 