import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getRequests(page = 1, limit = 10) {
  return genericFind("requests", page, limit);
}

export async function getRequest(id) {
  return genericFindByID("requests", id);
}

export async function createRequest(data) {
  return genericCreate("requests", data, "/dashboard/general-requests");
}

export async function updateRequest(newData, id) {
  return genericUpdate("requests", id, newData, `/dashboard/general-requests/${id}`);
}

export async function deleteRequest(ids) {
  return genericDelete("requests", ids, `/dashboard/general-requests`);
}