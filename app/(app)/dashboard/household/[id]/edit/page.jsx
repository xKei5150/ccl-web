import { getHousehold } from "../../actions";
import EditHouseholdPage from "@/components/pages/household/EditHouseholdPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getHousehold(id);
  return {
    title: `${data.familyName} | Edit | CCL`,
    description: "Edit your household information",
  }
}

export default async function EditHousehold({ params }) {
  const { id } = await params;
  const { data } = await getHousehold(id);
  
  return <EditHouseholdPage householdData={data} />;
}
