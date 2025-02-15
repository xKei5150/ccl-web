"use server";

import { payload } from "@/lib/payload";
import { hasRole } from "@/lib/utils";
import { cookies } from "next/headers";

export async function validateUserAccess(user, allowedRoles) {
  if (!user || !hasRole(user, allowedRoles)) {
    throw new Error('Unauthorized access');
  }
  return true;
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("payload-token");

  if (!token) return null;

  try {
    const { user } = await payload.auth({
      headers: {
        Cookie: `payload-token=${token.value}`,
      },
    });

    return {
      ...user,
      permissions: getPermissionsByRole(user.role),
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function getPermissionsByRole(role) {
  const permissions = {
    admin: {
      canManageStaff: true,
      canManageUsers: true,
      canManageContent: true,
      canApproveRequests: true,
      canViewAnalytics: true,
    },
    staff: {
      canManageContent: true,
      canApproveRequests: true,
      canViewAnalytics: true,
    },
    citizen: {
      canSubmitRequests: true,
      canViewOwnContent: true,
    },
  };

  return permissions[role] || {};
}