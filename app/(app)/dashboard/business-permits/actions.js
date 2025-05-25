// app/(app)/dashboard/business/action.js
"use server";

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { revalidatePath } from "next/cache";

export async function getBusinessPermits(page = 1, limit = 10) {
  return genericFind("business-permits", page, limit);
}

export async function getBusinessPermit(id) {
  return genericFindByID("business-permits", id);
}

export async function createBusinessPermit(data) {
  return genericCreate("business-permits", data, "/dashboard/business-permits");
}
export async function updateBusinessPermit(newData, id) {
  return genericUpdate("business-permits", id, newData, `/dashboard/business-permits/${id}`);
}

export async function updateBusinessPermitStatus(id, statusData) {
  try {
    if (!id) {
      throw new Error("Business Permit ID is required");
    }

    const result = await genericUpdate("business-permits", id, statusData);
    
    if (result.success) {
      revalidatePath("/dashboard/business-permits");
    }
    
    return result;
  } catch (error) {
    console.error("Error updating business permit status:", error);
    throw error;
  }
}

export async function deleteBusinessPermit(ids) {
  return genericDelete("business-permits", ids, `/dashboard/business-permits`);
}