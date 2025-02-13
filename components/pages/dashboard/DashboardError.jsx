import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function DashboardError({ error }) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-2xl mt-8">
      <AlertTitle>Error Loading Dashboard</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{error?.message || 'Failed to load dashboard data'}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}