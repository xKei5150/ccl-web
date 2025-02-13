import { getHouseholds } from "./actions";
import HouseholdPage from "@/components/pages/household/HouseholdPage";

export const metadata = {
  title: "Household Records | CCL",
  description: "View and manage household records",
};


export default async function HouseholdRecords({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const households = await getHouseholds(page);

  return (
    <>
      <HouseholdPage data={households} />
    </>
  );
}