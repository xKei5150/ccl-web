import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureForm } from "@/components/feature/FeatureForm";
import { createFeatureAction } from "../actions";

export const metadata = {
  title: "Create New Feature Item | CCL",
  description: "Create a new feature item in the system",
};

export default function NewFeatureItemPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Feature Item"
        description="Add a new feature item to the system"
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard/feature">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Feature Item Details</CardTitle>
          <CardDescription>
            Enter the information for the new feature item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureForm 
            action={createFeatureAction}
            submitButtonText="Create Feature Item" 
          />
        </CardContent>
      </Card>
    </div>
  );
} 