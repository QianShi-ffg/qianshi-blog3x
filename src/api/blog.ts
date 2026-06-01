import { mockRequest, apiClient } from './http'
import { articleDetails, articles } from './mock-data'
import type { ArticleSummary } from '@/types/content'

export interface ArticleListParams {
  page?: number
  pageSize?: number
  [key: string]: string | number | boolean | null | undefined
}

// 如果当前仍使用 mock 数据，可先注释掉真实请求行
// export const listArticles = () => mockRequest(articles)

export const listArticles = (params: ArticleListParams = {}) => {
  return apiClient.get('/article/publishArticle', { params, cache: 'no-store' })
}

export interface AdjacentArticles {
  prev: ArticleSummary | null
  next: ArticleSummary | null
}

export const getLatestArticles = (limit = 3) => {
  return apiClient.get<ArticleSummary[]>('/article/latest', {
    params: { limit },
    cache: 'no-store',
  })
}

export const getAdjacentArticles = (id: number | string) => {
  return apiClient.get<AdjacentArticles>(`/article/adjacent/${id}`, { cache: 'no-store' })
}

// 文章详情
export const getArticleDetail = (params: any) => {
  return apiClient.get(`/article/${params.id}`, {})
}

// 分类列表
export const getClassifyIdList = (params: any) => {
  return apiClient.get( '/article/articleClassifyCount', { params })
}

export const getArticleById = (id: number) => {
  return mockRequest(articleDetails.find((article) => article.id === id) ?? null)
}
