'use client';

import { useAuth } from "@/hooks/use-auth";
import UserProfile from "@/components/layout/UserProfile";
import { PageHeader } from "@/components/layout/PageHeader";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 px-4 py-6 space-y-8">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
        icon={<User className="h-8 w-8" />}
      />
      
      <div className="max-w-4xl mx-auto">
      <UserProfile 
        personalInfo={user?.personalInfo}
        role={role}
      />
      </div>
    </div>
  );
}