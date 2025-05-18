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
import { useAuth } from '@/hooks/use-auth'
import { 
  ClipboardList, 
  Users, 
  ArrowLeft, 
  Trash2, 
  PenSquare, 
  Calendar, 
  Tag, 
  MapPin, 
  FileText, 
  User, 
  Briefcase, 
  Building, 
  Percent, 
  Target, 
  BarChart, 
  BanknoteIcon,
  ExternalLink 
} from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
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
  const { isAdmin, isStaff } = useAuth()
  const hasAdminAccess = isAdmin || isStaff
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
          // Check if relatedFinancing is a string ID or an object with an id
          const financingId = typeof projectResponse.data.relatedFinancing === 'string' 
            ? projectResponse.data.relatedFinancing 
            : projectResponse.data.relatedFinancing.id;

          const relatedFinancing = financingOptions.find(
            option => option.value === financingId
          )
          
          if (relatedFinancing) {
          setFinancing(relatedFinancing)
          } else {
            // If we couldn't find it in the options, create a basic entry from the data
            const financingData = typeof projectResponse.data.relatedFinancing === 'object' 
              ? projectResponse.data.relatedFinancing
              : null;
            
            if (financingData) {
              setFinancing({
                label: `${financingData.title || 'Unknown'} ${financingData.fiscalYear ? `(${financingData.fiscalYear})` : ''}`,
                value: financingData.id
              });
            }
          }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={project.title}
        subtitle="Project Details"
        icon={<ClipboardList className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>

          <Button
            onClick={() => router.push(`/dashboard/projects/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Project
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
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
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Project Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                label={
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Title</span>
                  </div>
                } 
                value={project.title} 
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                }
                value={project.status?.replace('_', ' ')}
                valueClassName={cn(
                  'inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize',
                  getStatusStyle(project.status)
                )}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Type</span>
                  </div>
                }
                value={project.projectType?.replace('_', ' ')}
                valueClassName="capitalize"
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start Date</span>
                  </div>
                }
                value={project.startDate ? format(new Date(project.startDate), 'PPP') : 'Not specified'}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>End Date</span>
                  </div>
                }
                value={project.endDate ? format(new Date(project.endDate), 'PPP') : 'Not specified'}
              />
              <InfoItem 
                label={
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location</span>
                  </div>
                } 
                value={project.location || 'Not specified'} 
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Description</span>
                  </div>
                }
                value={project.description || 'No description provided'}
                className="col-span-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Team Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <InfoItem 
              label={
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Project Lead</span>
                </div>
              } 
              value={project.projectLead || 'Not specified'} 
            />
            
            {project.teamMembers && project.teamMembers.length > 0 ? (
              <div className="grid gap-4">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Team Members</span>
                </h3>
                <div className="grid gap-4">
                  {project.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <InfoItem 
                          label={
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Name</span>
                            </div>
                          } 
                          value={member.name} 
                        />
                        <InfoItem 
                          label={
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>Role</span>
                            </div>
                          } 
                          value={member.role} 
                        />
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
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-primary" />
              <CardTitle>Related Financing</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <InfoItem
              label={
                <div className="flex items-center gap-2">
                  <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Budget/Financing</span>
                </div>
              }
              value={
                hasAdminAccess && financing?.value ? (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left font-normal hover:underline"
                    onClick={() => router.push(`/dashboard/financing/${financing.value}`)}
                  >
                    <span className="mr-1">{financing.label}</span>
                    <ExternalLink className="h-3 w-3 inline" />
                  </Button>
                ) : (
                  financing ? financing.label : (
                    project.relatedFinancing && typeof project.relatedFinancing === 'object' && project.relatedFinancing.title
                    ? `${project.relatedFinancing.title} ${project.relatedFinancing.fiscalYear ? `(${project.relatedFinancing.fiscalYear})` : ''}`
                    : 'Not specified'
                  )
                )
              }
            />
          </CardContent>
        </Card>

        {project.projectType === 'event' && project.eventDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Event Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Expected Attendees</span>
                    </div>
                  }
                  value={project.eventDetails.expectedAttendees || 'Not specified'}
                />
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Actual Attendees</span>
                    </div>
                  }
                  value={project.eventDetails.actualAttendees || 'Not specified'}
                />
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Attendee Notes</span>
                    </div>
                  }
                  value={project.eventDetails.attendeeNotes || 'No notes provided'}
                  className="col-span-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {project.projectType === 'infrastructure' && project.infrastructureDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Infrastructure Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Contractor</span>
                    </div>
                  }
                  value={project.infrastructureDetails.contractor || 'Not specified'}
                />
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span>Completion Percentage</span>
                    </div>
                  }
                  value={`${project.infrastructureDetails.completionPercentage || 0}%`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {project.projectType === 'program' && project.programDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Program Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>Target Beneficiaries</span>
                    </div>
                  }
                  value={project.programDetails.targetBeneficiaries || 'Not specified'}
                />
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      <span>Key Performance Indicators</span>
                    </div>
                  }
                  value={project.programDetails.keyPerformanceIndicators || 'Not specified'}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Objective</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <InfoItem
              label={
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>Objective</span>
                </div>
              }
              value={project.objective}
            />
            {financing && (
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Related Financing</span>
                  </div>
                }
                value={
                  hasAdminAccess ? (
                    <Link 
                      href={`/dashboard/financing/${financing.value}`} 
                      className="text-primary hover:underline flex items-center"
                    >
                      {financing.label} <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  ) : (
                    financing.label
                  )
                }
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 