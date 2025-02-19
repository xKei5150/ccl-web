import { getRequest } from "../../actions";
import EditRequestPage from "@/components/pages/general-requests/EditRequestPage";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await getRequest(id);

  if (!data) {
    return {
      title: "Request Not Found | CCL",
      description: "The requested general request was not found",
    };
  }
  
  return {
    title: `Edit Request | ${data.type} | CCL`,
    description: "Edit general request details",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditGeneralRequest({ params }) {
  const { id } = await params;
  const { data } = await getRequest(id);
  
  if (!data) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EditRequestPage requestData={data} />
    </Suspense>
  );
}

