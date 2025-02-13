import { getPersonalRecord } from "../actions";
import ViewPersonalPage from "@/components/pages/personal/ViewPersonalPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getPersonalRecord(id);
  return {
    title: `${data.name.fullName} | CCL`,
    description: "View personal record details",
  }
}

export default async function ViewPersonalRecord({ params }) {
  const { id } = await params;
  const { data } = await getPersonalRecord(id);
  
  return <ViewPersonalPage data={data} />;
}