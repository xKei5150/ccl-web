"use server";

import { payload } from '@/lib/payload';
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' });
    return settings || {};
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

async function uploadMedia(file) {
  if (!file) return { success: false, message: "No file provided" };
  
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const payloadFile = {
      name: file.name,
      data: buffer,
      size: file.size,
      mimetype: file.type,
    };

    const uploadResponse = await payload.create({
      collection: "media",
      data: {
        alt: file.name,
      },
      file: payloadFile,
    });

    if (!uploadResponse.id) {
      return {
        success: false,
        message: "Failed to upload media: No ID returned",
      };
    }

    return { success: true, data: uploadResponse };
  } catch (error) {
    console.error("Error uploading media:", error);
    return {
      success: false,
      message: `Failed to upload media: ${error.message}`,
    };
  }
}

export async function updateSiteSettings(data) {
  if (!data) {
    throw new Error("No data provided");
  }
  
  try {
    const updatedData = { ...data };
    
    // Process image uploads
    const imageFields = ['heroImage', 'logo', 'favicon', 'authImage'];
    for (const field of imageFields) {
      // Skip if field doesn't exist or if it's not an array (no new upload)
      if (!updatedData[field] || !Array.isArray(updatedData[field])) continue;
      
      // If there's a new file to upload
      if (updatedData[field][0] instanceof File) {
        const uploadResult = await uploadMedia(updatedData[field][0]);
        
        if (uploadResult.success) {
          updatedData[field] = uploadResult.data;
        } else {
          console.error(`Failed to upload ${field}:`, uploadResult.message);
          // Keep existing image if upload fails
          delete updatedData[field];
        }
      } else if (updatedData[field].length === 0) {
        // If the array is empty, remove the image
        updatedData[field] = null;
      } else {
        // If it's something unexpected, remove it to prevent errors
        delete updatedData[field];
      }
    }

    // Update the global settings
    await payload.updateGlobal({ 
      slug: 'site-settings', 
      data: updatedData 
    });
    
    // Make sure changes are reflected immediately
    revalidatePath('/dashboard/site-settings');
    revalidatePath('/dashboard');
    revalidatePath('/auth');
    
    return { success: true };
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw new Error(`Failed to update site settings: ${error.message}`);
  }
}