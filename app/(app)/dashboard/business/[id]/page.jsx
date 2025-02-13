import { getBusiness } from "../actions";
import ViewBusinessPage from "@/components/pages/business/ViewBusinessPage";

export async function generateMetadata({params}){
  const { id } = await params;
  const { data } = await getBusiness(id);
  return {
    title: `${data.businessName} | Edit | CCL`,
    description: "Edit your business information",
  }

};

export default async function ViewBusiness({ params }) {
  const { id } = await params;
  const { data } = await getBusiness(id);
  return (
    <>
      <ViewBusinessPage data={data} />
    </>
  );
}
