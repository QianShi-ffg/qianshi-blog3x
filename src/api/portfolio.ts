import { apiClient } from './http'
import type { Project } from '@/types/content'

export const listProjects = async () => {
  const res = await apiClient.get<Project[]>('/project', {
    params: {
      page: 1,
      pageSize: 1000,
    },
    cache: 'no-store',
  })

  return res
}

export const getProjectsTotal = async () => {
  const res = await apiClient.getRaw<Project[]>('/project', {
    params: {
      page: 1,
      pageSize: 1,
    },
    cache: 'no-store',
  })

  return res.total ?? res.data?.length ?? 0
}

export const getProjectById = async (id: number) => {
  const res = await apiClient.get<Project | null>(`/project/${id}`, {
    cache: 'no-store',
  })

  return res
}
