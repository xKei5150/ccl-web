"use server";

import { fetchCollection, fetchDocument, createDocument, updateDocument, deleteDocument } from '@/lib/data-fetching';
import { payload } from '@/lib/payload';

/**
 * Fetch personal records with pagination
 * 
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Promise<object>} Personal records
 */
export async function fetchPersonalRecords(page = 1, limit = 10) {
  return fetchCollection('personal-information', {
    page,
    limit,
    sort: '-createdAt',
  });
}

/**
 * Fetch a single personal record
 * 
 * @param {string} id - Record ID
 * @returns {Promise<object>} Personal record
 */
export async function fetchPersonalRecord(id) {
  return fetchDocument('personal-information', id);
}

/**
 * Upload a photo to the profile-photo collection
 * 
 * @param {FormData} formData - Form data with photo
 * @returns {Promise<object|null>} Uploaded photo or null
 */
async function uploadPhoto(formData) {
  try {
    const file = formData.get("photo");  
    if (!file) return null;
    const buffer = Buffer.from(await file.arrayBuffer());

    const payloadFile = {
      name: file.name,
      data: buffer,
      size: file.size,
      mimetype: file.type,
    };

    const uploadResponse = await payload.create({
      collection: "profile-photo",
      data: { alt: file.name },
      file: payloadFile,
    });

    if (!uploadResponse?.id) {
      throw new Error("Failed to upload photo");
    }

    return uploadResponse;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw new Error("Failed to upload photo");
  }
}

/**
 * Create a new personal record
 * 
 * @param {FormData} formData - Form data
 * @returns {Promise<object>} Created record
 */
export async function createPersonalRecord(formData) {
  try {
    const jsonData = JSON.parse(formData.get("json"));
    let photoData = null;

    if (formData.has("photo")) {
      const photo = await uploadPhoto(formData);
      if (photo) {
        photoData = photo;
      }
    }

    const data = {
      ...jsonData,
      photo: photoData,
    };

    return createDocument('personal-information', data, '/dashboard/personal');
  } catch (error) {
    console.error("Error creating personal record:", error);
    throw new Error("Failed to create personal record");
  }
}

/**
 * Update an existing personal record
 * 
 * @param {FormData} formData - Form data
 * @param {string} id - Record ID
 * @returns {Promise<object>} Updated record
 */
export async function updatePersonalRecord(formData, id) {
  try {
    const jsonData = JSON.parse(formData.get("json"));

    let data = {
      ...jsonData,
    };
    
    if (formData.has("photo")) {
      let photoData = jsonData.photo;
      const photo = await uploadPhoto(formData);
      if (photo) {
        photoData = photo;
      }
      data = {
        ...data,
        photo: photoData,
      };
    }

    return updateDocument('personal-information', id, data, `/dashboard/personal/${id}`);
  } catch (error) {
    console.error("Error updating personal record:", error);
    throw new Error("Failed to update personal record");
  }
}

/**
 * Delete personal records
 * 
 * @param {string[]} ids - Record IDs to delete
 * @returns {Promise<object>} Delete result
 */
export async function deletePersonalRecord(ids) {
  if (Array.isArray(ids)) {
    // Batch delete
    const promises = ids.map(id => deleteDocument('personal-information', id));
    await Promise.all(promises);
    return { success: true };
  } else {
    // Single delete
    return deleteDocument('personal-information', ids, '/dashboard/personal');
  }
} 