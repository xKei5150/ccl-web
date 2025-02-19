'use client';

import { useAuth } from "@/hooks/use-auth";
import UserProfile from "@/components/layout/UserProfile";
import ActivityTable from "@/components/layout/ActivityTable";

export default function ProfilePage() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 px-4 space-y-8">
      <UserProfile 
        personalInfo={user?.personalInfo}
        role={role}
      />
    </div>
  );
}