"use server";

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { payload } from "@/lib/payload";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getRequests(page = 1, limit = 10) {
  try {
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });
    
    // If user is not admin/staff, only show their requests
    const query = {
      where: {}
    };
    
    if (user && !['admin', 'staff'].includes(user.role)) {
      query.where = {
        person: {
          equals: user.personalInfo.id
        }
      };
    }
    
    return genericFind("requests", page, limit, query);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return {
      docs: [],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    };
  }
}

export async function getRequest(id) {
  return genericFindByID("requests", id);
}

export async function createRequest(data) {
  const headersList = headers();
  const { user } = await payload.auth({ headers: headersList });
  
  // For citizens, automatically set the person field to their personal info
  if (user && !['admin', 'staff'].includes(user.role)) {
    data.person = user.personalInfo;
  }
  
  return genericCreate("requests", data, "/dashboard/general-requests");
}

export async function updateRequest(newData, id) {
  return genericUpdate("requests", id, newData, `/dashboard/general-requests/${id}`);
}

export async function updateRequestStatus(id, statusData) {
  try {
    if (!id) {
      throw new Error("Request ID is required");
    }

    const result = await genericUpdate("requests", id, statusData);
    
    if (result.success) {
      revalidatePath("/dashboard/general-requests");
    }
    
    return result;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
}

export async function deleteRequest(ids) {
  return genericDelete("requests", ids, `/dashboard/general-requests`);
}