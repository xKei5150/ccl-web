import NewBusinessPage from "@/components/pages/business/NewBusinessPage";

export const metadata = {
  title: "Create Business Record | CCL",
  description: "View and manage your businesses",
};


export default async function NewBusiness() {
  return <NewBusinessPage />;
}