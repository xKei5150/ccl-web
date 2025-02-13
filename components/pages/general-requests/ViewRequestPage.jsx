"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClipboardList, PenSquare } from "lucide-react";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";

const ViewRequestPage = ({ data }) => {
  const router = useRouter();
  
  const requestTypeMap = {
    indigencyCertificate: "Indigency Certificate",
    barangayClearance: "Barangay Clearance",
    barangayResidency: "Barangay Residency",
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={requestTypeMap[data.type] || data.type}
        subtitle="Request Details"
        icon={<ClipboardList className="h-8 w-8" />}
      >
        <Button
          onClick={() => router.push(`/dashboard/general-requests/${data.id}/edit`)}
          className="flex items-center gap-2"
        >
          <PenSquare className="h-4 w-4" />
          Edit Request
        </Button>
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Request Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Request Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label="Request Type"
                value={requestTypeMap[data.type] || data.type}
              />
              <InfoItem
                label="Status"
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                      getStatusStyle(data.status)
                    )}
                  >
                    {data.status}
                  </span>
                }
              />
              <InfoItem
                label="Date Submitted"
                value={new Date(data.createdAt).toLocaleDateString()}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requestor Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Requestor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label="Full Name"
                value={data.person.name.fullName}
              />
              <InfoItem
                label="Contact Number"
                value={data.person.contact.contactNumber}
              />
              <InfoItem
                label="Address"
                value={data.person.contact.localAddress}
                className="lg:col-span-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Purpose</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{data.purpose}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supporting Documents */}
        {data.supportingDocuments?.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.supportingDocuments.map((doc) => (
                  <DocumentPreview key={doc.id} document={doc} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ViewRequestPage;