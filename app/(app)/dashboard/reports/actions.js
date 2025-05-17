// app/dashboard/reports/actions.js (Server Actions)
"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { updateSupportingDocuments } from "@/lib/actions/supportingDocuments";
import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { headers } from "next/headers";

const DEBUG = process.env.NODE_ENV === "development"; // Enable debug logs in development

export async function getReports(page = 1, limit = 10) {
  try {
        const headersList = await headers();
        const { user } = await payload.auth({ headers: headersList });
        
        // If user is not admin/staff, only show their requests
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
    return genericFind("reports", page, limit, query);
  } catch (e) {
    console.error("Error fetching reports:", e);
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

export async function getReport(id) {
  return genericFindByID("reports", id);
}

export async function createReport(data) {
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });
  data = {
    ...data,
    submittedBy: user.id,
  };
  return genericCreate("reports", data, "/dashboard/reports");
}

export async function updateReport(newData, id) {
  try {
    // Make sure we have an ID
    if (!id) {
      return {
        success: false,
        message: "Report ID is required for update",
        statusCode: 400,
      };
    }

    // Clean up the newData object to ensure only valid fields are passed
    const cleanData = {
      title: newData.title,
      date: newData.date,
      description: newData.description,
      location: newData.location,
      reportStatus: newData.reportStatus,
      involvedPersons: newData.involvedPersons || [],
      supportingDocuments: newData.supportingDocuments || []
    };

    // Debug logging
    if (DEBUG) {
      console.log("Updating report with ID:", id);
      console.log("Update data:", cleanData);
    }

    return genericUpdate("reports", id, cleanData, `/dashboard/reports/${id}`);
  } catch (error) {
    console.error("Error in updateReport:", error);
    return {
      success: false,
      message: error.message || "Failed to update report",
      statusCode: 500,
    };
  }
}

export async function deleteReport(ids) {
  return genericDelete("reports", ids, `/dashboard/reports`);
}
