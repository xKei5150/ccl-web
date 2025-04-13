import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchFeatureItem } from "../data";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { FeatureDetailSkeleton } from "@/components/feature/FeatureDetailSkeleton";
import { deleteFeatureAction } from "../actions";
import { FeatureDetail } from "@/components/feature/FeatureDetail";

export async function generateMetadata({ params }) {
  const item = await fetchFeatureItem(params.id);
  
  return {
    title: `${item.name || 'Feature Item'} | CCL`,
    description: `View details for feature item ${params.id}`,
  };
}

async function FeatureDetailContent({ id }) {
  const item = await fetchFeatureItem(id);
  
  if (!item) {
    notFound();
  }
  
  return <FeatureDetail item={item} />;
}

export default async function FeatureDetailPage({ params }) {
  const { id } = params;
  
  // Delete action (can be moved to a client component if needed)
  const handleDelete = async () => {
    "use server";
    await deleteFeatureAction(id);
    return redirect("/dashboard/feature");
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Item Details"
        description="View and manage this feature item"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/feature">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/feature/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </form>
          </div>
        }
      />
      
      <Suspense fallback={<FeatureDetailSkeleton />}>
        <FeatureDetailContent id={id} />
      </Suspense>
    </div>
  );
} 