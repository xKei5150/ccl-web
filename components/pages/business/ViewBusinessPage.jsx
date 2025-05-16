"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CircleCheck, 
  Users, 
  Mail, 
  Phone, 
  FileText, 
  PenSquare, 
  ArrowLeft,
  Ticket,
  CreditCard,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { InfoItem } from "@/components/ui/info-item";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function ViewBusinessPage({ data, permits = [] }) {
  const router = useRouter();

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermitStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={data.businessName}
        subtitle="Business Information"
        icon={<Building2 className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/business')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          <Button
            onClick={() => router.push(`/dashboard/business/${data.id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Record
          </Button>
        </div>
      </PageHeader>
      
      <main className="max-w-6xl mx-auto space-y-6">
        {/* Business Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Business Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>Business Name</span>
                  </div>
                }
                value={data.businessName}
                className="lg:col-span-2"
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                }
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize gap-1",
                      getStatusStyle(data.status)
                    )}
                  >
                    <CircleCheck className="h-3.5 w-3.5" />
                    {data.status}
                  </span>
                }
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Address</span>
                  </div>
                }
                value={data.address}
                className="lg:col-span-3"
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Registration Date</span>
                  </div>
                }
                value={new Date(data.registrationDate).toLocaleDateString()}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Type of Ownership</span>
                  </div>
                }
                value={<span className="capitalize">{data.typeOfOwnership}</span>}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Owners</span>
                  </div>
                }
                value={data.owners.map((owner) => owner.ownerName).join(", ")}
              />
              {data.typeOfCorporation && (
                <InfoItem
                  label={
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Type of Corporation</span>
                    </div>
                  }
                  value={<span className="capitalize">{data.typeOfCorporation}</span>}
                />
              )}
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Contact Numbers</span>
                  </div>
                }
                value={data.businessContactNo}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email Address</span>
                  </div>
                }
                value={data.businessEmailAddress}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Permits */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <CardTitle>Business Permits</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => router.push('/dashboard/business-permits/new?businessId=' + data.id)}
              >
                <Ticket className="h-4 w-4" />
                New Permit
              </Button>
            </div>
            <Separator className="mt-3" />
          </CardHeader>
          <CardContent>
            {permits && permits.length > 0 ? (
              <div className="space-y-4">
                {permits.map((permit) => (
                  <div key={permit.id} className="border rounded-lg p-4 bg-background/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <InfoItem
                        label={
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span>Official Receipt No</span>
                          </div>
                        }
                        value={
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium"
                            onClick={() => router.push(`/dashboard/business-permits/${permit.id}`)}
                          >
                            {permit.officialReceiptNo}
                          </Button>
                        }
                      />
                      <InfoItem
                        label={
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Validity Date</span>
                          </div>
                        }
                        value={format(new Date(permit.validity), 'PPP')}
                      />
                      <InfoItem
                        label={
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>Amount Paid</span>
                          </div>
                        }
                        value={`₱${permit.amount.toLocaleString()}`}
                      />
                      <InfoItem
                        label={
                          <div className="flex items-center gap-2">
                            <CircleCheck className="h-4 w-4 text-muted-foreground" />
                            <span>Status</span>
                          </div>
                        }
                        value={
                          <span
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize gap-1",
                              getPermitStatusStyle(permit.status)
                            )}
                          >
                            <CircleCheck className="h-3.5 w-3.5" />
                            {permit.status}
                          </span>
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No permits issued for this business
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supporting Documents */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Supporting Documents</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            {data.supportingDocuments && data.supportingDocuments.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.supportingDocuments.map((doc) => (
                  <DocumentPreview key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No documents available
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
