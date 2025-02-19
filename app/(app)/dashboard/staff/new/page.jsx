import { payload } from "@/lib/payload";
import { StaffForm } from "@/components/form/StaffForm";

export const metadata = {
  title: "Add Staff Member | CCL",
  description: "Add a new staff member",
};

export default async function NewStaffPage() {
  const { docs: personalInfoList } = await payload.find({
    collection: 'personal-information',
    depth: 1,
    limit: 100,
  });

  return <StaffForm personalInfoList={personalInfoList} />;
}