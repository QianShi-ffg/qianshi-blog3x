import { apiClient } from './http'
import type { CommentItem } from '@/types/content'

export interface CommentPayload {
  targetType: string
  targetId: number
  parentId?: number | null
  replyTo?: string
  author?: string
  content: string
}

export interface LikeResult {
  liked: boolean
  likes: number
}

export interface LikeStatus {
  liked: boolean
}

export const listComments = async (targetType: string, targetId: number) => {
  return apiClient.get<CommentItem[]>('/comment/tree', {
    params: {
      targetType,
      targetId,
    },
    cache: 'no-store',
  })
}

export const saveComment = async (payload: CommentPayload) => {
  return apiClient.post<CommentItem>('/comment/saveComment', payload)
}

export const likeComment = async (id: number) => {
  return apiClient.patch<LikeResult>(`/comment/${id}/like`)
}

export const likeDiary = async (id: number) => {
  return apiClient.patch<LikeResult>(`/comment/diary/${id}/like`)
}

export const getLikeStatus = async (targetType: string, targetId: number) => {
  return apiClient.get<LikeStatus>('/comment/likeStatus', {
    params: {
      targetType,
      targetId,
    },
    cache: 'no-store',
  })
}
