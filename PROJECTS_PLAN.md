# Project Management Feature Plan

This document outlines the plan for implementing a new 'Projects' feature within the dashboard.

## 1. PayloadCMS Collection: `Projects`

This collection will store information about barangay projects.

```typescript
// collections/Projects.ts
import type { CollectionConfig } from 'payload'

// Define access control (similar to Financing)
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
        group: 'Operations', // Or a new group like 'Project Management'
    },
    access: {
        read: isLoggedIn,
        update: isOwnerOrAdminOrStaff,
        create: isAdminOrStaff, // Allowing staff/admin to create projects initially
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
            name: 'relatedFinancing', // Link to Financing record(s)
            type: 'relationship',
            relationTo: 'financing',
            hasMany: false, // Assuming one primary budget link per project for now
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
                    admin: { min: 0, max: 100, step: 1 }
                },
                // Future: Add fields for 'blueprints' (upload), 'permits' (text/upload)
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
                update: () => false, // Prevent modification after creation
            },
            admin: {
                readOnly: true,
                position: 'sidebar',
                condition: data => Boolean(data?.createdBy) // Only show if set
            },
        },
        // Payload automatically adds 'createdAt' and 'updatedAt' timestamps
    ],
     hooks: {
        beforeChange: [
            // Automatically set 'createdBy' on new document creation
            ({ req, operation, data }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id;
                }
                return data;
            },
            // TODO: Add audit trail hooks similar to Financing if detailed change tracking is needed
        ],
     }
};

export default Projects;
```

## 2. Frontend Route Structure (`app/(app)/dashboard/projects/`)

The frontend will mirror the structure used in other dashboard sections like `financing` or `reports`.

```
app/
└── (app)/
    └── dashboard/
        └── projects/
            ├── page.jsx          # List view: Table/Cards of projects, filtering/sorting options.
            ├── layout.js         # Section layout (e.g., title, breadcrumbs).
            ├── actions.js        # Server actions: createProject, updateProject, deleteProject, getProjects, getProjectById.
            ├── loading.js        # Generic loading skeleton for the projects section.
            ├── new/
            │   └── page.jsx      # Form component (likely client-side for interactivity) for creating new projects. Uses `createProject` action.
            └── [id]/             # Dynamic route for viewing/editing a specific project.
                ├── page.jsx      # Detail view: Displays project information. Fetches data using `getProjectById`.
                ├── edit/         # (Optional but Recommended) Sub-route for editing.
                │   └── page.jsx  # Form component pre-filled with project data. Uses `updateProject` action.
                └── loading.js    # More specific loading skeleton for detail/edit view.
```

## 3. Next Steps

1.  **Review & Refine:** Review the proposed collection fields and route structure. Add or modify fields as needed.
2.  **Implement Collection:** Create the `collections/Projects.ts` file with the defined structure.
3.  **Generate Types:** Run `pnpm payload generate:types` to update TypeScript definitions.
4.  **Build Frontend:** Create the necessary directories and files for the frontend routes (`app/(app)/dashboard/projects/...`).
5.  **Implement Server Actions:** Write the functions in `actions.js` to interact with the Payload API for CRUD operations.
6.  **Develop UI Components:** Build the React components for the list view, detail view, and forms using Shadcn UI/Radix/Tailwind.
7.  **Connect UI & Actions:** Integrate the UI components with the server actions.
8.  **Testing:** Thoroughly test the creation, reading, updating, and deletion of projects. 