import { getHousehold } from "../actions";
import ViewHouseholdPage from "@/components/pages/household/ViewHouseholdPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getHousehold(id);
  return {
    title: `${data.familyName} | CCL`,
    description: "View household details",
  }
}

export default async function ViewHouseholdRecord({ params }) {
  const { id } = await params;
  const { data } = await getHousehold(id);
  
  return <ViewHouseholdPage data={data} />;
}