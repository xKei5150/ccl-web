// @lib/actions/actions.js - where I put general actions that can be used across different parts of the app. This file contains the getItems, getItemById, and deleteItems functions that are used in different parts of the app to fetch and manipulate data.
import { payload } from "../payload";

export async function getItems(collection) {
  try {
    const response = await payload.find({
      collection: collection,
    });
    return response;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error(`Error fetching items from ${collection}`);
  }
};

export async function getItemById(collection, id) {
    try {
      const response = await payload.findByID({
        collection: collection,
        id: id,
      });
      return response;
    } catch (error) {
      console.error("Error fetching report:", error);
      return null; // Or a similar error object as in updateReport
    }
  }

  export async function deleteItems(collection, ids) {
    try {
      const response = await payload.delete({
        collection: collection,
        where: {
          id: {
            in: ids,
          },
        },
      });
      return response;
    } catch (error) {
      console.error("Error deleting items:", error);
      throw new Error(`Error deleting items from ${collection}`);
    }
  }