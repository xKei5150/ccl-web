import { getFinancingRecord } from "../actions";
import ViewFinancingPage from "@/components/pages/financing/ViewFinancingPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getFinancingRecord(id);
  return {
    title: `${data.title} | CCL`,
    description: "View financing record details",
  }
}

export default async function ViewFinancingRecord({ params }) {
  const { id } = await params;
  const { data } = await getFinancingRecord(id);
  
  return <ViewFinancingPage data={data} />;
} 