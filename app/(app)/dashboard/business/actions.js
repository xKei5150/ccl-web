"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBusiness,
  updateBusiness,
  deleteBusiness
} from "./data";

/**
 * Create a new business from form submission
 * 
 * @param {FormData} formData - Form data from client
 */
export async function createBusinessAction(formData) {
  try {
    await createBusiness(formData);
    // Success path is handled by the data function with redirect
  } catch (error) {
    console.error("Error creating business:", error);
    return {
      success: false,
      message: "Failed to create business. Please try again."
    };
  }
}

/**
 * Update an existing business
 * 
 * @param {string} id - Business ID
 * @param {FormData} formData - Form data
 */
export async function updateBusinessAction(id, formData) {
  try {
    await updateBusiness(id, formData);
    revalidatePath(`/dashboard/business/${id}`);
    revalidatePath('/dashboard/business');
    return {
      success: true,
      message: "Business updated successfully"
    };
  } catch (error) {
    console.error(`Error updating business ${id}:`, error);
    return {
      success: false,
      message: "Failed to update business. Please try again."
    };
  }
}

/**
 * Delete a business and handle revalidation
 * 
 * @param {string} id - Business ID
 */
export async function deleteBusinessAction(id) {
  try {
    await deleteBusiness(id);
    revalidatePath('/dashboard/business');
    return {
      success: true,
      message: "Business deleted successfully"
    };
  } catch (error) {
    console.error(`Error deleting business ${id}:`, error);
    return {
      success: false,
      message: "Failed to delete business. Please try again."
    };
  }
}

/**
 * Delete multiple businesses
 * 
 * @param {string[]} ids - Array of business IDs
 */
export async function bulkDeleteBusinessAction(ids) {
  try {
    await deleteBusiness(ids);
    revalidatePath('/dashboard/business');
    return {
      success: true,
      message: `${ids.length} businesses deleted successfully`
    };
  } catch (error) {
    console.error(`Error deleting businesses:`, error);
    return {
      success: false,
      message: "Failed to delete businesses. Please try again."
    };
  }
}