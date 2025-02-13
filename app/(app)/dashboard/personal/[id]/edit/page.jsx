// EditGeneralRequest.jsx

import { getPersonalRecord } from "../../actions";
import EditPersonalPage from "@/components/pages/personal/EditPersonalPage";

export const metadata = {
  title: "Edit Personal Record | CCL",
  description: "Edit personal record details",
};

export default async function EditPersonalRecord({ params }) {
  const { id } = await params;
  const { data } = await getPersonalRecord(id);
  
  return <EditPersonalPage data={data} />;
}
