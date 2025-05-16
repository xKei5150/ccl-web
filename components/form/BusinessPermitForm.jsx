// BusinessPermitForm.jsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Building, Calendar, Receipt, User, BanknoteIcon, Tag, ClipboardList, FileText, X, Save } from "lucide-react";
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
  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Business Information</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="business.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      Business
                    </FormLabel>
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
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <CardTitle>Permit Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4"></div>
              {/* Business Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Validity Date
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

                {/* Payment Date */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Payment Date
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

                {/* Official Receipt Number */}
                <FormField
                  control={form.control}
                  name="officialReceiptNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        Official Receipt No.
                      </FormLabel>
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
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Issued To
                      </FormLabel>
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
                      <FormLabel className="flex items-center gap-2">
                        <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                        Amount
                      </FormLabel>
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
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => cancelRoute && cancelRoute()}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
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
    </main>
  );
};

export default BusinessForm;
