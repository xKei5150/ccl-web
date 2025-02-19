"use server";

import { payload } from "@/lib/payload";
import { hasRole } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function validateStaffAccess(user) {
  if (!user || !hasRole(user, ['admin', 'staff'])) {
    throw new Error('Unauthorized access');
  }
}

export async function createStaffMember(data) {
  const { personalInfo, ...rest } = data;
  try {
    const newStaff = await payload.create({
      collection: 'users',
      data: {
        ...rest,
        role: 'staff',
        active: true,
        personalInfo: personalInfo ? {
          relationTo: 'personal-information',
          value: personalInfo
        } : null
      },
    });

    revalidatePath('/dashboard/staff');
    return newStaff;
  } catch (error) {
    throw new Error(error.message || 'Failed to create staff member');
  }
}

export async function updateStaffMember(id, data) {
  const { personalInfo, ...rest } = data;
  try {
    const user = await payload.findByID({
      collection: 'users',
      id: id,
    });
    await validateStaffAccess(user);

    const updatedStaff = await payload.update({
      collection: 'users',
      id,
      data: {
        ...rest,
        role: 'staff', // Ensure role remains staff
        personalInfo: personalInfo ? {
          relationTo: 'personal-information',
          value: personalInfo
        } : null
      },
    });

    revalidatePath('/dashboard/staff');
    revalidatePath(`/dashboard/staff/${id}`);
    return updatedStaff;
  } catch (error) {
    throw new Error(error.message || 'Failed to update staff member');
  }
}

export async function getStaffStats() {
  try {
    const [totalStaff, activeStaff] = await Promise.all([
      payload.find({
        collection: 'users',
        where: {
          role: { equals: 'staff' },
        },
        limit: 0,
      }),
      payload.find({
        collection: 'users',
        where: {
          role: { equals: 'staff' },
          active: { equals: true },
        },
        limit: 0,
      }),
    ]);

    return {
      total: totalStaff.totalDocs,
      active: activeStaff.totalDocs,
      inactive: totalStaff.totalDocs - activeStaff.totalDocs,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch staff statistics');
  }
}

export async function toggleStaffStatus(id) {
  try {
    const staff = await payload.findByID({
      collection: 'users',
      id,
    });

    await payload.update({
      collection: 'users',
      id,
      data: {
        active: !staff.active,
      },
    });

    revalidatePath('/dashboard/staff');
    revalidatePath(`/dashboard/staff/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Failed to toggle staff status');
  }
}

export async function linkPersonalInfo(userId, personalInfoId) {
  try {
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        personalInfo: personalInfoId ? {
          relationTo: 'personal-information',
          value: personalInfoId
        } : null
      },
    });

    revalidatePath(`/dashboard/staff/${userId}`);
    revalidatePath('/dashboard/staff');
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Failed to update personal information link');
  }
}