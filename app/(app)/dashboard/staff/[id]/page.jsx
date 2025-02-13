import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStaffMember } from "../../actions";
import { Users, Clock, FileText, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PersonalInfoSelect } from "@/components/form/PersonalInfoSelect";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { payload } from "@/lib/payload";

export async function generateMetadata({ params }) {
  const { id } = params;
  const { data: staff } = await getStaffMember(id);
  
  if (!staff) return {
    title: "Staff Not Found | CCL",
    description: "The requested staff member could not be found",
  };

  return {
    title: `${staff.email} | Staff Details | CCL`,
    description: `View staff member details for ${staff.email}`,
  };
}

function StaffInfo({ staff }) {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Basic Information</CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1">{staff.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className={`mt-1 inline-flex px-2 py-1 rounded-full text-sm ${
              staff.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {staff.active ? "Active" : "Inactive"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 capitalize">{staff.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Member Since</label>
            <p className="mt-1">{format(new Date(staff.createdAt), "PPP")}</p>
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
            <span>Account created on {format(new Date(staff.createdAt), "PPP")}</span>
          </div>
          {staff.updatedAt !== staff.createdAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Last updated on {format(new Date(staff.updatedAt), "PPP")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PersonalInformation({ staff, personalInfoList }) {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">Personal Information</CardHeader>
      <CardContent className="space-y-4">
        {staff.personalInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1">{staff.personalInfo.name?.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Number</label>
              <p className="mt-1">{staff.personalInfo.contactNumber || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="mt-1">{staff.personalInfo.address || "N/A"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-4">No personal information linked</p>
            <PersonalInfoSelect
              userId={staff.id}
              personalInfo={personalInfoList}
              className="w-[250px] mx-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function StaffDetails({ params }) {
  const { id } = params;
  const { data: staff } = await getStaffMember(id);
  const personalInfo = await payload.find({
    collection: 'personal-information',
    limit: 100,
  });

  if (!staff) {
    notFound();
  }

  return (
    <>
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Staff Details"
        subtitle={staff.email}
        icon={<Users className="h-8 w-8" />}
        actions={
          <Link href={`/dashboard/staff/${id}/edit`}>
            <Button>Edit Staff</Button>
          </Link>
        }
      />

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
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

        <TabsContent value="info" className="space-y-6">
          <StaffInfo staff={staff} />
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInformation 
            staff={staff} 
            personalInfoList={personalInfo.docs} 
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <StaffTimeline staff={staff} />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}