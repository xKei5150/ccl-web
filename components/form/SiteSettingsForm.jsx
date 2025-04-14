"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, GanttChart, Building, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  logo: z.any().optional(),
  favicon: z.any().optional(),
  description: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  heroImage: z.any().optional(),
  authImage: z.any().optional(),
});

export default function SiteSettingsForm({ defaultValues, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: defaultValues || {
      siteName: "",
      logo: null,
      favicon: null,
      description: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      heroImage: null,
      authImage: null,
    },
  });

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <GanttChart className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="visuals" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Visuals</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Update your site's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter site name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter site description" rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visuals">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Visual Elements</CardTitle>
                <CardDescription>Upload and manage your site's images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            onFileSelect={(file) => field.onChange(file)}
                            value={field.value}
                            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
                            onRemove={() => field.onChange(null)}
                            previewSize="small"
                          />
                        </FormControl>
                        <FormDescription>Recommended size: 200x200px</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="favicon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon</FormLabel>
                        <FormControl>
                          <FileUpload
                            onFileSelect={(file) => field.onChange(file)}
                            value={field.value}
                            accept={{ "image/*": [".png", ".ico"] }}
                            onRemove={() => field.onChange(null)}
                            previewSize="small"
                          />
                        </FormControl>
                        <FormDescription>16x16px or 32x32px (.ico or .png)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name="heroImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          onFileSelect={(file) => field.onChange(file)}
                          value={field.value}
                          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
                          onRemove={() => field.onChange(null)}
                          previewSize="medium"
                        />
                      </FormControl>
                      <FormDescription>Recommended size: 1920x1080px, will be displayed on the dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name="authImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auth Background Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          onFileSelect={(file) => field.onChange(file)}
                          value={field.value}
                          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
                          onRemove={() => field.onChange(null)}
                          previewSize="medium"
                        />
                      </FormControl>
                      <FormDescription>Background image for login, registration and other auth pages</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter contact email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter contact phone number" />
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter address" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={!isDirty || isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}