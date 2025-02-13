"use server";

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getStaffMembers(page = 1, limit = 10) {
  return genericFind("users", page, limit, {
    where: {
      role: { equals: 'staff' },
    },
  });
}

export async function getStaffMember(id) {
  return genericFindByID("users", id);
}

export async function createStaffMember(data) {
  const staffData = {
    ...data,
    role: 'staff',
  };
  return genericCreate("users", staffData, "/dashboard/staff");
}

export async function updateStaffMember(newData, id) {
  return genericUpdate("users", id, newData, `/dashboard/staff/${id}`);
}

export async function deleteStaffMember(ids) {
  return genericDelete("users", ids, `/dashboard/staff`);
}