"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotFound } from "@/components/ui/not-found";

import { formatDate, capitalize } from "@/lib/utils";
// --- Extended Business Data ---
export const businessData = [
  {
    id: "1",
    businessName: "Tech Solutions Inc",
    address: "123 Main St, City",
    registrationDate: "2024-01-15", // ISO date string
    eligibility: "2024-01-20",
    typeOfOwnership: "corporation",
    owners: ["John Smith", "Alice Johnson"],
    typeOfCorporation: "private",
    businessContactNo: ["09123456789"],
    businessEmailAddress: "contact@techsolutions.com",
    status: "active",
    supportingDocuments: [
      { id: "doc1", name: "Business Permit", url: "/docs/techsolutions/permit.pdf" },
    ],
  },
  {
    id: "2",
    businessName: "Green Gardens Co",
    address: "456 Park Ave, Town",
    registrationDate: "2024-02-01",
    eligibility: "2024-02-05",
    typeOfOwnership: "partnership",
    owners: ["Jane Doe", "Robert Brown"],
    // typeOfCorporation is not applicable for partnerships.
    businessContactNo: ["09987654321"],
    businessEmailAddress: "info@greengardens.com",
    status: "pending",
    supportingDocuments: [
      { id: "doc2", name: "Environmental Clearance", url: "/docs/greengardens/clearance.pdf" },
    ],
  },
  {
    id: "3",
    businessName: "Digital Services LLC",
    address: "789 Oak Rd, Village",
    registrationDate: "2024-02-15",
    eligibility: "2024-02-20",
    typeOfOwnership: "corporation",
    owners: ["Mike Johnson"],
    typeOfCorporation: "public",
    businessContactNo: ["09111222333"],
    businessEmailAddress: "support@digitalservices.com",
    status: "inactive",
    supportingDocuments: [
      { id: "doc3", name: "Incorporation Certificate", url: "/docs/digitalservices/certificate.pdf" },
    ],
  },
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
        subtitle="View detailed information about the business"
        icon={<SquareGanttChart className="h-8 w-8" />}
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
                <dd className="mt-1">{formatDate(record.registrationDate)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Eligibility Date</dt>
                <dd className="mt-1">{formatDate(record.eligibility)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Type of Ownership</dt>
                <dd className="mt-1">{capitalize(record.typeOfOwnership)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Owners</dt>
                <dd className="mt-1">
                  {record.owners.join(", ")}
                </dd>
              </div>
              {record.typeOfCorporation && (
                <div>
                  <dt className="font-medium text-gray-500">Type of Corporation</dt>
                  <dd className="mt-1">{capitalize(record.typeOfCorporation)}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-gray-500">Contact Numbers</dt>
                <dd className="mt-1">
                  {record.businessContactNo.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1">{record.businessEmailAddress}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="mt-1 capitalize">{record.status}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500">Supporting Documents</dt>
                <dd className="mt-1">
                  {record.supportingDocuments.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {record.supportingDocuments.map((doc) => (
                        <li key={doc.id}>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {doc.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No documents available</span>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push("/dashboard/business")}>
            Back to List
          </Button>
          <Button onClick={() => router.push(`/dashboard/business/${id}/edit`)}>
            Edit Record
          </Button>
        </div>
      </div>
    </>
  );
}
