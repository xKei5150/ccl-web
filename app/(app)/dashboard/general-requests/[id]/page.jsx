"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";

// --- Mock Data ---
// In a production app, this data might be fetched from a backend.
const mockRequest = {
  personalData: {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith",
    birthDate: "1990-01-01",
    sex: "male",
    maritalStatus: "single",
    citizenship: "Filipino",
    localAddress: "123 Main St.",
  },
  type: "Indigency Certificate", // Change this to "barangayClearance" or "barangayResidency" to test different conditional views.
  status: "pending",
  supportingDocuments: [],
  purpose: "Medical assistance",
  indigencyCertificate: {
    forWhom: "Jane Doe", // For indigency certificate, show the beneficiary.
  },
  // You could add barangayClearance or barangayResidency properties if needed.
};

export default function ViewGeneralRequest() {
  const params = useParams();
  const id = params.id;

  return (
    <>
      <PageHeader
        title="View General Request"
        subtitle="View details of a general request"
        icon={<SquareGanttChart className="h-8 w-8" />}
      />
      <div className="grid gap-6">
        {/* Request Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Type</dt>
                <dd className="mt-1 capitalize">{mockRequest.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="mt-1 capitalize">{mockRequest.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1">{mockRequest.purpose}</dd>
              </div>
              {mockRequest.type === "indigencyCertificate" && (
                <div>
                  <dt className="font-medium text-gray-500">For Whom</dt>
                  <dd className="mt-1">
                    {mockRequest.indigencyCertificate.forWhom || "N/A"}
                  </dd>
                </div>
              )}
              {mockRequest.type === "barangayClearance" && (
                <div>
                  <dt className="font-medium text-gray-500">Remarks</dt>
                  <dd className="mt-1">
                    {mockRequest.barangayClearance?.remarks || "N/A"}
                  </dd>
                </div>
              )}
              {mockRequest.type === "barangayResidency" && (
                <div>
                  <dt className="font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1">
                    {mockRequest.barangayResidency?.duration || "N/A"}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1">
                  {`${mockRequest.personalData.firstName} ${mockRequest.personalData.middleName} ${mockRequest.personalData.lastName}`}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Birth Date</dt>
                <dd className="mt-1">
                  {new Date(mockRequest.personalData.birthDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Sex</dt>
                <dd className="mt-1 capitalize">{mockRequest.personalData.sex}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Marital Status</dt>
                <dd className="mt-1 capitalize">
                  {mockRequest.personalData.maritalStatus}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Citizenship</dt>
                <dd className="mt-1">{mockRequest.personalData.citizenship}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500">Local Address</dt>
                <dd className="mt-1">{mockRequest.personalData.localAddress}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Supporting Documents Card */}
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
                    {doc.notes && (
                      <span className="text-gray-500">- {doc.notes}</span>
                    )}
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
