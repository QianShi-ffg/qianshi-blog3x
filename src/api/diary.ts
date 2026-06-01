import { apiClient } from './http'
import type { DiaryMoment, DiaryMomentSummary } from '@/types/content'

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

export const getMomentsTotal = async () => {
  const res = await apiClient.getRaw<DiaryMomentSummary[]>('/diary', {
    params: {
      page: 1,
      pageSize: 1,
    },
    cache: 'no-store',
  })

  return res.total ?? res.data?.length ?? 0
}

export const getMomentById = async (id: number) => {
  return apiClient.get<DiaryMoment | null>(`/diary/${id}`, {
    cache: 'no-store',
  })
}
