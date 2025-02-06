// @lib/actions/supportingDocuments.js - where I put actions specific to supporting documents. This file contains the handleDocumentUpload, updateSupportingDocuments, and createSupportingDocuments functions that are used to upload, update, and create supporting documents.

import { payload } from "../payload";

const DEBUG = process.env.NODE_ENV === "development"; // Enable debug logs in development

export async function handleDocumentUpload(supportingDocument) {
  DEBUG && console.debug("File:", supportingDocument);
  const fileUpload = supportingDocument.file[0];

  const buffer = Buffer.from(await fileUpload.arrayBuffer());

  // Create a file object that matches Payload's expected format
  const payloadFile = {
    name: fileUpload.name,
    data: buffer, // Raw buffer data
    size: fileUpload.size,
    mimetype: fileUpload.type,
  };

    const uploadResponse = await payload.create({
      collection: "supporting-documents",
      data: { notes: supportingDocument.notes }, // Add any additional fields here
      file: payloadFile,
    });
    DEBUG && console.debug("Upload Response:", uploadResponse);

  if (!uploadResponse.id) {
    const errorText = await uploadResponse.text();
    return {
      success: false,
      message: `Failed to upload document: ${uploadResponse.status} - ${errorText}`,
      statusCode: uploadResponse.status,
    };
  }

  return { success: true, data: uploadResponse.id };
}

export async function updateSupportingDocuments(oldData, newData) {
  try {
    const uploadedDocuments = [];
    const originalDocIds = oldData.supportingDocuments.map((doc) => doc.id);
    DEBUG && console.debug("Original Document IDs:", originalDocIds);

    const submittedDocIds = (newData.supportingDocuments || [])
      .filter((doc) => typeof doc === "string" || doc?.id)
      .map((doc) => (typeof doc === "string" ? doc : doc.id));
    DEBUG && console.debug("Submitted Document IDs:", submittedDocIds);

    // Handle deletions
    const deletedDocIds = originalDocIds.filter(
      (docId) => !submittedDocIds.includes(docId)
    );
    if (deletedDocIds.length > 0) {
      await Promise.all(
        deletedDocIds.map((docId) =>
          payload.delete({ collection: "supporting-documents", id: docId })
        )
      );
    }
    DEBUG && console.debug("Deleted Document IDs:", deletedDocIds);

    // Handle updates to existing documents
    const updatedDocuments = newData.supportingDocuments.filter(
      (doc) => doc.id && doc.notes !== oldData.supportingDocuments.find((oldDoc) => oldDoc.id === doc.id)?.notes
    );

    for (const doc of updatedDocuments) {
      await payload.update({
        collection: "supporting-documents",
        id: doc.id,
        data: { notes: doc.notes },
      });
    }
    DEBUG && console.debug("Updated Document IDs:", updatedDocuments.map((doc) => doc.id));

    // Handle new uploads and existing documents
    if (newData.supportingDocuments?.length > 0) {
      for (const file of newData.supportingDocuments) {
        if (file.id) {
          uploadedDocuments.push(typeof file === "string" ? file : file.id);
          continue;
        }

        const uploadResult = await handleDocumentUpload(file);
        if (!uploadResult.success) {
          return uploadResult;
        }
        uploadedDocuments.push(uploadResult.data);
      }
    }

    DEBUG && console.debug("Uploaded Document IDs:", uploadedDocuments);
    return { success: true, data: uploadedDocuments, statusCode: 200 };
  } catch (error) {
    console.error("Error handling supporting documents:", error);
    return {
      success: false,
      message: `Error handling supporting documents: ${error.message}`,
      statusCode: 500,
    };
  }
}

export async function createSupportingDocuments(newData) {
  try {
    const uploadedDocuments = [];
    for (const supportingDocument of newData.supportingDocuments) {
      const uploadResult = await handleDocumentUpload(supportingDocument);
      if (!uploadResult.success) {
        return uploadResult;
      }
      uploadedDocuments.push(uploadResult.data);
    }
    return { success: true, data: uploadedDocuments, statusCode: 200 };
  } catch (error) {
    console.error("Error creating supporting documents:", error);
    return {
      success: false,
      message: `Error creating supporting documents: ${error.message}`,
      statusCode: 500,
    };
  }
}
