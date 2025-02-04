"use client";

import { Button } from "@/components/ui/button";
import StaffCard from "@/components/layout/StaffCard";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for staff members
const staffMembers = [
  {
    id: 1,
    name: "Jonathan Ive",
    role: "Product Designer",
    photoUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "UX Researcher",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 3,
    name: "Michael Ross",
    role: "Developer",
    photoUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
  },
];

export default function Staff() {
  const router = useRouter();

  const handleAddStaff = () => {
    router.push("/dashboard/staff/new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Our Team</h1>
          <Button onClick={handleAddStaff} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((staff) => (
            <StaffCard
              key={staff.id}
              name={staff.name}
              role={staff.role}
              photoUrl={staff.photoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
