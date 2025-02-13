// BusinessPermitForm.jsx
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessPermitRequestSchema } from "@/lib/schema";
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
import { Combobox } from "../ui/combo-box";
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
    business: {
      id: undefined,
    },
    validity: new Date(),
    paymentDate: new Date(),
    officialReceiptNo: "",
    issuedTo: "",
    amount: 0,
    status: "pending",
    supportingDocuments: [],
  },
  onSubmit,
  submitText = "Submit Permit",
  cancelRoute, // Callback function for cancel (e.g. navigate back)
  businesses,
}) => {
  const form = useForm({
    resolver: zodResolver(businessPermitRequestSchema),
    defaultValues: defaultValues,
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
              <FormField
                control={form.control}
                name="business.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business: </FormLabel>
                    <FormControl>
                      <Combobox
                        options={businesses.map((business) => ({
                          value: business.id,
                          label: business.businessName, // Assuming each business has a name field
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select a business..."
                        searchPlaceholder="Search business..."
                        emptyMessage="No business found."
                        width="100vw"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4"></div>
              {/* Business Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity Date</FormLabel>
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

                {/* Payment Date */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
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

                {/* Official Receipt Number */}
                <FormField
                  control={form.control}
                  name="officialReceiptNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Official Receipt No.</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter receipt number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Issued To */}
                <FormField
                  control={form.control}
                  name="issuedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issued To</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter recipient name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter amount"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <DynamicSupportingDocument
                  control={form.control}
                />
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
