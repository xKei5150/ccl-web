import { ProjectsPage } from '@/components/pages/projects/ProjectsPage'
import { getProjects } from './actions'

export const metadata = {
    title: 'Projects',
    description: 'Manage barangay projects and initiatives.',
}

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const docs = await getProjects(page)
    return <ProjectsPage data={docs} />
} 