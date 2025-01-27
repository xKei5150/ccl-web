"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with actual data fetching
const mockRecord = {
  familyName: "Dela Cruz Family",
  members: [1, 2, 3],
  localAddress: "123 Main St.",
  residencyDate: new Date("2010-01-01"),
  status: "Active",
};

export default function ViewHouseholdRecord() {
    const params = useParams();
    const id = params.id;

  return (
    <>
        <PageHeader
          title="View Household Record"
          breadcrumbs={[
            { href: "/household", label: "Household Information" },
            { label: `Record #${id}` },
          ]}
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Household Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Family Name</dt>
                  <dd className="mt-1">{mockRecord.familyName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Number of Members</dt>
                  <dd className="mt-1">{mockRecord.members.length}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Local Address</dt>
                  <dd className="mt-1">{mockRecord.localAddress}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Residency Date</dt>
                  <dd className="mt-1">{mockRecord.residencyDate.toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">{mockRecord.status}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        </>
  );
}