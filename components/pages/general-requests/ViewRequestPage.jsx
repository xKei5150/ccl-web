"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClipboardList, PenSquare, Printer, UserCheck, FileText, Clock, BanknoteIcon, Calendar, ArrowLeft, Receipt, Tag } from "lucide-react";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const canViewCertificate = data.status === "approved" || data.status === "completed";
  const canViewCertificate = true;
  const showCTCDetails = 
    (data.type === "barangayClearance" || data.type === "barangayResidency") && 
    data.certificateDetails?.ctcDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={requestTypeMap[data.type] || data.type}
        subtitle="Request Details"
        icon={<ClipboardList className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/general-requests')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          {canViewCertificate && (
            <Button
              onClick={() => router.push(`/certificate/${data.id}`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              View Certificate
            </Button>
          )}
          
          <Button
            onClick={() => router.push(`/dashboard/general-requests/${data.id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Request
          </Button>
        </div>
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Request Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle>Request Overview</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Request Type</span>
                  </div>
                }
                value={requestTypeMap[data.type] || data.type}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                }
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
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date Submitted</span>
                  </div>
                }
                value={new Date(data.createdAt).toLocaleDateString()}
              />
              
              {data.certificateDetails?.controlNumber && (
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate Number</span>
                    </div>
                  }
                  value={data.certificateDetails.controlNumber}
                />
              )}
              
              {data.certificateDetails?.dateIssued && (
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Date Issued</span>
                    </div>
                  }
                  value={new Date(data.certificateDetails.dateIssued).toLocaleDateString()}
                />
              )}
              
              {data.certificateDetails?.validUntil && (
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Valid Until</span>
                    </div>
                  }
                  value={new Date(data.certificateDetails.validUntil).toLocaleDateString()}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requestor Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <CardTitle>Requestor Information</CardTitle>
            </div>
            <Separator />
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
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Request Details</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Purpose
                </h4>
                <p className="text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">{data.purpose}</p>
              </div>
              
              {/* Additional Information based on request type */}
              {data.type === "indigencyCertificate" && data.additionalInformation?.forWhom && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    For Whom (Beneficiary)
                  </h4>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-md border">{data.additionalInformation.forWhom}</p>
                </div>
              )}
              
              {data.type === "barangayClearance" && data.additionalInformation?.remarks && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Remarks
                  </h4>
                  <p className="text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">{data.additionalInformation.remarks}</p>
                </div>
              )}
              
              {data.type === "barangayResidency" && data.additionalInformation?.duration && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duration of Residency
                  </h4>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-md border">{data.additionalInformation.duration}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* CTC Information - only for Barangay Clearance and Residency */}
        {showCTCDetails && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-primary" />
                <CardTitle>Community Tax Certificate Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certificateDetails.ctcDetails.ctcNo && (
                  <InfoItem
                    label="CTC Number"
                    value={data.certificateDetails.ctcDetails.ctcNo}
                  />
                )}
                
                {data.certificateDetails.ctcDetails.ctcAmount && (
                  <InfoItem
                    label="CTC Amount"
                    value={data.certificateDetails.ctcDetails.ctcAmount}
                  />
                )}
                
                {data.certificateDetails.ctcDetails.ctcDateIssued && (
                  <InfoItem
                    label={
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>CTC Date Issued</span>
                      </div>
                    }
                    value={new Date(data.certificateDetails.ctcDetails.ctcDateIssued).toLocaleDateString()}
                  />
                )}
                
                {data.certificateDetails.ctcDetails.ctcPlaceIssued && (
                  <InfoItem
                    label="CTC Place Issued"
                    value={data.certificateDetails.ctcDetails.ctcPlaceIssued}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Payment Information */}
        {data.certificateDetails?.payment && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <CardTitle>Payment Details</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.certificateDetails.payment.orNumber && (
                  <InfoItem
                    label="OR Number"
                    value={data.certificateDetails.payment.orNumber}
                  />
                )}
                {data.certificateDetails.payment.amount && (
                  <InfoItem
                    label="Amount Paid"
                    value={`₱${data.certificateDetails.payment.amount}`}
                  />
                )}
                {data.certificateDetails.payment.date && (
                  <InfoItem
                    label={
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Payment Date</span>
                      </div>
                    }
                    value={new Date(data.certificateDetails.payment.date).toLocaleDateString()}
                  />
                )}
                {data.certificateDetails.payment.method && (
                  <InfoItem
                    label="Payment Method"
                    value={
                      <Badge variant="outline" className="capitalize">
                        {data.certificateDetails.payment.method}
                      </Badge>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supporting Documents */}
        {data.supportingDocuments?.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Supporting Documents</CardTitle>
              </div>
              <Separator />
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