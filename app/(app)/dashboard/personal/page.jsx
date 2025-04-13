import { Suspense } from 'react';
import { fetchPersonalRecords } from "./data";
import PersonalPage from "@/components/pages/personal/PersonalPage";
import { Heading } from "@/components/ui/heading";
import { Loading } from "@/components/ui/loading";

export const metadata = {
  title: "Personal Records | CCL",
  description: "View and manage personal records",
};

/**
 * Content component with data fetching
 */
async function PersonalContent({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const records = await fetchPersonalRecords(page, limit);
  
  return <PersonalPage data={records} />;
}

/**
 * Personal records page with suspense boundary
 */
export default function PersonalRecordsPage({ searchParams }) {
  return (
    <div className="space-y-6">
      <Heading
        title="Personal Information"
        description="View and manage personal records in the system"
      />
      
      <Suspense fallback={<Loading variant="skeleton" />}>
        <PersonalContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
