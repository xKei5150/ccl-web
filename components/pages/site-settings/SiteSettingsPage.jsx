"use client";

import { useToast } from "@/hooks/use-toast"
import { Settings, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import SiteSettingsForm from "@/components/form/SiteSettingsForm";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SiteSettingsPage({ defaultValues, onSubmit }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleSubmit(data) {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            
            // Show visible success alert
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
            
            // Also show toast
            toast({
                title: "Settings Updated",
                description: "Site settings have been saved successfully",
                variant: "success",
            });
        } catch (error) {
            console.error("Failed to update settings:", error);
            toast({
                title: "Error Occurred",
                description: `Failed to update site settings: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-5xl mx-auto pb-10">
            <PageHeader
                title="Site Settings"
                subtitle="Manage your site appearance and contact information"
                icon={<Settings className="h-8 w-8" />}
            />
            
            {showSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your site settings have been updated successfully.
                    </AlertDescription>
                </Alert>
            )}
            
            <SiteSettingsForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
            <Toaster />
        </div>
    );
}