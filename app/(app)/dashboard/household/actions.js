import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getHouseholds(page = 1, limit = 10) {
  return genericFind("households", page, limit);
}

export async function getHousehold(id) {
  return genericFindByID("households", id);
}

export async function createHousehold(data) {
  return genericCreate("households", data, "/dashboard/household");
}

export async function updateHousehold(newData, id) {
  return genericUpdate("households", id, newData, `/dashboard/household/${id}`);
}

export async function deleteHousehold(ids) {
  return genericDelete("households", ids, `/dashboard/household`);
}