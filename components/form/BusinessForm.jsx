// BusinessPermitForm.jsx
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";

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
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4"></div>
              {/* Business Information Section */}
              <h2 className="text-xl font-semibold mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
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
                      <FormLabel>Business Address</FormLabel>
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
                      <FormLabel>Registration Date</FormLabel>
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
                      <FormLabel>Type of Ownership</FormLabel>
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
                        <FormLabel>Type of Corporation</FormLabel>
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
                      <FormLabel>Business Contact No</FormLabel>
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
                      <FormLabel>Business Email Address</FormLabel>
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
                      <FormLabel>Status</FormLabel>
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

              {/* Dynamic Owners */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Owner(s)</h3>
                <div className="space-y-4">
                  {ownerFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`owners.${index}.ownerName`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Owner {index + 1}</FormLabel>
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
                      <Button type="button" onClick={() => removeOwner(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendOwner("")}
                  >
                    Add Owner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {/* Supporting Documents Section */}
              <div className="bg-white shadow p-6 rounded-md">
                <h2 className="text-xl font-semibold mb-4">
                  Supporting Documents
                </h2>
                <DynamicSupportingDocument control={form.control} />
              </div>
            </CardContent>
          </Card>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => cancelRoute && cancelRoute()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default BusinessForm;
