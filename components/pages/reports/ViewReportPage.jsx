"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClipboardList, PenSquare, ArrowLeft, Calendar, MapPin, Tag, User, FileText, MessageCircle, Users } from "lucide-react";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

function ViewReportPage({ data }) {
  const router = useRouter();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "inProgress":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={data.title}
        subtitle="Report Details"
        icon={<ClipboardList className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/reports')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          {hasAdminAccess && (
            <Button
              onClick={() => router.push(`/dashboard/reports/${data.id}/edit`)}
              className="flex items-center gap-2"
            >
              <PenSquare className="h-4 w-4" />
              Edit Report
            </Button>
          )}
        </div>
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Report Overview */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Report Overview</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date</span>
                  </div>
                }
                value={new Date(data.date).toLocaleDateString()}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location</span>
                  </div>
                }
                value={data.location}
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
                      getStatusStyle(data.reportStatus)
                    )}
                  >
                    {data.reportStatus === "inProgress" ? "In Progress" : data.reportStatus}
                  </span>
                }
              />
            </div>

            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                Description
              </h4>
              <p className="text-gray-900 whitespace-pre-wrap">{data.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Involved Persons */}
        {data.involvedPersons?.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Involved Party</CardTitle>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {data.involvedPersons.map((person, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoItem
                          label={
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Name</span>
                            </div>
                          }
                          value={person.name}
                        />
                        <InfoItem
                          label={
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>Role</span>
                            </div>
                          }
                          value={<span className="capitalize">{person.role}</span>}
                        />
                        {person.personalInfo && (
                          <InfoItem
                            label={
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Personal Information</span>
                              </div>
                            }
                            value={person.personalInfo}
                          />
                        )}
                      </div>
                      {person.statement && (
                        <div className="mt-4">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            Statement
                          </h4>
                          <p className="text-gray-900 whitespace-pre-wrap">{person.statement}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
}

export default ViewReportPage;