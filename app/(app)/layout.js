import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeRegistry } from "@/components/theme/ThemeRegistry";
import { getSiteSettings } from "./dashboard/site-settings/actions";
import { RootProvider } from "@/components/providers/root-provider";
import { payload } from "@/lib/payload";

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

async function getInitialTheme() {
  try {
    const response = await payload.findGlobal({ slug: 'theme-settings' });
    return response;
  } catch (error) {
    console.error('Error fetching initial theme:', error);
    return null;
  }
}

export default async function RootLayout({ children }) {
  const initialTheme = await getInitialTheme();

  return (
    <html lang="en" >
      <body className={`antialiased ${poppins.variable}`}>
        <RootProvider>
          <ThemeProvider initialTheme={initialTheme}>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}