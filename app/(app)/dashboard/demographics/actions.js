"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { headers } from "next/headers";

const DEBUG = process.env.NODE_ENV === "development"; // Enable debug logs in development

export async function getDemographics(page = 1, limit = 10) {
  try {
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });
    
    // If user is not admin/staff, only show their records
    const query = {
      where: {}
    };
    
    if (user && !['admin', 'staff'].includes(user.role)) {
      query.where = {
        'submittedBy': {
          equals: user.id
        }
      };
    }
    
    // Sort by year (descending - most recent first)
    query.sort = '-year';
    
    return genericFind("demographics", page, limit, query);
  } catch (e) {
    console.error("Error fetching demographics:", e);
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
      nextPage: null,
    };
  }
}

export async function getDemographic(id) {
  return genericFindByID("demographics", id);
}

export async function checkYearExists(year) {
  try {
    const result = await payload.find({
      collection: "demographics",
      where: {
        year: {
          equals: Number(year)
        }
      }
    });
    
    return {
      success: true,
      exists: result.docs.length > 0,
      message: result.docs.length > 0 ? `Demographic record for year ${year} already exists` : "",
      statusCode: 200
    };
  } catch (error) {
    console.error("Error checking year existence:", error);
    return {
      success: false,
      exists: false,
      message: `Error checking if year exists: ${error.message}`,
      statusCode: 500
    };
  }
}

export async function createDemographic(data) {
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });
  
  // Check if year already exists
  const yearCheck = await checkYearExists(data.year);
  if (yearCheck.exists) {
    return {
      success: false,
      message: yearCheck.message,
      statusCode: 409 // Conflict
    };
  }
  
  // Calculate total population from male + female if not provided
  if (!data.totalPopulation) {
    data.totalPopulation = Number(data.maleCount || 0) + Number(data.femaleCount || 0);
  }
  
  // Set submitter
  data = {
    ...data,
    submittedBy: user.id,
  };
  
  // Check if age groups total exceeds total population
  const ageGroupsTotal = data.ageGroups?.reduce((sum, group) => sum + Number(group.count || 0), 0) || 0;
  if (ageGroupsTotal > data.totalPopulation) {
    console.warn("Warning: Age groups total exceeds total population");
  }
  
  return genericCreate("demographics", data, "/dashboard/demographics");
}

export async function updateDemographic(newData, id) {
  // If year is changing, check if the new year already exists in another record
  const existingRecord = await getDemographic(id);
  
  if (existingRecord.success && existingRecord.data.year !== Number(newData.year)) {
    const yearCheck = await checkYearExists(newData.year);
    if (yearCheck.exists) {
      return {
        success: false,
        message: yearCheck.message,
        statusCode: 409 // Conflict
      };
    }
  }
  
  // Calculate total population from male + female if not provided
  if (!newData.totalPopulation) {
    newData.totalPopulation = Number(newData.maleCount || 0) + Number(newData.femaleCount || 0);
  }
  
  // Check if age groups total exceeds total population
  const ageGroupsTotal = newData.ageGroups?.reduce((sum, group) => sum + Number(group.count || 0), 0) || 0;
  if (ageGroupsTotal > newData.totalPopulation) {
    console.warn("Warning: Age groups total exceeds total population");
  }
  
  return genericUpdate("demographics", id, newData, `/dashboard/demographics/${id}`);
}

export async function deleteDemographic(ids) {
  return genericDelete("demographics", ids, `/dashboard/demographics`);
} 