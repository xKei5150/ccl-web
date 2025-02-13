// app/(app)/dashboard/business/page.jsx
import { getBusinessPermits } from "./actions";
import BusinessPermitsPage from "@/components/pages/business-permits/BusinessPermitsPage";

export const metadata = {
  title: "Business Permits | CCL",
  description: "View and manage your business permits",
};

export default async function Business({ searchParams }) {
  const params = await searchParams
  const page = Number(params.page) || 1;
  const businessPermits = await getBusinessPermits(page);
  return <BusinessPermitsPage data={businessPermits} />;
}