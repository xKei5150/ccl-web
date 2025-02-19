import { getRequests } from "./actions";
import GeneralRequestsPage from "@/components/pages/general-requests/GeneralRequestsPage";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

export const metadata = {
  title: "General Requests | CCL",
  description: "View and manage general requests",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GeneralRequests({ searchParams }) {
  const { page } = await searchParams;
  const requests = await getRequests(page);
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <GeneralRequestsPage data={requests} />
    </Suspense>
  );
}