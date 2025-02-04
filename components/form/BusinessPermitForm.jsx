// BusinessPermitForm.jsx
"use client";

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

const BusinessPermitForm = ({
  defaultValues,
  onSubmit,
  submitText = "Submit Request",
  cancelRoute, // Callback function for cancel (e.g. navigate back)
}) => {
  const form = useForm({
    resolver: zodResolver(businessPermitRequestSchema),
    defaultValues,
  });

  // Manage dynamic owners field array.
  const { fields: ownerFields, append: appendOwner, remove: removeOwner } =
    useFieldArray({
      control: form.control,
      name: "businessData.owners",
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Business Information Section */}
        <div className="bg-white shadow p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessData.businessName"
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
              name="businessData.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter business address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Date */}
            <FormField
              control={form.control}
              name="businessData.registrationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Eligibility Date */}
            <FormField
              control={form.control}
              name="businessData.eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type of Ownership */}
            <FormField
              control={form.control}
              name="businessData.typeOfOwnership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Ownership</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type of ownership" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sole proprietorship">
                        Sole Proprietorship
                      </SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditionally render type of corporation if ownership is corporation */}
            {form.watch("businessData.typeOfOwnership") === "corporation" && (
              <FormField
                control={form.control}
                name="businessData.typeOfCorporation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Corporation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              name="businessData.businessContactNo"
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
              name="businessData.businessEmailAddress"
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
          </div>

          {/* Dynamic Owners */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Owner(s)</h3>
            <div className="space-y-4">
              {ownerFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`businessData.owners.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Owner {index + 1}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter owner name" />
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
        </div>

        {/* Supporting Documents Section */}
        <div className="bg-white shadow p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Supporting Documents</h2>
          <DynamicSupportingDocument control={form.control} />
        </div>

        {/* Permit Details Section */}
        <div className="bg-white shadow p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Permit Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Validity Date */}
            <FormField
              control={form.control}
              name="validity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Official Receipt No */}
            <FormField
              control={form.control}
              name="officialReceiptNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Receipt No</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter receipt number"
                    />
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
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => cancelRoute && cancelRoute()}>
            Cancel
          </Button>
          <Button type="submit">{submitText}</Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessPermitForm;
