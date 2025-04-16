import { NewProjectPage } from '@/components/pages/projects/NewProjectPage'

export const metadata = {
  title: 'New Project',
  description: 'Create a new project.',
}

export default async function Page() {
  return <NewProjectPage />
} 