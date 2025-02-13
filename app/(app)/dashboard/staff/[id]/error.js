"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function StaffError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle="An error occurred"
        icon={<AlertCircle className="h-8 w-8 text-destructive" />}
      />
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Staff Data</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>There was an error loading the staff information. Please try again.</p>
            <Button
              variant="outline"
              onClick={reset}
              className="w-fit gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
};