import { Container, PageContainer } from "./container";
import { cn } from "@/lib/style-utils";

/**
 * Standard page layout with header and optional sidebar
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.actions - Page actions
 * @param {React.ReactNode} props.sidebar - Optional sidebar content
 * @param {boolean} props.narrow - Use narrow content width
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Page layout component
 */
export function PageLayout({ 
  children, 
  title, 
  description, 
  actions,
  sidebar,
  narrow = false,
  className = ""
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container size={narrow ? "3xl" : "7xl"} className="py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              {title && (
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-muted-foreground md:text-base">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </Container>
      </header>

      <div className="flex-1">
        {sidebar ? (
          <div className="flex flex-col md:flex-row">
            <aside className="w-full border-r md:w-64 lg:w-72">
              <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto p-4">
                {sidebar}
              </div>
            </aside>
            <main className="flex-1">
              <PageContainer size={narrow ? "3xl" : "7xl"} className={className}>
                {children}
              </PageContainer>
            </main>
          </div>
        ) : (
          <main>
            <PageContainer size={narrow ? "3xl" : "7xl"} className={className}>
              {children}
            </PageContainer>
          </main>
        )}
      </div>
    </div>
  );
}

/**
 * Dashboard page layout with header and sidebar
 */
export function DashboardLayout({ 
  children, 
  title, 
  description, 
  actions,
  sidebar,
  className = ""
}) {
  return (
    <PageLayout
      title={title}
      description={description}
      actions={actions}
      sidebar={sidebar}
      className={cn("p-4 md:p-6", className)}
    >
      {children}
    </PageLayout>
  );
}

/**
 * Content page layout without sidebar
 */
export function ContentLayout({ 
  children, 
  title, 
  description, 
  actions,
  narrow = true,
  className = ""
}) {
  return (
    <PageLayout
      title={title}
      description={description}
      actions={actions}
      narrow={narrow}
      className={cn("py-6", className)}
    >
      {children}
    </PageLayout>
  );
} 