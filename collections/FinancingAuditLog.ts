import type { CollectionConfig } from 'payload'

const FinancingAuditLog: CollectionConfig = {
  slug: 'financing-audit-log',
  admin: {
    useAsTitle: 'timestamp',
    defaultColumns: ['timestamp', 'user', 'action', 'record'],
    group: 'Financial Management',
    description: 'Audit trail for all financing record changes',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (['admin', 'staff'].includes(user.role)) return true;
      return false; // Regular users cannot read audit logs
    },
    create: () => false, // Only created via hooks
    update: () => false, // Immutable
    delete: () => false, // Immutable
  },
  fields: [
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'action',
      type: 'select',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'State Change', value: 'state_change' },
      ],
      required: true,
    },
    {
      name: 'record',
      type: 'relationship',
      relationTo: 'financing',
      required: true,
    },
    {
      name: 'financingTitle',
      type: 'text',
      label: 'Record Title',
      admin: {
        description: 'Stored for reference even if the record is deleted'
      }
    },
    {
      name: 'previousState',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        condition: (data) => data.action === 'state_change',
      }
    },
    {
      name: 'newState',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        condition: (data) => data.action === 'state_change',
      }
    },
    {
      name: 'changes',
      type: 'json',
      admin: {
        description: 'Detailed changes made to the record',
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional context about this change',
      }
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure timestamp is set
        return {
          ...data,
          timestamp: data.timestamp || new Date().toISOString(),
        };
      },
    ],
  },
};

export default FinancingAuditLog; 