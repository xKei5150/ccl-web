import { getRequest } from "../actions";
import ViewRequestPage from "@/components/pages/general-requests/ViewRequestPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getRequest(id);
  return {
    title: `General Request | ${data.type} | CCL`,
    description: "View general request details",
  }
}

export default async function ViewGeneralRequest({ params }) {
  const { id } = await params;
  const { data } = await getRequest(id);
  
  return <ViewRequestPage data={data} />;
}
