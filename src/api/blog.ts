import { mockRequest, apiClient } from './http'
import { articleDetails, articles } from './mock-data'
import type { ArticleSummary } from '@/types/content'

export interface ArticleListParams {
  page?: number
  pageSize?: number
  [key: string]: string | number | boolean | null | undefined
}

/**
 * 查询前台文章列表，只读取后端已发布文章并禁用浏览器缓存。
 */
export const listArticles = (params: ArticleListParams = {}) => {
  return apiClient.get('/article/publishArticle', { params, cache: 'no-store' })
}

export interface AdjacentArticles {
  prev: ArticleSummary | null
  next: ArticleSummary | null
}

/**
 * 查询首页最新文章，默认取 3 条用于首页最新文章模块。
 */
export const getLatestArticles = (limit = 3) => {
  return apiClient.get<ArticleSummary[]>('/article/latest', {
    params: { limit },
    cache: 'no-store',
  })
}

/**
 * 查询文章详情页底部的上一篇和下一篇文章。
 */
export const getAdjacentArticles = (id: number | string) => {
  return apiClient.get<AdjacentArticles>(`/article/adjacent/${id}`, { cache: 'no-store' })
}

/**
 * 查询文章详情，进入详情页时后端会同步增加浏览量。
 */
export const getArticleDetail = (params: any) => {
  return apiClient.get(`/article/${params.id}`, {})
}

/**
 * 查询文章分类统计，文章列表页分类筛选使用。
 */
export const getClassifyIdList = (params: any) => {
  return apiClient.get( '/article/articleClassifyCount', { params })
}

/**
 * 保留的 mock 详情查询方法，历史 mock 数据回退或测试时使用。
 */
export const getArticleById = (id: number) => {
  return mockRequest(articleDetails.find((article) => article.id === id) ?? null)
}
