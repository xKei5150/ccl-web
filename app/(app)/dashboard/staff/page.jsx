"use client";

import { Button } from "@/components/ui/button";
import StaffCard from "@/components/layout/StaffCard";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for staff members
const staffMembers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    role: "Barangay Captain",
    photoUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 2,
    name: "Maria Clara",
    role: "Barangay Secretary",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 3,
    name: "Jose Rizal",
    role: "Barangay Treasurer",
    photoUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
  },
  {
    id: 4,
    name: "Andres Bonifacio",
    role: "Barangay Kagawad",
    photoUrl: "https://images.unsplash.com/photo-1502767089025-6572583495b9",
  },
  {
    id: 5,
    name: "Emilio Aguinaldo",
    role: "Barangay Tanod",
    photoUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    id: 6,
    name: "Gabriela Silang",
    role: "Barangay Health Worker",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    id: 7,
    name: "Lapu-Lapu",
    role: "Barangay Maintenance",
    photoUrl: "https://images.unsplash.com/photo-1502767089025-6572583495b9",
  },
  {
    id: 8,
    name: "Melchora Aquino",
    role: "Barangay Volunteer",
    photoUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    id: 9,
    name: "Apolinario Mabini",
    role: "Barangay Coordinator",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
  {
    id: 10,
    name: "Diego Silang",
    role: "Barangay Treasurer",
    photoUrl: "https://images.unsplash.com/photo-1502767089025-6572583495b9",
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
          <h1 className="text-3xl font-semibold text-gray-900">Barangay Staff</h1>
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
