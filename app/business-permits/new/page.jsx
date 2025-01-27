"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { Textarea } from "@/components/ui/textarea";
import { businessPermitRequestSchema } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";
const NewBusinessPermit = () => {
  const navigate = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(businessPermitRequestSchema),
    defaultValues: {
      businessData: {
        businessName: "",
        address: "",
        typeOfOwnership: "sole proprietorship",
        owners: [],
        businessContactNo: [],
        businessEmailAddress: "",
        status: "pending",
        supportingDocuments: [],
      },
      officialReceiptNo: "",
      issuedTo: "",
      amount: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Business permit request submitted successfully",
      });
      navigate.push("/business-permits");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit business permit request",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="New Business Permit Request"
        breadcrumbs={[
          { label: "Business Permits", href: "/business-permits" },
          { label: "New Request" },
        ]}
      />

<div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>

              <FormField
                control={form.control}
                name="businessData.businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessData.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessData.typeOfOwnership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Ownership</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessData.businessEmailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporting Documents</h3>
              <DynamicSupportingDocument control={form.control} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate.push("/business-permits")}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default NewBusinessPermit;
