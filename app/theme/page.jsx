"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";

const themeSchema = z.object({
  tableHeaderColor: z.string(),
  tableItemColor: z.string(),
  primaryButtonColor: z.string(),
  secondaryButtonColor: z.string(),
  pageBackgroundColor: z.string(),
  sidebarColor: z.string(),
  textColor: z.string(),
  logo: z.string(),
});

export default function ThemeManager() {
  const form = useForm({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      tableHeaderColor: "#8E9196",
      tableItemColor: "#F1F1F1",
      primaryButtonColor: "#9b87f5",
      secondaryButtonColor: "#7E69AB",
      pageBackgroundColor: "#F1F0FB",
      sidebarColor: "#1A1F2C",
      textColor: "#222222",
      logo: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
    toast.success("Theme settings updated successfully!");
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto py-6">
        <PageHeader
          title="Theme Manager"
          breadcrumbs={[
            { href: "/theme", label: "Theme Manager" },
          ]}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl"
          >
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sidebarColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sidebar Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pageBackgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Background Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tableHeaderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Header Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tableItemColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Item Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryButtonColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Button Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryButtonColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Button Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Save Theme Settings</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
