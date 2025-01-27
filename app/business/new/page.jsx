"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  owner: z.string().min(1, "Owner name is required"),
  businessEmail: z.string().email("Invalid email address"),
});

export default function NewBusinessRecord() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      address: "",
      owner: "",
      businessEmail: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      toast({
        title: "Success",
        description: "Business record created successfully",
      });
      router.push("/business");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create business record",
        variant: "destructive",
      });
    }
  };

  return (
    <>
        <PageHeader
          title="New Business Record"
          breadcrumbs={[
            { href: "/records", label: "Records" },
            { href: "/records/business", label: "Business Records" },
            { label: "New Record" },
          ]}
        />
        
        <div className="max-w-2xl mx-auto mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/business")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Record</Button>
              </div>
            </form>
          </Form>
        </div>
        </>
  );
}