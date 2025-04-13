"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createFeatureItem, updateFeatureItem, deleteFeatureItem } from "./data";

/**
 * Create a new feature item from form submission
 * 
 * @param {FormData} formData - Form data from client
 */
export async function createFeatureAction(formData) {
  try {
    await createFeatureItem(formData);
    // Success path is handled by the data function
  } catch (error) {
    console.error("Error creating feature item:", error);
    return {
      success: false,
      message: "Failed to create item. Please try again."
    };
  }
}

/**
 * Update an existing feature item
 * 
 * @param {string} id - Feature item ID
 * @param {FormData} formData - Form data
 */
export async function updateFeatureAction(id, formData) {
  try {
    await updateFeatureItem(id, formData);
    revalidatePath(`/dashboard/feature/${id}`);
    revalidatePath('/dashboard/feature');
    return {
      success: true,
      message: "Item updated successfully"
    };
  } catch (error) {
    console.error(`Error updating feature item ${id}:`, error);
    return {
      success: false,
      message: "Failed to update item. Please try again."
    };
  }
}

/**
 * Delete a feature item and handle revalidation
 * 
 * @param {string} id - Feature item ID
 */
export async function deleteFeatureAction(id) {
  try {
    await deleteFeatureItem(id);
    revalidatePath('/dashboard/feature');
    return {
      success: true,
      message: "Item deleted successfully"
    };
  } catch (error) {
    console.error(`Error deleting feature item ${id}:`, error);
    return {
      success: false,
      message: "Failed to delete item. Please try again."
    };
  }
}

/**
 * Delete multiple feature items
 * 
 * @param {string[]} ids - Array of feature item IDs
 */
export async function bulkDeleteFeatureAction(ids) {
  try {
    await deleteFeatureItem(ids);
    revalidatePath('/dashboard/feature');
    return {
      success: true,
      message: `${ids.length} items deleted successfully`
    };
  } catch (error) {
    console.error(`Error deleting feature items:`, error);
    return {
      success: false,
      message: "Failed to delete items. Please try again."
    };
  }
} 