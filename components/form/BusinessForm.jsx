// BusinessPermitForm.jsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDataSchema } from "@/lib/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CircleCheck, 
  Users, 
  Mail, 
  Phone, 
  FileText, 
  Plus, 
  Trash2,
  User
} from "lucide-react";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";
import { Separator } from "@/components/ui/separator";

// Helper function to recursively convert nulls to empty strings or appropriate defaults
const defaultNullValues = (obj) => {
  if (obj === null || obj === undefined) {
    return ""; // Default to empty string for null/undefined
  }

  if (Array.isArray(obj)) {
    return obj.map(defaultNullValues); // Recursively process arrays
  }

  if (typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = defaultNullValues(obj[key]);
    }
    return newObj; // Recursively process objects
  }
  if (obj instanceof Date) {
    return obj; // Return the date itself if it's a date instance
  }
  return obj; // Return other values as-is
};

const BusinessForm = ({
  defaultValues = {
    businessName: "",
    address: "",
    registrationDate: new Date(),
    typeOfOwnership: "",
    typeOfCorporation: undefined,
    businessContactNo: "",
    businessEmailAddress: "",
    owners: [],
    supportingDocuments: [],
    status: "active",
  },
  onSubmit,
  submitText = "Submit Record",
  cancelRoute, // Callback function for cancel (e.g. navigate back)
}) => {
  const form = useForm({
    resolver: zodResolver(businessDataSchema),
    defaultValues: defaultValues,
  });

  // Manage dynamic owners field array.
  const {
    fields: ownerFields,
    append: appendOwner,
    remove: removeOwner,
  } = useFieldArray({
    control: form.control,
    name: "owners",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const DEBUG = process.env.NODE_ENV === "development"; 
  
  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {DEBUG && (
            <pre className="bg-gray-100 p-4 rounded-md">
              {JSON.stringify(form.formState.errors, null, 2)}
            </pre>
          )}    
          
          {/* Business Information Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Business Information</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter business name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Business Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter business address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Date */}
                <FormField
                  control={form.control}
                  name="registrationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Registration Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              new Date(e.target.value).toISOString()
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type of Ownership */}
                <FormField
                  control={form.control}
                  name="typeOfOwnership"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Type of Ownership
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type of ownership" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sole proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="cooperative">
                            Cooperative
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditionally render type of corporation if ownership is corporation */}
                {form.watch("typeOfOwnership") === "corporation" && (
                  <FormField
                    control={form.control}
                    name="typeOfCorporation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          Type of Corporation
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type of corporation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Business Contact No */}
                <FormField
                  control={form.control}
                  name="businessContactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Business Contact No
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="09XXXXXXXXX"
                          maxLength={11}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Email Address */}
                <FormField
                  control={form.control}
                  name="businessEmailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Business Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="email@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CircleCheck className="h-4 w-4 text-muted-foreground" />
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Owners */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Business Owner(s)</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendOwner({ ownerName: "" })}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Owner
                </Button>
              </div>
              <Separator className="mt-3" />
            </CardHeader>
            <CardContent className="space-y-4">
              {ownerFields.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No owners added yet
                </div>
              ) : (
                ownerFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="flex items-center gap-4 p-4 rounded-lg border bg-background/50"
                  >
                    <User className="h-5 w-5 text-muted-foreground" />
                    <FormField
                      control={form.control}
                      name={`owners.${index}.ownerName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Owner {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter owner name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOwner(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Supporting Documents */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Supporting Documents</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <DynamicSupportingDocument control={form.control} />
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => cancelRoute && cancelRoute()}
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  {submitText}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default BusinessForm;
