import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStaffMember } from "../actions";
import { Users, Clock, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PersonalInfoLinkCard } from "@/components/pages/staff/PersonalInfoLinkCard";
import { PersonalInfoDisplay } from "@/components/pages/staff/PersonalInfoDisplay";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { payload } from "@/lib/payload";

function formatDate(date) {
  return date ? format(new Date(date), "PPP") : "N/A";
}

function StaffInfo({ staff }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="h-20 w-20">
            {staff.personalInfo?.photo ? (
              <AvatarImage src={staff.personalInfo.photo.url} />
            ) : (
              <AvatarFallback className="text-xl">
                {staff.personalInfo?.name?.firstName?.[0] || staff.email[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">
              {staff.personalInfo?.name?.fullName || staff.email}
            </h2>
            <div className="flex gap-2">
              <Badge>{staff.role}</Badge>
              <Badge variant={staff.active ? "success" : "destructive"}>
                {staff.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{staff.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Member Since</label>
            <p className="mt-1">{formatDate(staff.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StaffTimeline({ staff }) {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Activity Timeline</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Account created on {formatDate(staff.createdAt)}</span>
          </div>
          {staff.updatedAt !== staff.createdAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Last updated on {formatDate(staff.updatedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function StaffDetails({ params }) {
  const { id } = await params;
  const { data: staff } = await getStaffMember(id);
  const { docs: personalInfoList } = await payload.find({
    collection: 'personal-information',
    depth: 1,
    limit: 100,
  });

  if (!staff) {
    notFound();
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Staff Details"
        subtitle={staff.personalInfo?.name?.fullName || staff.email}
        icon={<Users className="h-8 w-8" />}
        action={
          <Link href={`/dashboard/staff/${id}/edit`}>
            <Button>Edit Staff</Button>
          </Link>
        }
      />

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="gap-2">
            <Users className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="personal" className="gap-2">
            <FileText className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Clock className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <StaffInfo staff={staff} />
        </TabsContent>

        <TabsContent value="personal">
          {staff.personalInfo ? (
            <PersonalInfoDisplay 
              info={staff.personalInfo} 
              staff={staff}
            />
          ) : (
            <PersonalInfoLinkCard 
              staff={staff} 
              personalInfoList={personalInfoList} 
            />
          )}
        </TabsContent>

        <TabsContent value="activity">
          <StaffTimeline staff={staff} />
        </TabsContent>
      </Tabs>
    </div>
  );
}