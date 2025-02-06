// EditGeneralRequest.jsx
"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilePenLine } from "lucide-react";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

const EditGeneralRequest = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [request, setRequest] = React.useState(null);

  useEffect(() => {
    async function loadRequest() {
      try {
        const response = await fetch(`/api/requests/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to load request');
        }
        const data = await response.json();
        
        const formattedData = {
          type: data.type,
          status: data.status,
          personalData: {
            firstName: data.personalData.firstName,
            middleName: data.personalData.middleName || "",
            lastName: data.personalData.lastName,
            birthDate: data.personalData.birthDate,
            localAddress: data.personalData.localAddress,
            sex: data.personalData.sex,
            citizenship: data.personalData.citizenship,
            maritalStatus: data.personalData.maritalStatus,
          },
          purpose: data.purpose,
          supportingDocuments: data.supportingDocuments || [],
          // Extract conditional fields
          forWhom: data.conditionalFields?.forWhom || "",
          remarks: data.conditionalFields?.remarks || "",
          duration: data.conditionalFields?.duration || "",
        };

        setRequest(formattedData);
      } catch (error) {
        console.error('Error loading request:', error);
        toast({
          title: "Error",
          description: "Failed to load request data",
          variant: "destructive",
        });
      }
    }
    loadRequest();
  }, [params.id, toast]);

  const onSubmit = async (data) => {
    const uploadedDocuments = [];
    const originalDocIds = request.supportingDocuments.map(doc => doc.id);
    const submittedDocIds = data.supportingDocuments
      .filter(doc => typeof doc === 'string' || doc.id)
      .map(doc => typeof doc === 'string' ? doc : doc.id);
    // Find deleted document IDs
    const deletedDocIds = originalDocIds.filter(id => !submittedDocIds.includes(id));

    try {
      // Delete removed documents first
      if (deletedDocIds.length > 0) {
        await Promise.all(
          deletedDocIds.map(async (docId) => {
            const response = await fetch(`/api/supporting-documents/${docId}`, { method: 'DELETE' });
            if (!response.ok) {
              throw new Error(`Failed to delete document ${docId}`);
            }
          })
        )};

      // Handle new supporting documents
      if (data.supportingDocuments && data.supportingDocuments.length > 0) {
        for (const file of data.supportingDocuments) {
          // Skip if it's an existing document (has an id)
          if (file.id) {
            uploadedDocuments.push(typeof file === 'string' ? file : file.id);
            continue;
          }

          const documentFormData = new FormData();
          documentFormData.append('file', file);
          documentFormData.append('_payload', JSON.stringify({
            "notes": file.notes,
          }));

          const uploadResponse = await fetch('/api/supporting-documents', {
            method: 'POST',
            body: documentFormData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload document');
          }
          
          const document = await uploadResponse.json();
          uploadedDocuments.push(document.doc.id);
        }
      }
      // Format the request data according to the collections schema
      const requestData = {
        type: data.type,
        personalData: {
          firstName: data.personalData.firstName,
          middleName: data.personalData.middleName || undefined,
          lastName: data.personalData.lastName,
          birthDate: new Date(data.personalData.birthDate),
          sex: data.personalData.sex,
          maritalStatus: data.personalData.maritalStatus,
          citizenship: data.personalData.citizenship,
          localAddress: data.personalData.localAddress,
        },
        purpose: data.purpose,
        conditionalFields: {
          // Add conditional fields based on request type
          forWhom: data.type === 'indigencyCertificate' ? data.forWhom : undefined,
          remarks: data.type === 'barangayClearance' ? data.remarks : undefined,
          duration: data.type === 'barangayResidency' ? data.duration : undefined,
        },
        supportingDocuments: uploadedDocuments,
        status: 'pending', // Default status for new requests
      };

      const response = await fetch('/api/requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      toast({
        title: "Success",
        description: "General request submitted successfully",
      });
      router.push("/dashboard/general-requests");

    } catch (error) {
      // Cleanup uploaded documents if request creation fails
      if (uploadedDocuments.length > 0) {
        await Promise.all(
          uploadedDocuments.map(async (docId) => {
            try {
              await fetch(`/api/supporting-documents/${docId}`, { method: 'DELETE' });
            } catch (deleteError) {
              console.error('Failed to delete document:', deleteError);
            }
          })
        );
      }
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit general request",
        variant: "destructive",
      });
    }
  };

  const cancelRoute = () => router.push("/dashboard/general-requests");
  
  return (
    <div className="max-w-screen mx-auto p-4">
      <PageHeader
        title="Edit General Request"
        subtitle="Update the form below to edit the general request"
        icon={<FilePenLine className="h-8 w-8" />}
      />
      <GeneralRequestForm
        defaultValues={request}
        onSubmit={onSubmit}
        submitText="Update Request"
        cancelRoute={cancelRoute}
      />
    </div>
  );
};

export default EditGeneralRequest;

