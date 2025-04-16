"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "@/hooks/use-theme";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemePreview } from "./ThemePreview";
import { hexColorRegex } from "@/lib/theme-utils";
import { updateThemeSettings } from "@/app/(app)/dashboard/theme/actions";
import { Loader2 } from "lucide-react";

const colorCategories = {
  base: ["background", "foreground"],
  components: [
    "card",
    "cardForeground",
    "popover",
    "popoverForeground",
    "primary",
    "primaryForeground",
    "secondary",
    "secondaryForeground",
    "muted",
    "mutedForeground",
    "accent",
    "accentForeground"
  ],
  states: ["destructive", "destructiveForeground", "border", "input", "ring"],
  sidebar: ["sidebarBackground", "sidebarForeground", "sidebarPrimary", "sidebarPrimaryForeground",
            "sidebarAccent", "sidebarAccentForeground", "sidebarBorder"],
  charts: ["chart1", "chart2", "chart3", "chart4", "chart5"]
};

const themeSchema = z.object(
  Object.values(colorCategories).flat().reduce((acc, key) => ({
    ...acc,
    [key]: z.string().regex(hexColorRegex, "Invalid hex color")
  }), {})
);

function ColorField({ name, control }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-4 space-y-0">
          <FormLabel className="min-w-[180px] flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border shadow-sm"
              style={{ backgroundColor: field.value || "#FFFFFF" }}
            />
            {name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </FormLabel>
          <FormControl>
            <Input
              type="color"
              className="w-[100px]"
              {...field}
              value={field.value || "#FFFFFF"}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function ThemeForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const { theme, updateTheme, loadPreset, themePresets } = useTheme();
  
  const form = useForm({
    resolver: zodResolver(themeSchema),
    defaultValues: theme || {},
    mode: "onChange"
  });
  
  // Ensure all form values are properly initialized
  useEffect(() => {
    if (theme) {
      // Make sure all color fields have values to avoid uncontrolled->controlled error
      const allColorFields = Object.values(colorCategories).flat();
      const formValues = {};
      
      allColorFields.forEach(field => {
        // Use theme value if available, or default to white
        formValues[field] = theme[field] || "#FFFFFF";
      });
      
      form.reset(formValues);
      setFormReady(true);
    }
  }, [theme, form]);

  const handlePresetChange = (preset) => {
    loadPreset(preset);
    const presetTheme = themePresets[preset];
    Object.keys(form.getValues()).forEach(key => {
      form.setValue(key, presetTheme[key] || "#FFFFFF");
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Convert chart1 to chart-1 format for database
      const formattedData = {...data};
      if (formattedData.chart1) formattedData['chart-1'] = formattedData.chart1;
      if (formattedData.chart2) formattedData['chart-2'] = formattedData.chart2;
      if (formattedData.chart3) formattedData['chart-3'] = formattedData.chart3;
      if (formattedData.chart4) formattedData['chart-4'] = formattedData.chart4;
      if (formattedData.chart5) formattedData['chart-5'] = formattedData.chart5;
      
      // Call the server action
      const result = await updateThemeSettings(formattedData);
      
      if (result.success) {
        // Update local state
        await updateTheme(result.data);
        
        toast({
          title: "Theme updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update theme settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form until we've initialized all values
  if (!formReady) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <Select onValueChange={handlePresetChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a theme preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  <Tabs defaultValue="base">
                    <TabsList className="mb-4">
                      <TabsTrigger value="base">Base Colors</TabsTrigger>
                      <TabsTrigger value="components">Component Colors</TabsTrigger>
                      <TabsTrigger value="states">States</TabsTrigger>
                      <TabsTrigger value="sidebar">Sidebar Colors</TabsTrigger>
                      <TabsTrigger value="charts">Chart Colors</TabsTrigger>
                    </TabsList>

                    <TabsContent value="base">
                      <div className="space-y-3">
                        {colorCategories.base.map(name => (
                          <ColorField key={name} name={name} control={form.control} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="components">
                      <div className="space-y-3">
                        {colorCategories.components.map(name => (
                          <ColorField key={name} name={name} control={form.control} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="states">
                      <div className="space-y-3">
                        {colorCategories.states.map(name => (
                          <ColorField key={name} name={name} control={form.control} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="sidebar">
                      <div className="space-y-3">
                        {colorCategories.sidebar.map(name => (
                          <ColorField key={name} name={name} control={form.control} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="charts">
                      <div className="space-y-3">
                        {colorCategories.charts.map(name => (
                          <ColorField key={name} name={name} control={form.control} />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </form>
            </Form>
          </Card>
        </div>

        <div className="space-y-6">
          <ThemePreview />
        </div>
      </div>
    </div>
  );
}