"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generalRequestSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfoSelect } from "./PersonalInfoSelect";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";
import { z } from "zod";

const requestTypeMap = {
  indigencyCertificate: "Indigency Certificate",
  barangayClearance: "Barangay Clearance",
  barangayResidency: "Barangay Residency",
};

const requestSchema = z.object({
  type: z.enum(['indigencyCertificate', 'barangayClearance', 'barangayResidency']),
  person: z.number(),
  purpose: z.string().min(1, 'Purpose is required'),
  supportingDocuments: z.array(z.any()),
  status: z.enum(['pending', 'processing', 'approved', 'rejected', 'completed'])
    .default('pending')
});

export default function GeneralRequestForm({
  defaultValues = {
    type: "",
    person: "",
    purpose: "",
    supportingDocuments: [],
    status: "pending",
  },
  onSubmit,
  submitText = "Submit Request",
  cancelRoute,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userPersonalInfo, setUserPersonalInfo] = useState(null);
  const form = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      ...defaultValues,
      person: defaultValues.person?.id || defaultValues.person
    },
  });

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setUserRole(data.user.role);
        
        // If user is a citizen, get their personal info and set form value
        if (!['admin', 'staff'].includes(data.user.role)) {
          const personalInfoResponse = await fetch(`/api/personal-information/${data.user.personalInfo.id}`);
          const personalInfo = await personalInfoResponse.json();
          setUserPersonalInfo(personalInfo);
          // Set the person field value with the ID
          form.setValue('person', data.user.personalInfo.id);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    getUserInfo();
  }, [form]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("defaultValues", defaultValues);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(requestTypeMap).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Information</FormLabel>
                    <FormControl>
                      {['admin', 'staff'].includes(userRole) ? (
                        <PersonalInfoSelect 
                          onSelect={field.onChange} 
                          defaultValue={field.value} 
                        />
                      ) : (
                        <div className="w-full p-2 border rounded-md bg-muted">
                          <input 
                            type="hidden" 
                            {...field} 
                          />
                          {userPersonalInfo ? userPersonalInfo.name.fullName : 'Loading...'}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter purpose of request"
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
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Supporting Documents</h3>
            <DynamicSupportingDocument control={form.control} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={cancelRoute}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
