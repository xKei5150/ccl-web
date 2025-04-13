"use server";

import { payload } from "@/lib/payload";
import { headers } from 'next/headers';
import { cache } from "react";
import { revalidatePath } from "next/cache";

/**
 * Cached function to fetch collection data from Payload CMS
 * @param {string} collection - Collection name
 * @param {object} options - Query options
 * @returns {Promise<object>} Collection data
 */
export const fetchCollection = cache(async function fetchCollection(
  collection,
  { 
    page = 1, 
    limit = 10, 
    sort = "-createdAt", 
    where = {}, 
    depth = 1,
  } = {}
) {
  try {
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const response = await payload.find({
      collection,
      depth,
      page,
      limit,
      sort,
      where,
      user,
    });
    
    return response;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw new Error(`Failed to fetch ${collection}: ${error.message}`);
  }
});

/**
 * Fetch a single document by ID
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {number} depth - Depth of population
 * @returns {Promise<object>} Document data
 */
export const fetchDocument = cache(async function fetchDocument(
  collection,
  id,
  depth = 1
) {
  try {
    const headersList = headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const document = await payload.findByID({
      collection,
      id,
      depth,
      user,
    });
    
    return document;
  } catch (error) {
    console.error(`Error fetching ${collection} document:`, error);
    throw new Error(`Failed to fetch document: ${error.message}`);
  }
});

/**
 * Create a document in a collection
 * @param {string} collection - Collection name
 * @param {object} data - Document data
 * @param {string} revalidate - Path to revalidate after creation
 * @returns {Promise<object>} Created document
 */
export async function createDocument(collection, data, revalidate) {
  try {
    const headersList = headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const document = await payload.create({
      collection,
      data,
      user,
    });
    
    if (revalidate) {
      revalidatePath(revalidate);
    }
    
    return document;
  } catch (error) {
    console.error(`Error creating ${collection} document:`, error);
    throw new Error(`Failed to create document: ${error.message}`);
  }
}

/**
 * Update a document in a collection
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {object} data - Document data
 * @param {string} revalidate - Path to revalidate after update
 * @returns {Promise<object>} Updated document
 */
export async function updateDocument(collection, id, data, revalidate) {
  try {
    const headersList = headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const document = await payload.update({
      collection,
      id,
      data,
      user,
    });
    
    if (revalidate) {
      revalidatePath(revalidate);
    }
    
    return document;
  } catch (error) {
    console.error(`Error updating ${collection} document:`, error);
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

/**
 * Delete a document from a collection
 * @param {string} collection - Collection name
 * @param {string} id - Document ID
 * @param {string} revalidate - Path to revalidate after deletion
 * @returns {Promise<object>} Delete result
 */
export async function deleteDocument(collection, id, revalidate) {
  try {
    const headersList = headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const result = await payload.delete({
      collection,
      id,
      user,
    });
    
    if (revalidate) {
      revalidatePath(revalidate);
    }
    
    return result;
  } catch (error) {
    console.error(`Error deleting ${collection} document:`, error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
} 