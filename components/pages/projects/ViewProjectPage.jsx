'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProjectById, deleteProject, getFinancingOptions } from '@/app/(app)/dashboard/projects/actions'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { PageHeader } from '@/components/layout/PageHeader'
import { InfoItem } from '@/components/ui/info-item'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ClipboardList, Users } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function ViewProjectPage({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [financing, setFinancing] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectResponse, financingOptions] = await Promise.all([
          getProjectById(id),
          getFinancingOptions()
        ])
        
        if (!projectResponse.success) {
          throw new Error(projectResponse.message)
        }
        
        setProject(projectResponse.data)
        
        if (projectResponse.data.relatedFinancing) {
          const relatedFinancing = financingOptions.find(
            option => option.value === projectResponse.data.relatedFinancing
          )
          setFinancing(relatedFinancing)
        }
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

    fetchData()
  }, [id, toast])

  const handleDelete = async () => {
    try {
      const response = await deleteProject([id])
      if (!response.success) {
        throw new Error(response.message)
      }
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
        variant: 'success',
      })
      router.push('/dashboard/projects')
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete project: ${error.message}`,
        variant: 'destructive',
      })
    }
  }

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

  if (loading) {
    return <div>Loading...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <>
      <PageHeader
        title="View Project"
        subtitle="View details of a project"
        icon={<ClipboardList className="h-8 w-8" />}
      />
      <div className="grid gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Project Information</CardTitle>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/dashboard/projects/${id}/edit`}>Edit</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this project? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Title" value={project.title} />
              <InfoItem
                label="Status"
                value={project.status?.replace('_', ' ')}
                valueClassName={cn(
                  'inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize',
                  getStatusStyle(project.status)
                )}
              />
              <InfoItem
                label="Type"
                value={project.projectType?.replace('_', ' ')}
                valueClassName="capitalize"
              />
              <InfoItem
                label="Start Date"
                value={project.startDate ? format(new Date(project.startDate), 'PPP') : 'Not specified'}
              />
              <InfoItem
                label="End Date"
                value={project.endDate ? format(new Date(project.endDate), 'PPP') : 'Not specified'}
              />
              <InfoItem label="Location" value={project.location || 'Not specified'} />
              <InfoItem
                label="Description"
                value={project.description || 'No description provided'}
                className="col-span-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <InfoItem label="Project Lead" value={project.projectLead || 'Not specified'} />
            
            {project.teamMembers && project.teamMembers.length > 0 ? (
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Team Members</h3>
                <div className="grid gap-4">
                  {project.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <InfoItem label="Name" value={member.name} />
                        <InfoItem label="Role" value={member.role} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                <Users className="h-8 w-8 mb-2" />
                <p>No team members added</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Related Financing</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoItem
              label="Budget/Financing"
              value={financing ? financing.label : 'Not specified'}
            />
          </CardContent>
        </Card>

        {project.projectType === 'event' && project.eventDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Expected Attendees"
                  value={project.eventDetails.expectedAttendees || 'Not specified'}
                />
                <InfoItem
                  label="Actual Attendees"
                  value={project.eventDetails.actualAttendees || 'Not specified'}
                />
                <InfoItem
                  label="Attendee Notes"
                  value={project.eventDetails.attendeeNotes || 'No notes provided'}
                  className="col-span-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {project.projectType === 'infrastructure' && project.infrastructureDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Infrastructure Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Contractor"
                  value={project.infrastructureDetails.contractor || 'Not specified'}
                />
                <InfoItem
                  label="Completion Percentage"
                  value={`${project.infrastructureDetails.completionPercentage || 0}%`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {project.projectType === 'program' && project.programDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <InfoItem
                  label="Target Beneficiaries"
                  value={project.programDetails.targetBeneficiaries || 'Not specified'}
                />
                <InfoItem
                  label="Key Performance Indicators"
                  value={project.programDetails.keyPerformanceIndicators || 'Not specified'}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
} 