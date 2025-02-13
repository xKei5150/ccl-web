
import { getPersonalRecords } from "./actions";
import PersonalPage from "@/components/pages/personal/PersonalPage";

export const metadata = {
  title: "Personal Records | CCL",
  description: "View and manage personal records",
};



export default async function PersonalRecords({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const records = await getPersonalRecords(page);
  return <PersonalPage data={records} />;
}
