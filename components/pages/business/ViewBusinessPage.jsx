"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { InfoItem } from "@/components/ui/info-item";

export default function ViewBusinessPage({ data }) {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
        <PageHeader
          title="View Business Record"
          subtitle="View detailed information about the business"
          icon={<SquareGanttChart className="h-8 w-8" />}
        />
        <main className="max-w-6xl mx-auto space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                  label="Business Name"
                  value={data.businessName}
                  className="lg:col-span-2"
                />
                <InfoItem
                  label="Status"
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                        data.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {data.status}
                    </span>
                  }
                />
                <InfoItem
                  label="Address"
                  value={data.address}
                  className="lg:col-span-3"
                />
                <InfoItem
                  label="Registration Date"
                  value={new Date(data.registrationDate).toLocaleDateString()}
                />
                <InfoItem
                  label="Type of Ownership"
                  value={data.typeOfOwnership}
                  className="capitalize"
                />
                <InfoItem
                  label="Owners"
                  value={data.owners.map((owner) => owner.ownerName).join(", ")}
                />
                {data.typeOfCorporation && (
                  <InfoItem
                    label="Type of Corporation"
                    value={data.typeOfCorporation}
                    className="capitalize"
                  />
                )}
                <InfoItem
                  label="Contact Numbers"
                  value={data.businessContactNo}
                />
                <InfoItem
                  label="Email Address"
                  value={data.businessEmailAddress}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Supporting Documents
              </h3>
              {data.supportingDocuments.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.supportingDocuments.map((doc) => (
                    <DocumentPreview key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents available</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/business")}
              className="bg-white hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/business/${data.id}/edit`)}
              className="bg-gray-900 hover:bg-gray-800 text-white transition-colors"
            >
              Edit Record
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
