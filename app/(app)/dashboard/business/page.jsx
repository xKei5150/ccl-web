// app/(app)/dashboard/business/page.jsx
import { getBusinesses } from "./actions";
import BusinessPage from "@/components/pages/business/BusinessPage";

export const metadata = {
  title: "Business Information | CCL",
  description: "View and manage your businesses",
};

export default async function Business({ searchParams }) {
  const params = await searchParams
  const page = Number(params.page) || 1;
  const businesses = await getBusinesses(page);
  return <BusinessPage data={businesses} />;
}