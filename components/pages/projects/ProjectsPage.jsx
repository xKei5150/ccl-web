'use client'

import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deleteProject } from '@/app/(app)/dashboard/projects/actions'
import DataPageLayout from '@/components/layout/DataPageLayout'

export function ProjectsPage({ data }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default: // planning
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Type',
      accessorKey: 'projectType',
      cell: (row) => (
        <span className="capitalize">
          {row.projectType?.replace('_', ' ') || 'N/A'}
        </span>
      ),
      enableSorting: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize',
            getStatusStyle(row.status)
          )}
        >
          {row.status?.replace('_', ' ') || 'N/A'}
        </span>
      ),
      enableSorting: true,
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : 'N/A',
      enableSorting: true,
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      cell: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString() : 'N/A',
      enableSorting: true,
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (row) => row.location || 'N/A',
    },
  ]

  return (
    <DataPageLayout
      title="Projects"
      subtitle="View and manage barangay projects"
      icon={ClipboardList}
      columns={columns}
      data={data}
      baseUrl="/dashboard/projects"
      newItemUrl="/dashboard/projects/new"
      deleteAction={deleteProject}
      newButtonLabel="New Project"
    />
  )
} 