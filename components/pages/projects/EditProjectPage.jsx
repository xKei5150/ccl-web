'use client'

import { ProjectForm } from './ProjectForm'
import { getProjectById, updateProject } from '@/app/(app)/dashboard/projects/actions'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { PageHeader } from '@/components/layout/PageHeader'
import { FilePenLine } from 'lucide-react'

export function EditProjectPage({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await getProjectById(id)
        if (!response.success) {
          throw new Error(response.message)
        }
        setProject(response.data)
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to fetch project: ${error.message}`,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, toast])

  const onSubmit = async (data) => {
    try {
      const response = await updateProject({ id, data })
      if (!response.success) {
        throw new Error(response.message)
      }
      toast({
        title: 'Success',
        description: 'Project updated successfully',
        variant: 'success',
      })
      router.push('/dashboard/projects')
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update project: ${error.message}`,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container py-4">
      <PageHeader
        title="Edit Project"
        subtitle="Update the form below to edit the project"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <ProjectForm
        initialData={project}
        onSubmit={onSubmit}
        submitText="Update Project"
        cancelRoute={() => router.push('/dashboard/projects')}
      />
    </div>
  )
} 