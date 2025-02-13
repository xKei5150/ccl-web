// app/dashboard/reports/[id]/edit/page.jsx (Server Component)
import React, { Suspense } from "react";
import { getReport } from "../../actions";
import EditReportPage from "@/components/pages/reports/EditReportPage";
import Loading from "./loading";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getReport(id);
  return {
    title: `${data.title} | Edit Report | CCL`,
    description: "Edit report details",
  }
}

export default async function EditReport({ params }) {
  const { id } = await params;
  const { data } = await getReport(id);
  return <EditReportPage reportData={data} />;
}