import { ViewProjectPage } from '@/components/pages/projects/ViewProjectPage'

export const metadata = {
  title: 'View Project',
  description: 'View project details.',
}

export default async function Page({ params }) {
  return <ViewProjectPage id={params.id} />
} 