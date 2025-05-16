import CreateFinancingPage from "@/components/pages/financing/CreateFinancingPage";

export const metadata = {
  title: "Create Financing Record | CCL",
  description: "Create a new financing record",
};

export default function CreateFinancingRecord() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
      <CreateFinancingPage />
    </div>
  );
} 