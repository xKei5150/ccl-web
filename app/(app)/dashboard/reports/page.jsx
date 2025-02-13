//app/(app)/dashboard/reports/page.jsx
import { getReports } from "./actions";
import ReportsPage from "@/components/pages/reports/ReportsPage";

export const metadata = {
  title: "Reports | CCL",
  description: "View and manage reports",
};

export default async function Reports({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const reports = await getReports(page);
  return <ReportsPage data={reports} />;
}
