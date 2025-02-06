"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { BadgePlus } from "lucide-react";
import GeneralRequestForm from "@/components/form/GeneralRequestForm";

const NewGeneralRequest = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    type: "indigencyCertificate",
    status: "pending",
    personalData: {
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      localAddress: "",
      sex: "male",
      citizenship: "Filipino",
      maritalStatus: "single",
    },
    purpose: "",
    supportingDocuments: [],
      forWhom: "",
      duration: "",
      remarks: "",
  };

  const onSubmit = async (data) => {
    const uploadedDocuments = [];
    try {
      // Handle supporting documents first
      if (data.supportingDocuments && data.supportingDocuments.length > 0) {
        for (const file of data.supportingDocuments) {
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
        method: 'POST',
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

  return (
    <>
      <div className="max-w-screen">
        <PageHeader
          title="New General Request"
          subtitle="Fill in the form below to create a new general request"
          icon={<BadgePlus className="h-8 w-8" />}
        />
        <GeneralRequestForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          cancelRoute={() =>
            router.push("/dashboard/general-requests")
          }
        />
      </div>
    </>
  );
};

export default NewGeneralRequest;
