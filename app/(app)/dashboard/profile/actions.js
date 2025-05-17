'use server';

import { payload } from '@/lib/payload';
import { headers as nextHeaders } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  genericUpdate
} from "@/lib/services/PayloadDataService";

/**
 * Upload a profile photo to the profile-photo collection
 * @param {FormData} formData - FormData containing the photo file
 * @returns {Promise<Object|null>} - Uploaded photo object or null
 */
async function uploadProfilePhoto(formData) {
  try {
    const file = formData.get("photo");  
    if (!file) return null;
    const buffer = Buffer.from(await file.arrayBuffer());

    const payloadFile = {
      name: file.name,
      data: buffer, // Raw buffer data
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
    console.error("Error uploading profile photo:", error);
    return null;
  }
}

/**
 * Update user profile information
 * @param {FormData} formData - Form data containing user profile information
 * @returns {Promise<Object>} - Success status and data/error
 */
export async function updateUserProfile(formData) {
  try {
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Parse form data
    const jsonData = formData.get('json');
    if (!jsonData) {
      return { success: false, error: 'No data provided' };
    }

    const data = JSON.parse(jsonData);
    let personalInfoId = user.personalInfo?.id || null;
    let photoId = null;

    // Handle photo upload if provided
    if (formData.has('photo')) {
      const photo = await uploadProfilePhoto(formData);
      if (photo) {
        photoId = photo.id;
      } else if (data.personalInfo?.photo?.id) {
        // Keep existing photo if upload fails
        photoId = data.personalInfo.photo.id;
      }
    } else if (data.personalInfo?.photo?.id) {
      // Keep existing photo
      photoId = data.personalInfo.photo.id;
    }

    // Prepare personal info data
    const personalInfoData = {
      ...data.personalInfo,
      photo: photoId,
    };

    // Create or update personal info
    let personalInfoResponse;
    if (personalInfoId) {
      personalInfoResponse = await genericUpdate(
        "personal-information",
        personalInfoId,
        personalInfoData
      );
    } else {
      personalInfoResponse = await payload.create({
        collection: 'personal-information',
        data: personalInfoData,
      });
      
      if (personalInfoResponse) {
        personalInfoId = personalInfoResponse.id;
      }
    }

    if (!personalInfoResponse?.success && !personalInfoResponse?.id) {
      return { 
        success: false, 
        error: 'Failed to update personal information'
      };
    }

    // Prepare user data
    const userData = {
      email: data.user.email,
      personalInfo: personalInfoId,
    };

    // Handle password change if provided
    if (data.user.password) {
      userData.password = data.user.password;
    }

    // Update user data
    const userResponse = await genericUpdate(
      "users",
      user.id,
      userData,
      "/dashboard/profile"
    );

    if (!userResponse.success) {
      return { 
        success: false, 
        error: userResponse.message || 'Failed to update user'
      };
    }

    return { 
      success: true, 
      data: userResponse.data 
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error.message || 'Error updating profile'
    };
  }
} 