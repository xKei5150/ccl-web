'use client';

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PenSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileForm from "@/components/profile/ProfileForm";
import { updateUserProfile } from "../actions";
import { useToast } from "@/components/ui/use-toast";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const response = await updateUserProfile(formData);
      if (!response.success) {
        throw new Error(response.error || "Failed to update profile");
      }
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
      router.push('/dashboard/profile');
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 p-6 animate-fadeIn">
      <PageHeader
        title="Edit Profile"
        subtitle="Update your profile information"
        icon={<PenSquare className="h-8 w-8" />}
      >
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard/profile')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>
      </PageHeader>
      
      <div className="max-w-4xl mx-auto">
        <ProfileForm
          defaultValues={user}
          onSubmit={handleSubmit}
          submitText="Update Profile"
        />
      </div>
    </div>
  );
} 