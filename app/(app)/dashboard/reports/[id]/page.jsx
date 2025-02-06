// @app/(app)/dashboard/reports/[id]/page.jsx (Server Component)
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";
import { getItemById } from "@/lib/actions/actions";
import DocumentPreview from "@/components/layout/DocumentPreview"; //Import it anyway
import { Suspense } from "react"; // Import Suspense
import Loading from "./loading"; // Assuming you have a loading.jsx in the same folder

export default async function ViewReport({ params }) {
  const { id } = await params;
  const reportData = await getItemById('reports', id);


    if (!reportData) {
        // Handle case where report is null (e.g., error fetching, report not found)
        return (
            <>
                <PageHeader
                    title="Report Details"
                    subtitle="Error loading report"
                    icon={<SquareGanttChart className="h-8 w-8" />}
                />
                <div className="text-center mt-8 text-red-500">Failed to load report details. Please check the report ID or try again later.</div>
            </>
        );
    }
  //Added the report variable.
  const report = reportData;
  return (
      <Suspense fallback={<Loading/>}>
        <PageHeader
          title="Report Details"
          subtitle="View details of a report"
          icon={<SquareGanttChart className="h-8 w-8" />}
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Title</dt>
                  <dd className="mt-1">{report.title}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">{report.reportStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Date</dt>
                  <dd className="mt-1">{new Date(report.date).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Location</dt>
                  <dd className="mt-1">{report.location}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Description</dt>
                  <dd className="mt-1">{report.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Involved People</CardTitle>
            </CardHeader>
            <CardContent>
              {!report.involvedPersons?.length ? (
                <p className="text-gray-500">No persons involved in this report</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.involvedPersons.map((person, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium">{person.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Role: {person.role}</p>
                      <p className="mt-2">{person.statement}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {report.supportingDocuments.length === 0 ? (
                <p className="text-gray-500">No supporting documents attached</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {report.supportingDocuments.map((doc) => (
                    <DocumentPreview key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </Suspense>
  );
}