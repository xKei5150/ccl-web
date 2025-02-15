// lib/actions/genericCrudActions.ts
"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import {
  handleDocumentUpload,
  updateSupportingDocuments,
} from "@/lib/actions/supportingDocuments"; 

import { headers as nextHeaders } from 'next/headers'


const DEBUG = process.env.NODE_ENV === "development";

async function genericFind(
  collection,
  page = 1,
  limit = 10,
) { //changed from CrudResult<T[]>
  const headers = await nextHeaders()
const { user } = await payload.auth({headers})
  try {
    const response = await payload.find({
      collection,
      depth: 1,
      page,
      limit,
      user: user,
      // overrideAccess: false
    });
    return response; // changed
  } catch (e) {
    console.error(`Error fetching ${collection}:`, e);
      return { // added for consistency and return type checking
          success: false,
          message: `Error fetching ${collection}`,
          statusCode: 500,
      };
  }
}

async function genericFindByID(
  collection,
  id,
) {
  try {
    if (!id) {
      throw new Error(`Invalid ${collection} ID`);
    }
    const item = await payload.findByID({
      collection,
      id,
    });
    return {
        success: true,
        data: item, //type assertion.
        message: `${collection} fetched successfully`,
        statusCode: 200,
    }
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return {
        success: false,
        message: `Error fetching ${collection}`,
        statusCode: 500,
    };
  }
}
async function genericCreate(
  collection,
  data,
  revalidatePathString) {
  try {
    const uploadedDocuments = [];
    if (data.supportingDocuments && data.supportingDocuments.length > 0) {
      for (const file of data.supportingDocuments) {
        const uploadResponse = await handleDocumentUpload(file);
        if (!uploadResponse.success) {
          return {
            success: false,
            message: uploadResponse.message,
            statusCode: uploadResponse.statusCode,
          };
        }
        uploadedDocuments.push(uploadResponse.data);
      }
    }

    const itemData = {
      ...data,
      supportingDocuments:
        uploadedDocuments.length > 0 ? uploadedDocuments : undefined,
    };

    const newItem = await payload.create({
      collection,
      data: itemData,
    });

    if (!newItem) {
      return {
        success: false,
        message: `Failed to create ${collection}`,
        statusCode: 500,
      };
    }

    if (revalidatePathString) {
      revalidatePath(revalidatePathString);
    }

    return {
      success: true,
      data: newItem,
      message: `${collection} created successfully`,
      statusCode: 201,
    };
  } catch (error) {
    console.error(`Error creating ${collection}:`, error);
    return {
      success: false,
      message: `Error creating ${collection}: ${error.message}`,
      statusCode: 500,
    };
  }
}

async function genericUpdate(
  collection,
  id,
  newData,
  revalidatePathString) {
  try {
    DEBUG && console.debug(`Updating ${collection} with ID:`, id, "Data:", newData);

    const oldData = await payload.findByID({
      collection,
      id,
    });

    if (!oldData) {
      return {
        success: false,
        message: `${collection} not found`,
        statusCode: 404,
      };
    }

    const docResult = await updateSupportingDocuments(oldData, newData);
    if (!docResult.success) {
      return {
        success: false,
        message: `Failed to update supporting documents for ${collection}`,
        statusCode: 500,
      };
    }

    const itemData = {
      ...newData,
      supportingDocuments: docResult.data,
    };

    const updatedItem = await payload.update({
      collection,
      id,
      data: itemData,
    });

    if (!updatedItem) {
      return {
        success: false,
        message: `Failed to update ${collection}`,
        statusCode: 500,
      };
    }
      if (revalidatePathString) {
          revalidatePath(revalidatePathString);
      }
    return {
      success: true,
      data: updatedItem,
      message: `${collection} updated successfully`,
      statusCode: 200,
    };
  } catch (error) {
    console.error(`Error updating ${collection}:`, error);
    return {
      success: false,
      message: `Error updating ${collection}: ${error.message}`,
      statusCode: 500,
    };
  }
}

async function genericDelete(
  collection,
  ids,
  revalidatePathString,
){ // Returns CrudResult<null> as data is not applicable after deletion.
  try {
    if (!ids || ids.length === 0) {
      return {
        success: false,
        message: "No IDs provided for deletion.",
        statusCode: 400, // Bad Request
      };
    }
    const oldData = await Promise.all(ids.map(id => payload.findByID({ collection, id })));

    const deleteSupportingDocuments = oldData.map(async (item) => {
      if (item.supportingDocuments && item.supportingDocuments.length > 0) {
        const deletePromises = item.supportingDocuments.map(async (doc) => {
          try {
            await payload.delete({
              collection: 'supporting-documents',
              id: doc.id,
            });
          } catch (error) {
            console.error(`Error deleting supporting document with id ${doc.id}`, error);
          }
        });
        await Promise.all(deletePromises);
      }
    });

    await Promise.all(deleteSupportingDocuments);
    const deletionPromises = ids.map(async (id) => {
      try {
          const deletedItem = await payload.delete({
              collection,
              id,
          });
        if(!deletedItem){ //added check for deletion success
            throw new Error(`Failed to delete ${collection} item with ${id}`)
        }
          return {success: true, id};
      } catch(error) {
          console.error(`Error deleting ${collection} item with id ${id}`, error)
          return {success: false, id, error: error.message || "Unknown error occurred."};
      }
    });


    const results = await Promise.all(deletionPromises);

    const allSuccessful = results.every(result => result.success); //check all the deletions.
    const failedIds = results.filter(res => !res.success).map(res => res.id);

    if (!allSuccessful) {
      return {
        success: false,
        message: `Failed to delete some items in ${collection}. Failed IDs: ${failedIds.join(', ')}`,
        statusCode: 500, // Or potentially 207 Multi-Status if you want to be more specific.
      };
    }

    if (revalidatePathString) {
      revalidatePath(revalidatePathString);
    }

    return {
      success: true,
      data: null, // No data returned on successful deletion.
      message: `Successfully deleted items in ${collection}`,
      statusCode: 200, // OK
    };
  } catch (error) {
    console.error(`Error deleting from ${collection}:`, error);
    return {
      success: false,
      message: `Error deleting from ${collection}: ${error.message}`,
      statusCode: 500,
    };
  }
}


export { genericFind, genericFindByID, genericCreate, genericUpdate, genericDelete };