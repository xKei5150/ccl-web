'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Trash2, 
  Users, 
  FileText, 
  Tag, 
  Calendar, 
  MapPin, 
  User, 
  ClipboardList, 
  Building, 
  BanknoteIcon,
  Percent,
  Target,
  BarChart,
  X,
  Save
} from 'lucide-react'
import { Combobox } from '@/components/ui/combo-box'
import { useEffect, useState } from 'react'
import { getFinancingOptions } from '@/app/(app)/dashboard/projects/actions'
import { Separator } from '@/components/ui/separator'

const projectTypes = [
  { label: 'Event', value: 'event' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Community Program', value: 'program' },
  { label: 'Administrative Initiative', value: 'initiative' },
  { label: 'Other', value: 'other' },
]

const projectStatuses = [
  { label: 'Planning', value: 'planning' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function ProjectForm({ initialData, onSubmit, submitText = "Submit", cancelRoute }) {
  const router = useRouter()
  const [financingOptions, setFinancingOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchFinancingOptions() {
      const options = await getFinancingOptions()
      setFinancingOptions(options)
    }
    fetchFinancingOptions()
  }, [])

  const form = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      projectType: initialData?.projectType || 'event',
      status: initialData?.status || 'planning',
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split('T')[0]
        : '',
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split('T')[0]
        : '',
      location: initialData?.location || '',
      projectLead: initialData?.projectLead || '',
      teamMembers: initialData?.teamMembers || [],
      relatedFinancing: initialData?.relatedFinancing || '',
      eventDetails: initialData?.eventDetails || {
        expectedAttendees: '',
        actualAttendees: '',
        attendeeNotes: '',
      },
      infrastructureDetails: initialData?.infrastructureDetails || {
        contractor: '',
        completionPercentage: 0,
      },
      programDetails: initialData?.programDetails || {
        targetBeneficiaries: '',
        keyPerformanceIndicators: '',
      },
    },
  })

  const {
    fields: teamMemberFields,
    append: appendTeamMember,
    remove: removeTeamMember,
  } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const projectType = form.watch('projectType')

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Team Information</CardTitle>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTeamMember({ name: '', role: '' })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Team Member
              </Button>
            </div>
            <Separator className="mt-3" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="projectLead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Project Lead
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name of the primary person responsible" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                {teamMemberFields.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                    <Users className="h-8 w-8 mb-2" />
                    <p>No team members added yet</p>
                  </div>
                ) : (
                  teamMemberFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`teamMembers.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Member Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Member name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`teamMembers.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                Role
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Role in project" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Financing */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-primary" />
              <CardTitle>Related Financing</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="relatedFinancing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                    Budget/Financing
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={financingOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select related financing..."
                      searchPlaceholder="Search financing..."
                      emptyMessage="No financing records found."
                      width="100vw"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Type-specific Details */}
        {projectType === 'event' && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Event Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="eventDetails.expectedAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Expected Attendees
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDetails.actualAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Actual Attendees
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="eventDetails.attendeeNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Attendance Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Registration details, observations, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {projectType === 'infrastructure' && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Infrastructure Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="infrastructureDetails.contractor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        Contractor/Vendor
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="infrastructureDetails.completionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        Completion Percentage
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {projectType === 'program' && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Program Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="programDetails.targetBeneficiaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        Target Beneficiaries
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programDetails.keyPerformanceIndicators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                        Key Performance Indicators (KPIs)
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="How will success be measured?" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={cancelRoute}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span>Submitting...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {submitText}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 