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
    const newStaff = await payload.create({
        collection: 'users',
        data: {
            ...data,
            role: 'staff',
            active: true,
        },
    });

    revalidatePath('/dashboard/staff');
    return newStaff;
}

export async function updateStaffMember(id, data) {
    const user = await payload.findByID({
        collection: 'users',
        id: id,
    })
    await validateStaffAccess(user);

    const updatedStaff = await payload.update({
        collection: 'users',
        id,
        data: {
            ...data,
            role: 'staff', // Ensure role remains staff
        },
    });

    revalidatePath('/dashboard/staff');
    return updatedStaff;
}

export async function getStaffStats() {
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
}

export async function toggleStaffStatus(id) {

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
  return { success: true };
}

export async function linkPersonalInfo(userId, personalInfoId) {

  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      personalInfo: personalInfoId,
    },
  });

  revalidatePath(`/dashboard/staff/${userId}`);
  return { success: true };
}