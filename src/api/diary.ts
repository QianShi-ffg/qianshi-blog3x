import { apiClient } from './http'
import type { DiaryMoment, DiaryMomentSummary } from '@/types/content'

/**
 * 查询前台日记列表，一次取足当前页面需要的日记数据并禁用缓存。
 */
export const listMoments = async () => {
  const res = await apiClient.get<DiaryMomentSummary[]>('/diary', {
    params: {
      page: 1,
      pageSize: 1000,
    },
    cache: 'no-store',
  })

  return res
}

/**
 * 查询单篇日记详情，详情页用于渲染 Markdown、媒体和互动数据。
 */
export const getMomentById = async (id: number) => {
  return apiClient.get<DiaryMoment | null>(`/diary/${id}`, {
    cache: 'no-store',
  })
}
