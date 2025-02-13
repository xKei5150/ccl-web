import { PageHeader } from "@/components/layout/PageHeader";
import { Palette } from "lucide-react";
import { ThemeForm } from "@/components/theme/ThemeForm";

export const metadata = {
  title: "Theme Manager | CCL",
  description: "Customize the appearance of your dashboard",
};

export default function ThemeManager() {
  return (
    <>
      <PageHeader
        title="Theme Manager"
        subtitle="Customize the appearance of your dashboard"
        icon={<Palette className="h-8 w-8" />}
      />
      <ThemeForm />
    </>
  );
}
