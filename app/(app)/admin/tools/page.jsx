import GenerateMockDataButton from "@/components/admin/generate-mock-data-button"

export default function AdminToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Mock Data Generation</h2>
          <p className="mb-4 text-muted-foreground">
            Generate 50 mock records per collection using Spanish locale. This includes users, personal information, households, businesses, reports, and requests.
          </p>
          <GenerateMockDataButton />
        </div>
      </div>
    </div>
  )
}