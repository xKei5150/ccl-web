import { getRequest } from "../../actions";
import EditRequestPage from "@/components/pages/general-requests/EditRequestPage";

export async function generateMetadata({params}) {
  const { id } = await params;
  const { data } = await getRequest(id);
  return {
    title: `Edit Request | ${data.type} | CCL`,
    description: "Edit general request details",
  }
}

export default async function EditGeneralRequest({ params }) {
  const { id } = await params;
  const { data } = await getRequest(id);
  
  return <EditRequestPage requestData={data} />;
}

