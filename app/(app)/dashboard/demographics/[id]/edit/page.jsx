import { getDemographic } from "../../actions";
import DemographicEditPage from "@/components/pages/demographics/edit-page";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Demographic Record | CCL",
  description: "Edit demographic data details",
};

export default async function DemographicEdit({ params }) {
  const { id } = params;
  const result = await getDemographic(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return <DemographicEditPage demographic={result.data} id={id} />;
} 