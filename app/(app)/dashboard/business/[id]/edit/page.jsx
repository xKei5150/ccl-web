// EditBusiness.jsx

import EditBusinessPage from "@/components/pages/business/EditBusinessPage";
import { getBusiness } from "../../actions";


export async function generateMetadata({params}){
  const { id } = await params;
  const { data } = await getBusiness(id);
  return {
    title: `${data.businessName} | Edit | CCL`,
    description: "Edit your business information",
  }

};

export default async function EditBusiness ({params}) {
  const { id } = await params;
  const { data } = await getBusiness(id);
  return (
    <>
    <EditBusinessPage businessData={data} />
    </>
  );
};

