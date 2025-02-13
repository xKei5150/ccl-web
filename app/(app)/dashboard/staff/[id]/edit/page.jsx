import { getStaffMember } from "../../actions";
import EditStaffPage from "@/components/pages/staff/EditStaffPage";

export const metadata = {
  title: "Edit Staff Member | CCL",
  description: "Edit staff member details",
};

export default async function EditStaff({ params }) {
    const { id } = await params
  const { data } = await getStaffMember(id);
  return <EditStaffPage defaultValues={data} />;
}