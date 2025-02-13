// app/(app)/dashboard/business/action.js
import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getBusinesses(page = 1, limit = 10) {
  return genericFind("business", page, limit);
}

export async function getBusiness(id) {
  return genericFindByID("business", id);
}

export async function createBusiness(data) {
  return genericCreate("business", data, "/dashboard/business");
}
export async function updateBusiness(newData, id) {
  return genericUpdate("business", id, newData, `/dashboard/business/${id}`);
}

export async function deleteBusiness(ids) {
  return genericDelete("business", ids, `/dashboard/business`);
}