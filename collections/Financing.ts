import type { CollectionConfig } from 'payload'
import { createAuditEntry } from '../lib/finance-utils'

// Define access control
const isLoggedIn = ({ req: { user } }) => {
  return Boolean(user);
};

const isAdminOrHasCCLOrgAccess = ({ req: { user } }) => {
            if (!user) return false;
            if (['admin', 'staff'].includes(user.role)) return true;
            return {
                createdBy: {
                    equals: user?.id
                }
            };
};

// Define available approval states
const approvalStates = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

// Define account types for government spending
const accountTypes = [
  { label: 'Capital Expenditure', value: 'capital' },
  { label: 'Operational Expenditure', value: 'operational' },
  { label: 'Grant', value: 'grant' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Transfer', value: 'transfer' },
];

const Financing: CollectionConfig = {
  slug: 'financing',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'approvalState', 'createdBy', 'createdAt'],
    group: 'Financial Management',
  },
  access: {
    read: isLoggedIn,
    update: isAdminOrHasCCLOrgAccess,
    create: isLoggedIn,
    delete: isAdminOrHasCCLOrgAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    // Government-specific fields
    {
      type: 'collapsible',
      label: 'Government Record Details',
      fields: [
        {
          name: 'approvalState',
          type: 'select',
          options: approvalStates,
          defaultValue: 'draft',
          admin: {
            position: 'sidebar',
                }
        },
        {
          name: 'accountType',
          type: 'select',
          options: accountTypes,
          admin: {
            position: 'sidebar',
          }
        },
        {
          name: 'fiscalYear',
          type: 'text',
          admin: {
            position: 'sidebar',
          }
        },
        {
          name: 'budgetedAmount',
          type: 'number',
          admin: {
            step: 0.01,
          }
        },
        {
          name: 'budgetReference',
          type: 'text',
          admin: {
            description: 'Reference to budget allocation or code',
          }
        },
        {
          name: 'departmentCode',
          type: 'text',
        },
        {
          name: 'justification',
          type: 'textarea',
          admin: {
            description: 'Justification for this expenditure',
          }
        },
        {
          name: 'authorizationReference',
          type: 'text',
          admin: {
            description: 'Legislative or policy authorization reference',
          }
        },
      ]
    },
    // Approval workflow history
    {
      name: 'approvalHistory',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'state',
          type: 'select',
          options: approvalStates,
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'user',
          type: 'text',
          required: true,
        },
        {
          name: 'notes',
          type: 'textarea',
    },
      ],
    },
    // Groups contain calculation items
    {
      name: 'groups',
      type: 'array',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
          name: 'subtotalOperation',
          type: 'select',
          defaultValue: 'sum',
          options: [
            {
              label: 'Sum',
              value: 'sum',
            },
            {
              label: 'Average',
              value: 'average',
            },
            {
              label: 'Minimum',
              value: 'min',
        },
            {
              label: 'Maximum',
              value: 'max',
            },
          ],
        },
        // Items in the group
        {
            name: 'items',
            type: 'array',
            fields: [
                {
                    name: 'number',
                    type: 'number',
              admin: {
                width: '15%',
                step: 1,
              },
                },
                {
                    name: 'title',
                    type: 'text',
              admin: {
                width: '40%',
              },
                },
                {
                    name: 'value',
                    type: 'number',
              admin: {
                width: '25%',
                step: 0.01,
              },
                },
                {
                    name: 'operation',
                    type: 'select',
              admin: {
                width: '20%',
              },
                    options: [
                {
                  label: 'Add',
                  value: 'add',
                },
                {
                  label: 'Subtract',
                  value: 'subtract',
                },
                {
                  label: 'Multiply',
                  value: 'multiply',
                },
                {
                  label: 'Divide',
                  value: 'divide',
                },
                    ],
                    defaultValue: 'add',
            },
            // Government-specific fields for each line item
            {
              name: 'accountCode',
              type: 'text',
              admin: {
                description: 'Government accounting code',
              }
            },
            {
              name: 'fiscalPeriod',
              type: 'text',
              admin: {
                description: 'Fiscal period (e.g., Q1 2023)',
              }
                },
            ],
        },
      ],
    },
    // Final calculations to combine groups
    {
      name: 'finalCalculations',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'number',
          admin: {
            width: '15%',
            step: 1,
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            width: '35%',
          },
        },
        {
          name: 'operation',
          type: 'select',
          admin: {
            width: '20%',
          },
          options: [
            {
              label: 'Add',
              value: 'add',
            },
            {
              label: 'Subtract',
              value: 'subtract',
            },
            {
              label: 'Multiply',
              value: 'multiply',
            },
            {
              label: 'Divide',
              value: 'divide',
            },
            {
              label: 'Group Reference',
              value: 'groupRef',
            },
          ],
          defaultValue: 'add',
        },
        {
          name: 'value',
          type: 'number',
          admin: {
            width: '30%',
            condition: (data) => data.operation !== 'groupRef',
            step: 0.01,
          },
        },
        {
          name: 'groupReference',
          type: 'number',
          admin: {
            width: '30%',
            condition: (data) => data.operation === 'groupRef',
            step: 1,
            description: 'Zero-based index of the group',
          },
        },
      ],
    },
    // Audit trail for changes
    {
      name: 'auditTrail',
      type: 'array',
      admin: {
        readOnly: true,
        initCollapsed: true,
      },
      fields: [
        {
          name: 'action',
          type: 'text',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'user',
          type: 'text',
          required: true,
        },
        {
          name: 'changes',
          type: 'json',
        },
      ],
    },
    // Relationship with user who created the record
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Log changes to financing records
      async ({ req, data, operation, originalDoc }) => {
        console.log('Financing beforeChange hook triggered:', { operation });
        
        if (!req.user) {
          console.log('No user in request, skipping audit');
          return data;
        }
  
        // For new records, we'll create an audit entry after they're created
        if (operation === 'create') {
          console.log('Create operation, audit will be created in afterChange hook');
          return data;
        }
        
        try {
          // Check for approval state changes
          if (originalDoc && data.approvalState !== originalDoc.approvalState) {
            console.log('Approval state changed, creating audit entry', {
              from: originalDoc.approvalState,
              to: data.approvalState
            });
            
            await createAuditEntry(req.payload, {
              action: 'state_change',
              recordId: originalDoc.id,
              financingTitle: originalDoc.title,
              userId: req.user.id,
              previousState: originalDoc.approvalState,
              newState: data.approvalState,
              notes: `Status changed from ${originalDoc.approvalState || 'draft'} to ${data.approvalState}`
            });
          } else {
            // Process generic update
            // Compute changes by comparing fields
            const changes = computeChanges(originalDoc, data);
            
            // If there are notable changes, log them
            if (Object.keys(changes).length > 0) {
              console.log('Fields changed, creating audit entry', {
                changedFields: Object.keys(changes),
                recordId: originalDoc.id
              });
              
              await createAuditEntry(req.payload, {
                action: 'update',
                recordId: originalDoc.id,
                financingTitle: originalDoc.title,
                userId: req.user.id,
                changes
              });
            } else {
              console.log('No significant changes detected, skipping audit');
            }
          }
        } catch (error) {
          console.error('Error creating audit log:', error);
          // Continue with the operation even if logging fails
        }
  
        return data;
      }
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        console.log('Financing afterChange hook triggered:', { operation, recordId: doc.id });
        
        // For new records, create the initial audit entry
        if (operation === 'create' && req.user) {
          try {
            console.log('Creating audit entry for new record', { recordId: doc.id });
            
            await createAuditEntry(req.payload, {
              action: 'create',
              recordId: doc.id,
              financingTitle: doc.title,
              userId: req.user.id,
              notes: 'Financing record created'
            });
          } catch (error) {
            console.error('Error creating audit log for new record:', error);
          }
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        console.log('Financing beforeDelete hook triggered:', { id });
        
        if (!req.user) {
          console.log('No user in request, skipping audit');
          return;
        }
        
        try {
          // Get the record before deletion to preserve its title
          const record = await req.payload.findByID({
            collection: 'financing',
            id
          });
          
          console.log('Creating audit entry for record deletion', { 
            recordId: id, 
            title: record.title 
          });
          
          // Log the deletion
          await createAuditEntry(req.payload, {
            action: 'delete',
            recordId: id,
            financingTitle: record.title,
            userId: req.user.id,
            notes: 'Financing record deleted'
          });
        } catch (error) {
          console.error('Error creating audit log for deletion:', error);
          // Continue with deletion even if logging fails
        }
      }
    ]
  },
};

// Helper function to compute what fields changed between versions
function computeChanges(oldDoc, newDoc) {
  const changes: { [key: string]: any } = {}; // Initialize with type
  
  // Check top-level fields
  const fieldsToCheck = [
    'title', 'description', 'budgetedAmount', 'accountType', 
    'fiscalYear', 'budgetReference', 'departmentCode', 'justification'
  ];
  
  fieldsToCheck.forEach(field => {
    if (oldDoc[field] !== newDoc[field]) {
      changes[field] = {
        old: oldDoc[field],
        new: newDoc[field]
      };
    }
  });
  
  // For complex fields like groups, we just note if they changed
  // rather than storing the entire structure
  if (JSON.stringify(oldDoc.groups || []) !== JSON.stringify(newDoc.groups || [])) {
    changes.groups = {
      changed: true,
      oldCount: (oldDoc.groups || []).length,
      newCount: (newDoc.groups || []).length
    };
  }
  
  if (JSON.stringify(oldDoc.finalCalculations || []) !== JSON.stringify(newDoc.finalCalculations || [])) {
    changes.finalCalculations = {
      changed: true,
      oldCount: (oldDoc.finalCalculations || []).length,
      newCount: (newDoc.finalCalculations || []).length
    };
  }
  
  return changes;
}

export default Financing; 