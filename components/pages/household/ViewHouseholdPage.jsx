"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import Link from "next/link";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ViewHouseholdPage({ data }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <PageHeader
        title="View Household Record"
        subtitle="View details of a household record"
        icon={<Home className="h-8 w-8" />}
      />
      <div className="grid gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Household Information</CardTitle>
              <Button asChild>
                <Link href={`/dashboard/household/${data.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Family Name" value={data.familyName} />
              <InfoItem
                label="Status"
                value={data.status}
                valueClassName={cn(
                  "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                  getStatusStyle(data.status)
                )}
              />
              <InfoItem label="Local Address" value={data.localAddress} />
              <InfoItem 
                label="Residency Date" 
                value={data.residencyDate ? format(new Date(data.residencyDate), 'PPP') : 'Not specified'} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Household Members
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {data.members && data.members.length > 0 ? (
              <div className="grid gap-4">
                {data.members.map((member, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <InfoItem 
                      label="Member" 
                      value={member.member?.fullName || 'Not specified'}
                      valueClassName="font-medium"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No members added to this household
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}