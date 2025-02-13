// app/(app)/dashboard/business/page.jsx
import { getBusinessPermit } from "../../actions";
import { getBusinesses } from "@/app/(app)/dashboard/business/actions";
import EditBusinessPermit from "@/components/pages/business-permits/EditBusinessPermitsPage";

export async function generateMetadata({params}){
  const { id } = await params;
  const { data } = await getBusinessPermit(id);
  return {
    title: `${data.business.businessName} | Edit Business Permit | CCL`,
    description: "Edit your business permit",
  }

};

export default async function Business({ params }) {
  const { id } = await params
  const { data } = await getBusinessPermit(id);
  const { docs } = await getBusinesses();
  return <EditBusinessPermit businessPermitData={data} businesses={docs} />;
}