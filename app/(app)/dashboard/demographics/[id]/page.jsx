import { getDemographic } from "../actions";
import DemographicViewPage from "@/components/pages/demographics/view-page";
import { notFound } from "next/navigation";

export const metadata = {
  title: "View Demographic Record | CCL",
  description: "View demographic data details",
};

export default async function DemographicView({ params }) {
  const { id } = params;
  const result = await getDemographic(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return <DemographicViewPage demographic={result.data} />;
} 