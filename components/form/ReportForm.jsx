"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Plus, Trash2, Calendar, MapPin, MessageCircle, Tag, AlignLeft, Users, FileText, X, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  involvedPersons: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    statement: z.string().optional(),
    personalInfo: z.string().optional(),
  })),
  supportingDocuments: z.array(z.any()),
  reportStatus: z.enum(["open", "inProgress", "closed"]).default("open"),
});

export default function ReportForm({
  defaultValues = {
    title: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    location: "",
    involvedPersons: [],
    supportingDocuments: [],
    reportStatus: "open"
  },
  onSubmit,
  submitText = "Submit Report",
  cancelRoute,
}) {
  // Normalize the defaultValues for proper initialization
  const normalizedDefaultValues = {
    ...defaultValues,
    // Format date properly if it exists
    date: defaultValues.date ? new Date(defaultValues.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    // Ensure involvedPersons is properly formatted
    involvedPersons: Array.isArray(defaultValues.involvedPersons) ? defaultValues.involvedPersons : [],
    // Ensure supportingDocuments is properly formatted
    supportingDocuments: Array.isArray(defaultValues.supportingDocuments) ? defaultValues.supportingDocuments : [],
  };

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: normalizedDefaultValues,
  });

  const { fields: involvedPersonFields, append: appendPerson, remove: removePerson } = useFieldArray({
    control: form.control,
    name: "involvedPersons"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize involvedPersons if form is loaded for editing and there are none
  useEffect(() => {
    if (normalizedDefaultValues.id && !involvedPersonFields.length && normalizedDefaultValues.involvedPersons.length > 0) {
      // Reset the form with the normalized values
      form.reset(normalizedDefaultValues);
    }
  }, [normalizedDefaultValues, form, involvedPersonFields.length]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // When updating, ensure we maintain the original ID
      const submitData = {
        ...data,
        id: defaultValues.id, // Keep the ID for updates
      };
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Report Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <AlignLeft className="h-4 w-4 text-muted-foreground" />
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter report title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Date
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter report description"
                        className="min-h-[100px] resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Involved Party</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendPerson({
                    name: "",
                    role: "",
                    statement: "",
                    personalInfo: ""
                  })}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Person
                </Button>
              </div>

              {involvedPersonFields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`involvedPersons.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter person's name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`involvedPersons.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              Role
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="complainant">Complainant</SelectItem>
                                <SelectItem value="respondent">Respondent</SelectItem>
                                <SelectItem value="witness">Witness</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`involvedPersons.${index}.statement`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
                              Statement
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter person's statement"
                                className="resize-y"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-4 flex items-center gap-2"
                      onClick={() => removePerson(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Person
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Supporting Documents</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <DynamicSupportingDocument control={form.control} />
          </CardContent>
        </Card>

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
  );
}
