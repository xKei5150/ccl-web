"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SquareGanttChart } from "lucide-react";

// Mock data - replace with actual data fetching
const mockRecord = {
  photo: "123e4567-e89b-12d3-a456-426614174000",
  firstName: "Juan",
  middleName: "Santos",
  lastName: "Dela Cruz",
  birthDate: new Date("1990-01-01"),
  sex: "male",
  contactNo: [9123456789],
  emailAddress: "juan@example.com",
  localAddress: "123 Main St.",
  lifeStatus: "alive",
  citizenship: "Filipino",
  maritalStatus: "single",
  residencyStatus: "owned",
};

export default function ViewPersonalRecord() {
    const params = useParams();
    const id = params.id;

  return (
<>
        <PageHeader
          title="View Personal Record"
          subtitle="View details of a personal record"
          icon={<SquareGanttChart className="h-8 w-8" />}
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/placeholder.svg`} alt={`${mockRecord.firstName} ${mockRecord.lastName}`} />
                  <AvatarFallback>{mockRecord.firstName[0]}{mockRecord.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">
                    {mockRecord.firstName} {mockRecord.middleName} {mockRecord.lastName}
                  </h3>
                  <p className="text-gray-500">{mockRecord.emailAddress}</p>
                </div>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Birth Date</dt>
                  <dd className="mt-1">{mockRecord.birthDate.toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Sex</dt>
                  <dd className="mt-1">{mockRecord.sex}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Contact Number</dt>
                  <dd className="mt-1">{mockRecord.contactNo.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Local Address</dt>
                  <dd className="mt-1">{mockRecord.localAddress}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Life Status</dt>
                  <dd className="mt-1">{mockRecord.lifeStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Citizenship</dt>
                  <dd className="mt-1">{mockRecord.citizenship}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Marital Status</dt>
                  <dd className="mt-1">{mockRecord.maritalStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Residency Status</dt>
                  <dd className="mt-1">{mockRecord.residencyStatus}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        </>
  );
}