
import { getSiteSettings } from "./actions";
import SiteSettingsPage from "@/components/pages/site-settings/SiteSettingsPage";
import { updateSiteSettings } from "./actions";

export const metadata = {
  title: "Site Settings | CCL",
  description: "Manage your site settings",
};

export default async function SiteSettings() {
  const settings = await getSiteSettings();
  const defaultValues = Object.keys(settings).length === 0 ? null : settings;
  return (
    <>
      <SiteSettingsPage
        defaultValues={defaultValues}
        onSubmit={updateSiteSettings}
      />
    </>
  );
}