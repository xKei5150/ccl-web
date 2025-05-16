"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, PenSquare, ArrowLeft, MapPin, Calendar, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function ViewHouseholdPage({ data }) {
  const router = useRouter();
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={data.familyName}
        subtitle="Household Record Details"
        icon={<Home className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/household')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          <Button
            onClick={() => router.push(`/dashboard/household/${data.id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Record
          </Button>
        </div>
      </PageHeader>
      
      <main className="max-w-6xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle>Household Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                label={
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>Family Name</span>
                  </div>
                } 
                value={data.familyName} 
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <CircleCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                }
                value={
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1",
                    getStatusStyle(data.status)
                  )}>
                    <CircleCheck className="h-3.5 w-3.5" />
                    {data.status}
                  </span>
                }
              />
              <InfoItem 
                label={
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Local Address</span>
                  </div>
                } 
                value={data.localAddress} 
              />
              <InfoItem 
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Residency Date</span>
                  </div>
                } 
                value={data.residencyDate ? format(new Date(data.residencyDate), 'PPP') : 'Not specified'} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Household Members</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            {data.members && data.members.length > 0 ? (
              <div className="grid gap-4">
                {data.members.map((member, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <InfoItem 
                      label={
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Member</span>
                        </div>
                      } 
                      value={
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-medium"
                          onClick={() => member.member?.id && router.push(`/dashboard/personal/${member.member.id}`)}
                        >
                          {member.member?.name?.fullName || 'Not specified'}
                        </Button>
                      }
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
      </main>
    </div>
  );
}