"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { InfoItem } from "@/components/ui/info-item";

export default function ViewBusinessPermitPage({ data }) {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
        <PageHeader
          title="View Business Permit"
          subtitle="View details of a business permit"
          icon={<SquareGanttChart className="h-8 w-8" />}
        />
        <main className="max-w-6xl mx-auto space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                  label="Business Name"
                  value={data.business.businessName}
                />
                <InfoItem
                  label="Status"
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                        data.status === "active"
                          ? "bg-green-100 text-green-800"
                          : data.status === "inactive" 
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {data.business.status}
                    </span>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permit Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <InfoItem
                  label="Official Receipt No."
                  value={data.officialReceiptNo}
                />
                <InfoItem
                  label="Issued To"
                  value={data.issuedTo}
                />
                <InfoItem
                  label="Validity"
                  value={new Date(data.validity).toLocaleDateString()}
                />
                <InfoItem
                  label="Payment Date"
                  value={new Date(data.paymentDate).toLocaleDateString()}
                />
                <InfoItem
                  label="Amount"
                  value={`₱${data.amount}`}
                />
                <InfoItem
                  label="Status"
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                        data.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : data.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {data.status}
                    </span>
                  }
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
              onClick={() => router.push("/dashboard/business-permits")}
              className="bg-white hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/business-permits/${data.id}/edit`)}
              className="bg-gray-900 hover:bg-gray-800 text-white transition-colors"
            >
              Update Permit
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
