
import { getStaffMembers } from "./actions";
import { StaffList } from "@/components/pages/staff/StaffList";

export const metadata = {
  title: "Staff Management | CCL",
  description: "View and manage staff members",
};

export default async function StaffManagement({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const staff = await getStaffMembers(page);
  
  return <StaffList data={staff} />;
}
