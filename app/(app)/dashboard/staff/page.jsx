import { getStaffMembers, getAvailableUsers } from "./actions";
import { StaffList } from "@/components/pages/staff/StaffList";

export const metadata = {
  title: "Staff Management | CCL",
  description: "View and manage staff members",
};

export default async function StaffPage() {
  const [staffData, availableUsers] = await Promise.all([
    getStaffMembers(),
    getAvailableUsers()
  ]);

  return <StaffList data={staffData} availableUsers={availableUsers?.docs || []} />;
}
