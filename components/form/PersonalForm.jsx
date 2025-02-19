import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save, User, Mail, Home, HeartPulse, Building } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  photo: z.any().optional(),
  name: z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    fullName: z.string(),
  }),
  contact: z.object({
    emailAddress: z.string().email("Invalid email address"),
    localAddress: z.string().min(1, "Local address is required"),
  }),
  demographics: z.object({
    sex: z.enum(["male", "female", "other"], {
      required_error: "Please select a sex",
    }),
    birthDate: z.string().min(1, "Birth date is required"),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
      required_error: "Please select a marital status",
    }),
  }),
  status: z.object({
    residencyStatus: z.enum(["renting", "own-mortgage", "own-outright"], {
      required_error: "Please select a residency status",
    }),
  }),
});

export default function PersonalForm({ defaultValues, onSubmit, submitText = "Submit Record", cancelRoute }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
        fullName: "",
      },
      contact: {
        emailAddress: "",
        localAddress: "",
      },
      demographics: {
        sex: "",
        birthDate: "",
        maritalStatus: "",
      },
      status: {
        residencyStatus: "",
        lifeStatus: "alive",
      },
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("json", JSON.stringify(data));
      
      if (data.photo?.[0]) {
        formData.append("photo", data.photo[0]);
      }

      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mx-auto space-y-8">
        {/* Photo Upload Section */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className="space-y-4 flex">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      {field.value?.url ? (
                        <AvatarImage src={field.value.url} alt="Profile photo" />
                      ) : (
                        <AvatarFallback className="bg-primary/10">
                          <User className="w-12 h-12 text-primary/80" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <FileUpload
                      onFileSelect={(file) => field.onChange(file)}
                      value={field.value}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                      }}
                      maxSize={5 * 1024 * 1024}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="name.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="demographics.sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demographics.birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="contact.emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.localAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local Address</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              Status Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="demographics.maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status.residencyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residency Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select residency status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="renting">Renting</SelectItem>
                        <SelectItem value="own-mortgage">Own with Mortgage</SelectItem>
                        <SelectItem value="own-outright">Own Outright</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={cancelRoute}
            className="w-32"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-32"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}