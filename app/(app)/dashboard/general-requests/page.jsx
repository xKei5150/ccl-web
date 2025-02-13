import { getRequests } from "./actions";
import GeneralRequestsPage from "@/components/pages/general-requests/GeneralRequestsPage";

export const metadata = {
  title: "General Requests | CCL",
  description: "View and manage general requests",
};

export default async function GeneralRequests({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const requests = await getRequests(page);
  console.log(requests);
  return <GeneralRequestsPage data={requests} />;
}