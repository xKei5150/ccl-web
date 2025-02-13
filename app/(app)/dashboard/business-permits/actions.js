// app/(app)/dashboard/business/action.js
import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

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

export async function deleteBusinessPermit(ids) {
  return genericDelete("business-permits", ids, `/dashboard/business-permits`);
}