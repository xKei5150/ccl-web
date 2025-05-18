"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PenSquare, Printer, Calendar, Receipt, User, Building, Tag, ArrowLeft, BanknoteIcon, ClipboardList, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { InfoItem } from "@/components/ui/info-item";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ViewBusinessPermitPage({ data }) {
  const router = useRouter();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;

  // Only show certificate button when status is approved AND user has admin access
  const canViewCertificate = data.status === "approved" && hasAdminAccess;
  // Allow editing only if not approved, or if user has admin access
  const canEdit = data.status !== "approved" || hasAdminAccess;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title="Business Permit"
        subtitle="View business permit details"
        icon={<FileText className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/business-permits')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          {canViewCertificate ? (
            <Button
              onClick={() => router.push(`/certificate/${data.id}?type=business`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              View Certificate
            </Button>
          ) : data.status === "approved" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      disabled
                      className="flex items-center gap-2 bg-blue-600/50 cursor-not-allowed"
                    >
                      <Printer className="h-4 w-4" />
                      View Certificate
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Only administrators can view the certificate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          
          {canEdit ? (
          <Button
            onClick={() => router.push(`/dashboard/business-permits/${data.id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Permit
          </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      disabled
                      className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      <PenSquare className="h-4 w-4" />
                      Edit Permit
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Approved permits cannot be edited by regular users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Business Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>Business Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Business Name</span>
                  </div>
                }
                value={
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-left font-normal hover:underline"
                    onClick={() => router.push(`/dashboard/business/${data.business.id}`)}
                  >
                    <span className="mr-1">{data.business.businessName}</span>
                    <ExternalLink className="h-3 w-3 inline" />
                  </Button>
                }
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Business Status</span>
                  </div>
                }
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                      data.business.status === "active"
                        ? "bg-green-100 text-green-800"
                        : data.business.status === "inactive" 
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {data.business.status}
                  </span>
                }
              />
              {data.business.address && (
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Business Address</span>
                    </div>
                  }
                  value={data.business.address}
                  className="lg:col-span-3"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permit Details */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Permit Details</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span>Official Receipt No.</span>
                  </div>
                }
                value={data.officialReceiptNo}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Issued To</span>
                  </div>
                }
                value={data.issuedTo}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Validity</span>
                  </div>
                }
                value={new Date(data.validity).toLocaleDateString()}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Payment Date</span>
                  </div>
                }
                value={new Date(data.paymentDate).toLocaleDateString()}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Amount</span>
                  </div>
                }
                value={`₱${parseFloat(data.amount).toFixed(2)}`}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                }
                value={
                  <Badge className={cn(
                    "capitalize",
                    data.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                    data.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                    "bg-red-100 text-red-800 hover:bg-red-100"
                  )}>
                    {data.status}
                  </Badge>
                }
              />
            </div>
          </CardContent>
        </Card>

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
}
