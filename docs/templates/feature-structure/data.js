"use server";

import { fetchCollection, fetchDocument, createDocument, updateDocument, deleteDocument } from '@/lib/data-fetching';
import { notFound } from 'next/navigation';

/**
 * Fetch feature data with pagination and filters
 * 
 * @param {object} searchParams - Query parameters
 * @returns {Promise<object>} Feature data with pagination
 */
export async function fetchFeatureData(searchParams = {}) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const status = searchParams?.status;
  const category = searchParams?.category;
  const search = searchParams?.search;
  const sort = searchParams?.sort || '-createdAt';
  
  const queryParams = {
    page,
    limit,
    sort,
  };
  
  if (status) {
    queryParams.filters = { ...queryParams.filters, status };
  }
  
  if (category) {
    queryParams.filters = { ...queryParams.filters, category };
  }
  
  if (search) {
    queryParams.search = search;
  }
  
  return fetchCollection('feature', queryParams);
}

/**
 * Fetch a single feature item by ID
 * 
 * @param {string} id - Feature item ID
 * @returns {Promise<object>} Feature item
 */
export async function fetchFeatureItem(id) {
  try {
    const item = await fetchDocument('feature', id);
    
    if (!item) {
      return notFound();
    }
    
    return item;
  } catch (error) {
    console.error(`Error fetching feature item ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new feature item
 * 
 * @param {FormData} formData - Form data
 * @param {string} redirectPath - Path to redirect after creation
 * @returns {Promise<object>} Created feature item
 */
export async function createFeatureItem(formData, redirectPath = '/dashboard/feature') {
  const data = Object.fromEntries(formData.entries());
  
  // Process form data if needed
  // e.g., convert date strings to Date objects
  if (data.date) {
    data.date = new Date(data.date);
  }
  
  return createDocument('feature', data, redirectPath);
}

/**
 * Update a feature item
 * 
 * @param {string} id - Feature item ID
 * @param {FormData} formData - Form data
 * @param {string} redirectPath - Path to redirect after update
 * @returns {Promise<object>} Updated feature item
 */
export async function updateFeatureItem(id, formData, redirectPath = '/dashboard/feature') {
  const data = Object.fromEntries(formData.entries());
  
  // Process form data if needed
  // e.g., convert date strings to Date objects
  if (data.date) {
    data.date = new Date(data.date);
  }
  
  return updateDocument('feature', id, data, redirectPath);
}

/**
 * Delete feature item(s)
 * 
 * @param {string|string[]} ids - Feature item ID or array of IDs
 * @returns {Promise<object>} Delete result
 */
export async function deleteFeatureItem(ids) {
  return deleteDocument('feature', ids);
} 