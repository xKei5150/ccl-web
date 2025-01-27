"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Card, CardContent } from "@/components/ui/card";
import { generalRequestSchema } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import DynamicSupportingDocument from "@/components/fields/DynamicSupportingDocument";

const NewGeneralRequest = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(generalRequestSchema),
    defaultValues: {
      type: "indigencyCertificate",
      status: "pending",
      personalData: {
        firstName: "",
        lastName: "",
        emailAddress: "",
        localAddress: "",
        sex: "male",
        citizenship: "Filipino",
        maritalStatus: "single",
        residencyStatus: "living with family/relatives",
        lifeStatus: "alive",
        contactNo: [],
      },
      supportingDocuments: [],
      indigencyCertificate: {
        purpose: "",
      },
      barangayClearance: {
        purpose: "",
      },
      barangayResidency: {
        purpose: "",
        duration: "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "General request submitted successfully",
      });
      router.push("/requests/general-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit general request",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="New General Request"
        breadcrumbs={[
          { label: "Requests", href: "/requests" },
          { label: "General Requests", href: "/requests/general-requests" },
          { label: "New Request" },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select request type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="indigencyCertificate">
                              Indigency Certificate
                            </SelectItem>
                            <SelectItem value="barangayClearance">
                              Barangay Clearance
                            </SelectItem>
                            <SelectItem value="barangayResidency">
                              Barangay Residency
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalData.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalData.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalData.emailAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalData.localAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
  <h3 className="text-lg font-semibold">Supporting Documents</h3>
  <DynamicSupportingDocument control={form.control} />
</div>

            <div className="flex justify-end space-x-4 bottom-0 bg-background p-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/general-requests")}
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

export default NewGeneralRequest;
