"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
export default function ViewGeneralRequest() {
  const params = useParams();
  const id = params.id;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchRequest = async () => {
      const response = await fetch(`/api/requests/${id}`);
      const data = await response.json();
      setRequest(data);
      setLoading(false);
    };
    fetchRequest();
  }, [id]);

  if(loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-16 w-16 text-primary-500" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="View General Request"
        subtitle="View details of a general request"
        icon={<SquareGanttChart className="h-8 w-8" />}
      />

        {/* Request Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium text-gray-500">Type</dt>
                <dd className="mt-1 capitalize">{request.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="mt-1 capitalize">{request.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1">{request.purpose}</dd>
              </div>
              {request.type === "indigencyCertificate" && (
                <div>
                  <dt className="font-medium text-gray-500">For Whom</dt>
                  <dd className="mt-1">
                    {request.forWhom || "N/A"}
                  </dd>
                </div>
              )}
              {request.type === "barangayClearance" && (
                <div>
                  <dt className="font-medium text-gray-500">Remarks</dt>
                  <dd className="mt-1">
                    {request.remarks || "N/A"}
                  </dd>
                </div>
              )}
              {request.type === "barangayResidency" && (
                <div>
                  <dt className="font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1">
                    {request.duration || "N/A"}
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
                  {`${request.personalData.firstName} ${request.personalData.middleName} ${request.personalData.lastName}`}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Birth Date</dt>
                <dd className="mt-1">
                  {new Date(request.personalData.birthDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Sex</dt>
                <dd className="mt-1 capitalize">{request.personalData.sex}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Marital Status</dt>
                <dd className="mt-1 capitalize">
                  {request.personalData.maritalStatus}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Citizenship</dt>
                <dd className="mt-1">{request.personalData.citizenship}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500">Local Address</dt>
                <dd className="mt-1">{request.personalData.localAddress}</dd>
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
            {request.supportingDocuments.length === 0 ? (
              <p className="text-gray-500">No supporting documents attached</p>
            ) : (
              <ul className="space-y-2">
                {request.supportingDocuments.map((doc, index) => (
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
    </>
  );
}