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

const DEBUG = process.env.NODE_ENV === "development"; // Enable debug logs in development

export async function getReports(page = 1, limit = 10) {
  return genericFind("reports", page, limit);
}

export async function getReport(id) {
  return genericFindByID("reports", id);
}

export async function createReport(data) {
  return genericCreate("reports", data, "/dashboard/reports");
}

export async function updateReport(newData, id) {
  return genericUpdate("reports", id, newData, `/dashboard/reports/${id}`);
}

export async function deleteReport(ids) {
  return genericDelete("reports", ids, `/dashboard/reports`);
}
