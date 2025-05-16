"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PersonalInfoSelect } from "./PersonalInfoSelect";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";
import { z } from "zod";
import { FileText, UserCheck, Clock, BanknoteIcon, User, ClipboardList, MessageSquare, Calendar, FileSearch } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const requestTypeMap = {
  indigencyCertificate: "Indigency Certificate",
  barangayClearance: "Barangay Clearance",
  barangayResidency: "Barangay Residency",
};

const additionalInfoSchema = z.object({
  forWhom: z.string().optional(),
  remarks: z.string().optional(),
  duration: z.string().optional(),
});

const ctcDetailsSchema = z.object({
  ctcNo: z.string().optional(),
  ctcDateIssued: z.string().optional(),
  ctcAmount: z.string().optional(),
  ctcPlaceIssued: z.string().optional(),
});

const requestSchema = z.object({
  type: z.enum(['indigencyCertificate', 'barangayClearance', 'barangayResidency']),
  person: z.number(),
  purpose: z.string().min(1, 'Purpose is required'),
  additionalInformation: additionalInfoSchema.optional(),
  certificateDetails: z.object({
    ctcDetails: ctcDetailsSchema.optional(),
  }).optional(),
  supportingDocuments: z.array(z.any()),
  status: z.enum(['pending', 'processing', 'approved', 'rejected', 'completed'])
    .default('pending')
});

export default function GeneralRequestForm({
  defaultValues = {
    type: "",
    person: "",
    purpose: "",
    additionalInformation: {},
    certificateDetails: {
      ctcDetails: {},
    },
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
  const [requestType, setRequestType] = useState(defaultValues.type || "");
  
  const form = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      ...defaultValues,
      person: defaultValues.person?.id || defaultValues.person,
      additionalInformation: defaultValues.additionalInformation || {},
      certificateDetails: defaultValues.certificateDetails || { ctcDetails: {} }
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

  // Watch for changes in request type to show appropriate additional fields
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        setRequestType(value.type);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show CTC fields for barangayClearance and barangayResidency
  const showCTCFields = requestType === "barangayClearance" || requestType === "barangayResidency";
  const isAdminOrStaff = ['admin', 'staff'].includes(userRole);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Request Information</h3>
            </div>
            <Separator className="mb-4" />
            
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      Request Type
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRequestType(value);
                      }} 
                      value={field.value}
                    >
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
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Personal Information
                    </FormLabel>
                    <FormControl>
                      {isAdminOrStaff ? (
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
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Purpose
                    </FormLabel>
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

              {/* Additional Information based on request type */}
              {requestType === "indigencyCertificate" && (
                <FormField
                  control={form.control}
                  name="additionalInformation.forWhom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        For Whom (Beneficiary)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="If medical assistance, specify beneficiary (leave empty if for self)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {requestType === "barangayClearance" && (
                <FormField
                  control={form.control}
                  name="additionalInformation.remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Additional remarks or notes"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {requestType === "barangayResidency" && (
                <FormField
                  control={form.control}
                  name="additionalInformation.duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Duration of Residency
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="E.g., 5 years, since 2010, etc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isAdminOrStaff && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileSearch className="h-4 w-4 text-muted-foreground" />
                        Status
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTC Details Section - Only for Barangay Clearance and Residency */}
        {showCTCFields && isAdminOrStaff && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BanknoteIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Community Tax Certificate Details</h3>
              </div>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="certificateDetails.ctcDetails.ctcNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTC Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter CTC Number" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certificateDetails.ctcDetails.ctcAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTC Amount</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter amount (e.g., 100.00)" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certificateDetails.ctcDetails.ctcDateIssued"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        CTC Date Issued
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certificateDetails.ctcDetails.ctcPlaceIssued"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTC Place Issued</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter place of issuance" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Supporting Documents</h3>
            </div>
            <Separator className="mb-4" />
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
