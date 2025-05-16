'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { ProjectForm } from './ProjectForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { getProjectById, updateProject } from '@/app/(app)/dashboard/projects/actions'
import { PenSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EditProjectPage({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
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

  const handleSubmit = async (data) => {
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
      
      router.push(`/dashboard/projects/${id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update project: ${error.message}`,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading project data...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Edit Project"
        subtitle="Update project information"
        icon={<PenSquare className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push(`/dashboard/projects/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Button>
      </PageHeader>
      
      <div className="max-w-6xl mx-auto">
        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
          submitText="Update Project"
          cancelRoute={() => router.push(`/dashboard/projects/${id}`)}
        />
      </div>
    </div>
  )
} 