// app/dashboard/reports/[id]/edit/page.jsx (Server Component)
import React, { Suspense } from "react";
import EditReport from "./EditReport";
import Loading from "./loading";
import {getItemById} from "@/lib/actions/actions";


export default async function EditReportPage({ params }) {
  const { id } = await params;
  const reportData = await getItemById('reports', id);

  return (
    <Suspense fallback={<Loading />}>
      <EditReport report={reportData} id={id} />
    </Suspense>
  );
}