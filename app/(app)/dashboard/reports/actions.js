// app/dashboard/reports/actions.js (Server Actions)
"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { updateSupportingDocuments } from "@/lib/actions/supportingDocuments";

const DEBUG = process.env.NODE_ENV === "development"; // Enable debug logs in development

export async function getReport(id) {
  try {
    const report = await payload.findByID({
      collection: "reports",
      id: id,
    });
    return report;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null; // Or a similar error object as in updateReport
  }
}

export async function updateReport(newData, id) {
  try {
    DEBUG && console.debug("Updating report with ID:", id, "Data:", newData);
    const oldData = await payload.findByID({
      collection: "reports",
      id: id,
    });
    if (!oldData) {
      return { success: false, message: "Report not found", statusCode: 404 };
    }

    const docResult = await updateSupportingDocuments(oldData, newData); //existingReport to existingReport.doc
    if (!docResult.success) {
      return docResult; // Return directly if document handling failed
    }

    const reportData = {
      ...newData,
      supportingDocuments: docResult.data, // Use the document IDs from the handler
    };

    const updatedReport = await payload.update({
      collection: "reports",
      id,
      data: reportData,
    });

    revalidatePath(`/dashboard/reports/${id}`);
    return {
      success: true,
      data: updatedReport,
      message: "Report updated successfully",
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error updating report:", error);
    // No need to handle orphaned documents here; handleSupportingDocuments takes care of it.
    return {
      success: false,
      message: `Error updating report: ${error.message}`,
      statusCode: 500,
    };
  }
}
