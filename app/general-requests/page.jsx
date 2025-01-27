"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

// Mock data for demonstration
const mockRequests = [
  {
    requestType: "Certificate of Residency",
    fullName: "Juan Dela Cruz",
    status: "Pending",
  },
  {
    requestType: "Barangay Clearance",
    fullName: "Maria Santos",
    status: "Approved",
  },
  {
    requestType: "Business Permit",
    fullName: "Pedro Reyes",
    status: "Rejected",
  },
];

const columns = [
  {
    header: "Request Type",
    accessorKey: "requestType",
  },
  {
    header: "Full Name",
    accessorKey: "fullName",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

const GeneralRequests = () => {
  const router = useRouter();

  return (
<>
        <div className="flex justify-between items-center">
          <PageHeader
            title="General Requests"
            breadcrumbs={[
              {
                label: "General Requests",
              },
            ]}
          />
          <Button
            onClick={() => router.push("/general-requests/new")}
            className="mb-8"
          >
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        </div>
        <div className="mt-8">
          <DataTable
            data={mockRequests}
            columns={columns}
            pageSize={10}
          />
        </div>
</>
  );
};

export default GeneralRequests;