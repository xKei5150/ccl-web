import { EditProjectPage } from '@/components/pages/projects/EditProjectPage'

export const metadata = {
  title: 'Edit Project',
  description: 'Edit an existing project.',
}

export default async function Page({ params }) {
  return <EditProjectPage id={params.id} />
} 