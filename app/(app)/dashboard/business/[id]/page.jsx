import React from "react";
import { getBusiness } from "../actions";
import { notFound } from "next/navigation";
import ViewBusinessPage from "@/components/pages/business/ViewBusinessPage";
import { payload } from "@/lib/payload";

export const generateMetadata = async ({ params }) => {
  try {
    const response = await getBusiness(params.id);
    if (!response.success || !response.data) {
      return {
        title: "Business Not Found | CCL",
      };
    }
    return {
      title: `${response.data.businessName} | CCL`,
      description: `View details for ${response.data.businessName}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Business | CCL",
    };
  }
};

export default async function BusinessView({ params }) {
  const response = await getBusiness(params.id);

  if (!response.success || !response.data) {
    return notFound();
  }
  
  // Fetch business permits related to this business
  const permitsResponse = await payload.find({
    collection: 'business-permits',
    where: {
      business: {
        equals: params.id,
      },
    },
    depth: 0,
  });
  
  const permits = permitsResponse?.docs || [];

  return <ViewBusinessPage data={response.data} permits={permits} />;
}
