import { getStaffMember } from "../../actions";
import { StaffForm } from "@/components/form/StaffForm";
import { notFound } from "next/navigation";
import { payload } from "@/lib/payload";

export const metadata = {
  title: "Edit Staff Member | CCL",
  description: "Edit staff member details",
};

export default async function EditStaffPage({ params }) {
  const { id } = params;
  const { data: staff } = await getStaffMember(id);
  const { docs: personalInfoList } = await payload.find({
    collection: 'personal-information',
    depth: 1,
    limit: 100,
  });

  if (!staff) {
    notFound();
  }

  return <StaffForm defaultValues={staff} personalInfoList={personalInfoList} />;
}