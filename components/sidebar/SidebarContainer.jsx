import { getSiteSettings } from "@/app/(app)/dashboard/site-settings/actions";
import { Sidebar } from "./Sidebar";
import Image from "next/image";

export async function SidebarContainer() {
  const settings = await getSiteSettings();

  return <Sidebar settings={settings} />;
}