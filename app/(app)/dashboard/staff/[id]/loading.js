import  LoadingSkeleton  from "@/components/layout/LoadingSkeleton";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function StaffLoading() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle="Loading staff information..."
        icon={<Users className="h-8 w-8" />}
      />
      <Card className="p-6">
        <LoadingSkeleton className="h-[400px]" />
      </Card>
    </div>
  );
}