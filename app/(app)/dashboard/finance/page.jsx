import FinancingReportsPage from "@/components/pages/financing/FinancingReportsPage";

export const metadata = {
  title: "Barangay Financial Reports & Analytics",
  description: "Analyze barangay expenditures with visual reports and AI-powered insights",
}

export default async function FinancingReportsRoute() {
  return <FinancingReportsPage />;
} 