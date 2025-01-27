"use client";

import { useParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with actual data fetching
const mockRequest = {
  type: "barangayClearance",
  personalData: {
    photo: "123e4567-e89b-12d3-a456-426614174000",
    firstName: "Juan",
    lastName: "Dela Cruz",
    birthDate: new Date("1990-01-01"),
    sex: "male",
    contactNo: [9123456789],
    emailAddress: "juan@example.com",
    localAddress: "123 Main St.",
    lifeStatus: "alive",
    citizenship: "Filipino",
    maritalStatus: "single",
    residencyStatus: "owned",
  },
  supportingDocuments: [],
  status: "pending",
  barangayClearance: {
    purpose: "Employment",
    remarks: "None"
  },
};

export default function ViewGeneralRequest() {
    const params = useParams();
    const id = params.id;

  return (
    <>
        <PageHeader
          title="View General Request"
          breadcrumbs={[
            { href: "/general-requests", label: "General Requests" },
            { label: `Request #${id}` },
          ]}
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Type</dt>
                  <dd className="mt-1">{mockRequest.type}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">{mockRequest.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Purpose</dt>
                  <dd className="mt-1">{mockRequest.barangayClearance.purpose}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Name</dt>
                  <dd className="mt-1">{`${mockRequest.personalData.firstName} ${mockRequest.personalData.lastName}`}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd className="mt-1">{mockRequest.personalData.emailAddress}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Address</dt>
                  <dd className="mt-1">{mockRequest.personalData.localAddress}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {mockRequest.supportingDocuments.length === 0 ? (
                <p className="text-gray-500">No supporting documents attached</p>
              ) : (
                <ul className="space-y-2">
                  {mockRequest.supportingDocuments.map((doc, index) => (
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