"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {SquareGanttChart} from "lucide-react";

// Mock data - replace with actual data fetching
const mockData = [
  {
    id: "1",
    businessName: "Tech Solutions Inc",
    address: "123 Main St, City",
    registrationDate: "2024-01-15",
    owner: "John Smith",
    businessEmail: "contact@techsolutions.com",
    status: "Pending Payment",
    businessContactNo: ["09123456789"],
    typeOfOwnership: "corporation",
    supportingDocuments: [],
    validity: "2025-01-15",
    officialReceiptNo: "OR-12345",
    issuedTo: "John Smith",
    amount: 1500,
  },
  {
    id: "2",
    businessName: "Green Gardens Co",
    address: "456 Park Ave, Town",
    registrationDate: "2024-02-01",
    owner: "Jane Doe",
    businessEmail: "info@greengardens.com",
    status: "Approved",
    businessContactNo: ["09123456789"],
    typeOfOwnership: "partnership",
    supportingDocuments: [],
    validity: "2025-02-01",
    officialReceiptNo: "OR-12346",
    issuedTo: "Jane Doe",
    amount: 2000,
  },
  {
    id: "3",
    businessName: "Digital Services LLC",
    address: "789 Oak Rd, Village",
    registrationDate: "2024-02-15",
    owner: "Mike Johnson",
    businessEmail: "support@digitalservices.com",
    status: "Pending Signature",
    businessContactNo: ["09123456789"],
    typeOfOwnership: "LLC",
    supportingDocuments: [],
    validity: "2025-02-15",
    officialReceiptNo: "OR-12347",
    issuedTo: "Mike Johnson",
    amount: 2500,
  },
];
export default function ViewBusinessPermit() {
  const params = useParams();
  const id = params.id;

  const mockPermit = mockData.find((permit) => permit.id === id);

  return (
    <>
      <PageHeader
        title="View Business Permit"
        subtitle="View details of a business permit"
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
                <dd className="mt-1">{mockPermit.businessName}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Address</dt>
                <dd className="mt-1">{mockPermit.address}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Type of Ownership</dt>
                <dd className="mt-1">{mockPermit.typeOfOwnership}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{mockPermit.status}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Official Receipt No.</dt>
                <dd className="mt-1">{mockPermit.officialReceiptNo}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Issued To</dt>
                <dd className="mt-1">{mockPermit.issuedTo}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Amount</dt>
                <dd className="mt-1">₱{mockPermit.amount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Validity</dt>
                <dd className="mt-1">{new Date(mockPermit.validity).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {mockPermit.supportingDocuments.length === 0 ? (
              <p className="text-gray-500">No supporting documents attached</p>
            ) : (
              <ul className="space-y-2">
                {mockPermit.supportingDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>{doc.file.name}</span>
                    {doc.notes && <span className="text-gray-500">- {doc.notes}</span>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}