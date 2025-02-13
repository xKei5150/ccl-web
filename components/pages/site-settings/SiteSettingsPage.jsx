"use client";

import { useToast } from "@/hooks/use-toast" // Replace with your toast component import
import { Settings } from "lucide-react";
import { PageHeader  } from "@/components/layout/PageHeader";
import SiteSettingsForm from "@/components/form/SiteSettingsForm";

export default function SiteSettingsPage({ defaultValues, onSubmit }) {
    const { toast } = useToast();
    async function handleSubmit(data) {
        try {
            await onSubmit(data);
            toast({
                title: "Success",
                description: "Site settings updated successfully",
                variant: "success",
            });
        } catch (error) {
            console.error("Failed to update report:", error);
            toast({
                title: "Error",
                description: `Failed to update site settings: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <PageHeader
                title="Site Settings"
                subtitle="Manage your site settings"
                icon={<Settings className="h-8 w-8" />}
            />
            <SiteSettingsForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
            />
        </>
    );
}