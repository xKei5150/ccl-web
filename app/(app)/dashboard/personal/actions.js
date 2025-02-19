"use server";

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { payload } from "@/lib/payload";

async function uploadPhoto(formData) {
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
    console.error("Error uploading photo:", error);
    throw new Error("Failed to upload photo");
  }
}

export async function getPersonalRecords(page = 1, limit = 10) {
  return genericFind("personal-information", page, limit);
}

export async function getPersonalRecord(id) {
  return genericFindByID("personal-information", id);
}

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

    return genericCreate("personal-information", data, "/dashboard/personal");
  } catch (error) {
    console.error("Error creating personal record:", error);
    throw new Error("Failed to create personal record");
  }
}

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



    return genericUpdate("personal-information", id, data, `/dashboard/personal/${id}`);
  } catch (error) {
    console.error("Error updating personal record:", error);
    throw new Error("Failed to update personal record");
  }
}

export async function deletePersonalRecord(ids) {
  return genericDelete("personal-information", ids, `/dashboard/personal`);
}