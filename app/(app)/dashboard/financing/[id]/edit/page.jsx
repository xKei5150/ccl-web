import { notFound } from "next/navigation";
import EditFinancingPage from "@/components/pages/financing/EditFinancingPage";
import { getFinancingRecord } from "@/app/(app)/dashboard/financing/actions";

export const metadata = {
  title: "Edit Financing Record",
  description: "Update details of a financing record",
}

export default async function EditFinancingRecordPage({ params }) {
    const { id } = await params;
  
  try {
    const financingRecord = await getFinancingRecord(id);    
    
    // Check if the record exists
    if (!financingRecord) {
      console.error("Financing record not found for ID:", id);
      return notFound();
    }
    
    return <EditFinancingPage data={financingRecord.data} />;
  } catch (error) {
    console.error("Error fetching financing record:", error);
    return notFound();
  }
} 