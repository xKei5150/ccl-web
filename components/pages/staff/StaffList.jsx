"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { StaffCard } from "@/components/layout/StaffCard";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteStaffMember } from "@/app/(app)/dashboard/staff/actions";

export function StaffList({ data }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (ids) => {
    try {
      await deleteStaffMember(ids);
      toast({
        title: "Success",
        description: "Staff member(s) deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member(s)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Staff Management"
        subtitle="View and manage staff members"
        icon={<Users className="h-8 w-8" />}
        action={
          <Button onClick={() => router.push("/dashboard/staff/new")}>
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {data?.docs?.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            onEdit={() => router.push(`/dashboard/staff/${staff.id}/edit`)}
            onDelete={() => handleDelete([staff.id])}
          />
        ))}
      </div>
    </div>
  );
}