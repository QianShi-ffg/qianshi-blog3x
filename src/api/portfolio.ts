import { apiClient } from './http'
import type { Project } from '@/types/content'

/**
 * 查询前台作品列表，一次取足列表页分页和分类筛选所需数据。
 */
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

/**
 * 查询单个作品详情，详情页用于展示媒体、标签、外链和正文内容。
 */
export const getProjectById = async (id: number) => {
  const res = await apiClient.get<Project | null>(`/project/${id}`, {
    cache: 'no-store',
  })

  return res
}
