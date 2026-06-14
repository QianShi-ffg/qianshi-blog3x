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

/**
 * 查询指定内容的评论树，返回父评论、回复和当前访问者点赞状态。
 */
export const listComments = async (targetType: string, targetId: number) => {
  return apiClient.get<CommentItem[]>('/comment/tree', {
    params: {
      targetType,
      targetId,
    },
    cache: 'no-store',
  })
}

/**
 * 提交评论或回复，后端会做目标校验和评论频率限制。
 */
export const saveComment = async (payload: CommentPayload) => {
  return apiClient.post<CommentItem>('/comment/saveComment', payload)
}

/**
 * 切换评论点赞状态，同一个 IP 再次点击会取消点赞。
 */
export const likeComment = async (id: number) => {
  return apiClient.patch<LikeResult>(`/comment/${id}/like`)
}

/**
 * 切换日记点赞状态，返回最新点赞状态和数量。
 */
export const likeDiary = async (id: number) => {
  return apiClient.patch<LikeResult>(`/comment/diary/${id}/like`)
}

/**
 * 查询当前访问者对日记或评论的点赞状态，页面初始化按钮状态时使用。
 */
export const getLikeStatus = async (targetType: string, targetId: number) => {
  return apiClient.get<LikeStatus>('/comment/likeStatus', {
    params: {
      targetType,
      targetId,
    },
    cache: 'no-store',
  })
}
