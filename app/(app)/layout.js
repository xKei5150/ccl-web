import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
import { getSiteSettings } from "./dashboard/site-settings/actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  fallback: ["sans-serif"],
});

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings?.siteName || "Candelaria Civic Link",
    description: settings?.description || "Barangay Management System",
    icons: settings?.favicon?.url ? [{ rel: 'icon', url: settings.favicon.url }] : undefined,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${poppins.variable}`}>
        <ThemeProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}