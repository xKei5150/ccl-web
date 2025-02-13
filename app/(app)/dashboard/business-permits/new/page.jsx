import NewBusinessPermitPage from "@/components/pages/business-permits/NewBusinessPermitPage";
import { getBusinesses } from "../../business/actions";

export default async function NewBusinessPermi() { 
  const {docs} = await getBusinesses();
  return (
   <NewBusinessPermitPage businesses={docs} />
  );
};


