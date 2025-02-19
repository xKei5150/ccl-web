"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  toggleStaffStatus, 
  linkPersonalInfo,
  createStaffMember,
  updateStaffMember 
} from '@/lib/actions/staff';

export function useStaffManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleStatusToggle(id) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await toggleStaffStatus(id);
      toast({
        title: 'Success',
        description: 'Staff status updated successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff status',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLinkPersonalInfo(userId, personalInfoId) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await linkPersonalInfo(userId, personalInfoId);
      toast({
        title: 'Success',
        description: personalInfoId 
          ? 'Personal information linked successfully'
          : 'Personal information unlinked successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update personal information',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateStaff(data) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await createStaffMember(data);
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
      router.push('/dashboard/staff');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateStaff(id, data) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateStaffMember(id, data);
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
      router.push('/dashboard/staff');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff member',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    handleStatusToggle,
    handleLinkPersonalInfo,
    handleCreateStaff,
    handleUpdateStaff,
  };
}