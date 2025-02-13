import { getBusinessPermit } from "../actions";
import ViewBusinessPermitPage from "@/components/pages/business-permits/ViewBusinessPermitPage";

export async function generateMetadata({params}){
  const { id } = await params;
  const { data } = await getBusinessPermit(id);
  return {
    title: `${data.business.businessName} | Edit Business Permit | CCL`,
    description: "Edit your business permit",
  }

};

export default async function ViewBusinessPermit({ params }) {
  const { id } = await params;
  const { data } = await getBusinessPermit(id);
  return (
    <>
      <ViewBusinessPermitPage data={data} />
    </>
  );
}