"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotFound } from "@/components/ui/not-found";

 const businessData = [
    {
      id: "1",
      businessName: "Tech Solutions Inc",
      address: "123 Main St, City",
      registrationDate: "2024-01-15",
      owner: "John Smith",
      businessEmail: "contact@techsolutions.com"
    },
    {
      id: "2",
      businessName: "Green Gardens Co",
      address: "456 Park Ave, Town",
      registrationDate: "2024-02-01",
      owner: "Jane Doe",
      businessEmail: "info@greengardens.com"
    },
    {
      id: "3",
      businessName: "Digital Services LLC",
      address: "789 Oak Rd, Village",
      registrationDate: "2024-02-15",
      owner: "Mike Johnson",
      businessEmail: "support@digitalservices.com"
    }
  ];

export default function ViewBusinessRecord() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const record = businessData.find((b) => b.id === id);

  if (!record) {
    return <NotFound />;
  }

  return (
    <>
      <PageHeader
        title="View Business Record"
        breadcrumbs={[
          { href: "/business", label: "Business Information" },
          { label: record.businessName },
        ]}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1">{record.businessName}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Address</dt>
                <dd className="mt-1">{record.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Registration Date</dt>
                <dd className="mt-1">
                  {new Date(record.registrationDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Owner</dt>
                <dd className="mt-1">{record.owner}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1">{record.businessEmail}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push("/business")}>
            Back to List
          </Button>
          <Button onClick={() => router.push(`/business/${id}/edit`)}>
            Edit Record
          </Button>
        </div>
      </div>
    </>
  );
}
