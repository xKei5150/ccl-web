"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// Mock data - replace with actual data fetching
const mockPermit = {
  businessData: {
    businessName: "Sample Business",
    address: "123 Business St.",
    registrationDate: new Date(),
    eligibility: new Date(),
    typeOfOwnership: "sole proprietorship",
    owners: ["John Doe"],
    businessContactNo: ["09123456789"],
    businessEmailAddress: "business@example.com",
    status: "active",
    supportingDocuments: [],
  },
  validity: new Date(),
  officialReceiptNo: "OR-12345",
  issuedTo: "John Doe",
  amount: 1000,
};

export default function ViewBusinessPermit() {
    const params = useParams();
    const id = params.id;

  return (
<>
        <PageHeader
          title="View Business Permit"
          breadcrumbs={[
            { href: "/business-permits", label: "Business Permits" },
            { label: `Permit #${id}` },
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
                  <dd className="mt-1">{mockPermit.businessData.businessName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Address</dt>
                  <dd className="mt-1">{mockPermit.businessData.address}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Type of Ownership</dt>
                  <dd className="mt-1">{mockPermit.businessData.typeOfOwnership}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">{mockPermit.businessData.status}</dd>
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
                  <dd className="mt-1">{mockPermit.validity.toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {mockPermit.businessData.supportingDocuments.length === 0 ? (
                <p className="text-gray-500">No supporting documents attached</p>
              ) : (
                <ul className="space-y-2">
                  {mockPermit.businessData.supportingDocuments.map((doc, index) => (
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