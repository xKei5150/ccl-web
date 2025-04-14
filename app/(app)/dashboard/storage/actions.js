"use server";

import { revalidatePath } from "next/cache";
import { payload } from "@/lib/payload";
import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";

export async function getFiles(folderId = null, page = 1, limit = 50) {
  try {
    const where = {};
    
    if (folderId) {
      where.folder = { equals: folderId };
    } else {
      where.folder = { exists: false };
    }
    
    const response = await payload.find({
      collection: "media",
      where,
      depth: 1,
      page,
      limit,
    });
    
    return response;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Failed to fetch files");
  }
}

export async function getFolders(parentId = null, page = 1, limit = 50) {
  try {
    const where = {};
    
    if (parentId) {
      where.parent = { equals: parentId };
    } else {
      where.parent = { exists: false };
    }
    
    const response = await payload.find({
      collection: "storage-folders",
      where,
      depth: 1,
      page,
      limit,
    });
    
    return response;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw new Error("Failed to fetch folders");
  }
}

export async function getFolder(id) {
  try {
    const response = await payload.findByID({
      collection: "storage-folders",
      id,
    });
    
    return response;
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw new Error("Failed to fetch folder");
  }
}

export async function uploadFile(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      throw new Error("No file provided");
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    let folderId = formData.get("folder") || null;
    
    const payloadFile = {
      name: file.name,
      data: buffer,
      size: file.size,
      mimetype: file.type,
    };
    
    const fileData = {
      alt: file.name,
    };
    
    if (folderId) {
      folderId = folderId.toString().trim();
      
      try {
        await payload.findByID({
          collection: "storage-folders",
          id: folderId,
        });
        
        fileData.folder = parseInt(folderId, 10);
      } catch (error) {
        console.error(`Folder with ID ${folderId} not found:`, error);
      }
    }
    
    console.log("Creating media with data:", JSON.stringify(fileData));
    
    const response = await payload.create({
      collection: "media",
      data: fileData,
      file: payloadFile,
    });
    
    revalidatePath("/dashboard/storage");
    return response;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    if (error.data) {
      console.error("Error details:", JSON.stringify(error.data));
    }
    
    let errorMessage = "Failed to upload file";
    
    if (error && typeof error === 'object') {
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.data) {
        if (Array.isArray(error.data)) {
          const validationMessages = error.data.map(err => err.message).join(', ');
          if (validationMessages) errorMessage = validationMessages;
        } else if (typeof error.data === 'object') {
          errorMessage = JSON.stringify(error.data);
        }
      }
    }
    
    throw new Error(errorMessage);
  }
}

export async function createFolder(data) {
  try {
    if (data.parent) {
      data.parent = data.parent.toString().trim();
    }
    
    const response = await payload.create({
      collection: "storage-folders",
      data,
    });
    
    revalidatePath("/dashboard/storage");
    return response;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}

export async function deleteFile(id) {
  try {
    await payload.delete({
      collection: "media",
      id,
    });
    
    revalidatePath("/dashboard/storage");
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

export async function deleteFolder(id) {
  try {
    const filesInFolder = await payload.find({
      collection: "media",
      where: {
        folder: { equals: id },
      },
    });
    
    const subfoldersInFolder = await payload.find({
      collection: "storage-folders",
      where: {
        parent: { equals: id },
      },
    });
    
    if (filesInFolder.docs.length > 0 || subfoldersInFolder.docs.length > 0) {
      throw new Error("Cannot delete folder with files or subfolders");
    }
    
    await payload.delete({
      collection: "storage-folders",
      id,
    });
    
    revalidatePath("/dashboard/storage");
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error(error.message || "Failed to delete folder");
  }
} 