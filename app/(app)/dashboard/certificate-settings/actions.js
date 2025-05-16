"use server";

import { payload } from "@/lib/payload";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Fetch certificate settings
export async function getCertificateSettings() {
  try {
    const headersList = await headers();
    await payload.auth({ headers: headersList });
    
    const certificateSettings = await payload.findGlobal({
      slug: 'certificate-settings',
    });
    
    return certificateSettings;
  } catch (error) {
    console.error('Error fetching certificate settings:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch certificate settings',
    };
  }
}

// Update certificate settings
export async function updateCertificateSettings(data) {
  try {
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user || !['admin', 'staff'].includes(user.role)) {
      throw new Error('Unauthorized to update certificate settings');
    }
    
    // Process image uploads if present
    const processedData = { ...data };
    
    // Handle all image fields in the images object
    if (processedData.images) {
      const imageFields = ['barangayLogo', 'philippineSeal', 'officialSeal', 'captainSignature', 'backgroundImage'];
      
      for (const field of imageFields) {
        // Skip if field is not present in the data
        if (!processedData.images[field]) continue;
        
        // If the field already has an ID, it's a reference to an existing media item
        if (typeof processedData.images[field] === 'string' || processedData.images[field]?.id) {
          // Convert object references to ID strings for Payload
          if (processedData.images[field]?.id) {
            processedData.images[field] = processedData.images[field].id;
          }
          continue;
        }
        
        // Handle file upload if it's a file object
        if (processedData.images[field] instanceof File || 
            (Array.isArray(processedData.images[field]) && processedData.images[field][0] instanceof File)) {
          
          const fileUpload = Array.isArray(processedData.images[field]) 
            ? processedData.images[field][0] 
            : processedData.images[field];
          
          // Create a proper file object for PayloadCMS
          const buffer = Buffer.from(await fileUpload.arrayBuffer());
          const payloadFile = {
            name: fileUpload.name,
            data: buffer,
            size: fileUpload.size,
            mimetype: fileUpload.type,
          };
          
          // Upload the file to PayloadCMS media collection
          const upload = await payload.create({
            collection: 'media',
            data: {},
            file: payloadFile,
          });
          
          // Replace the file object with the ID reference
          processedData.images[field] = upload.id;
        }
      }
    }
    
    const updatedSettings = await payload.updateGlobal({
      slug: 'certificate-settings',
      data: processedData,
    });
    
    revalidatePath('/dashboard/certificate-settings');
    revalidatePath('/certificate/[id]', 'page');
    
    return {
      success: true,
      data: updatedSettings,
      message: 'Certificate settings updated successfully',
    };
  } catch (error) {
    console.error('Error updating certificate settings:', error);
    return {
      success: false,
      message: error.message || 'Failed to update certificate settings',
    };
  }
} 