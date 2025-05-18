'use server'

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getProjects(page = 1, limit = 10) {
  return genericFind("projects", page, limit);
}

export async function getProjectById(id) {
  return genericFindByID("projects", id);
}

export async function createProject(data) {
  return genericCreate("projects", data, "/dashboard/projects");
}

export async function updateProject({ id, data }) {
  return genericUpdate("projects", id, data, `/dashboard/projects/${id}`);
}

export async function deleteProject(ids) {
  return genericDelete("projects", ids, `/dashboard/projects`);
}

export async function getFinancingOptions() {
  try {
    const response = await genericFind("financing", 1, 100);
    if (!response || !response.docs || !Array.isArray(response.docs)) {
      console.log('Invalid financing response', response);
      return [];
    }
    
    return response.docs.map(record => ({
      label: `${record.title}${record.fiscalYear ? ` (${record.fiscalYear})` : ''}`,
      value: record.id
    }));
  } catch (error) {
    console.error('Error fetching financing options:', error);
    return [];
  }
} 