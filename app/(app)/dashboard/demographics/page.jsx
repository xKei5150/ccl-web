import { getDemographics } from "./actions";
import DemographicsListPage from "@/components/pages/demographics/list-page";

export const metadata = {
  title: "Demographics | CCL",
  description: "View and manage demographic data",
};

export default async function Demographics({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const demographics = await getDemographics(page);
  return <DemographicsListPage data={demographics} />;
} 