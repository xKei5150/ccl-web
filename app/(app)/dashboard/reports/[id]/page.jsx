"use client";
import React from "react";
import { useParams } from 'next/navigation'; 
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareGanttChart } from "lucide-react";

// Mock data - replace with actual data fetching
const mockReport = {
  title: "Sample Incident Report",
  description: "Description of the incident...",
  date: new Date(),
  location: "Main Street",
  reportType: "incident",
  status: "investigating",
  involvedPersons: [
    {
      name: "John Doe",
      role: "complainant",
      statement: "Statement from complainant...",
    },
    {
      name: "Jane Smith",
      role: "respondent",
      statement: "Statement from respondent...",
    },
  ],
  supportingDocuments: [],
};

export default function ViewReport() {
    const params = useParams();
    const id = params.id;

  return (
    <>
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
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Title</dt>
                  <dd className="mt-1">{mockReport.title}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Type</dt>
                  <dd className="mt-1">{mockReport.reportType}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">{mockReport.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Location</dt>
                  <dd className="mt-1">{mockReport.location}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Description</dt>
                  <dd className="mt-1">{mockReport.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Involved Persons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockReport.involvedPersons.map((person, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Role: {person.role}</p>
                    <p className="mt-2">{person.statement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {mockReport.supportingDocuments.length === 0 ? (
                <p className="text-gray-500">No supporting documents attached</p>
              ) : (
                <div className="space-y-2">
                  {mockReport.supportingDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{doc.file.name}</span>
                      {doc.notes && <span className="text-gray-500">- {doc.notes}</span>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </>
  );
}