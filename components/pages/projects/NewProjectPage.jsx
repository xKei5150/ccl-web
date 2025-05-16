'use client'

import { ProjectForm } from './ProjectForm'
import { createProject } from '@/app/(app)/dashboard/projects/actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { PageHeader } from '@/components/layout/PageHeader'
import { BadgePlus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (data) => {
    try {
      const response = await createProject(data)
      if (!response.success) {
        throw new Error(response.message)
      }
      toast({
        title: 'Success',
        description: 'Project created successfully',
        variant: 'success',
      })
      router.push('/dashboard/projects')
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create project: ${error.message}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="New Project"
        subtitle="Fill in the form below to create a new project"
        icon={<BadgePlus className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/projects')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </PageHeader>
      <div className="max-w-6xl mx-auto">
        <ProjectForm
          onSubmit={onSubmit}
          submitText="Create Project"
          cancelRoute={() => router.push('/dashboard/projects')}
        />
      </div>
    </div>
  )
} 