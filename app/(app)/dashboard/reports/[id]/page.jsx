// @app/(app)/dashboard/reports/[id]/page.jsx (Server Component)
import { getReport } from "../actions";
import ViewReportPage from "@/components/pages/reports/ViewReportPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getReport(id);
  return {
    title: `${data.title} | View Report | CCL`,
    description: "View report details",
  }
}

export default async function ViewReport({ params }) {
  const { id } = await params;
  const { data } = await getReport(id);
  return <ViewReportPage data={data} />;
}
