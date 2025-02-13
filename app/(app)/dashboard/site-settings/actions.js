"use server";

import { payload } from '@/lib/payload';
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  return settings || null;
}

async function uploadMedia(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const payloadFile = {
    name: file.name,
    data: buffer, // Raw buffer data
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
  console.log("Upload Response:", uploadResponse);

  if (!uploadResponse.id) {
    const errorText = await uploadResponse.text();
    return {
      success: false,
      message: `Failed to upload document: ${uploadResponse.status} - ${errorText}`,
      statusCode: uploadResponse.status,
    };
  }

  return { success: true, data: uploadResponse };
}

export async function updateSiteSettings(data) {
  if (data) {
    if(data.logo[0]) {
      const logo = await uploadMedia(data.logo[0]);
      if(logo.success) {
        data.logo = logo.data;
      }
    }
    if(data.favicon[0]) {
      const favicon = await uploadMedia(data.favicon[0]);
      if(favicon.success) {
        data.favicon = favicon.data;
      }
    }
    await payload.updateGlobal({ slug: 'site-settings', data });
    revalidatePath('/dashboard/site-settings');
  }
}