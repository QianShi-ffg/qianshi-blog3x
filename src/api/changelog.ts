import { apiClient } from './http'
import type { Changelog, ChangelogChange } from '@/types/content'

/**
 * 标准化更新日志变更明细，兼容新版 JSON 数组和历史换行文本。
 */
const normalizeChanges = (changes: ChangelogChange[] | string | null | undefined): ChangelogChange[] => {
  if (Array.isArray(changes)) {
    return changes
      .map((item) => ({
        type: item?.type || 'feat',
        text: item?.text || '',
      }))
      .filter((item) => item.text)
  }
  if (!changes) return []

  const value = String(changes)
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return normalizeChanges(parsed as ChangelogChange[])
  } catch (error) {
    // Fallback for old newline-based changelog records.
  }

  return value
    .split('\n')
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'feat', text }))
}

/**
 * 将后端日志记录补齐默认字段，保证前台时间线组件拿到稳定结构。
 */
const normalizeChangelog = (item: Partial<Changelog>): Changelog => ({
  version: item.version || '',
  date: item.date || '',
  tag: item.tag || 'FEATURE',
  title: item.title || '',
  changes: normalizeChanges(item.changes),
  ...(item.id ? { id: item.id } : {}),
})

/**
 * 查询前台更新日志列表，接口失败时返回空数组让页面展示暂无内容。
 */
export const listChangelogs = async () => {
  try {
    const res = await apiClient.get<Changelog[]>('/changelog', {
      params: {
        page: 1,
        pageSize: 1000,
      },
      cache: 'no-store',
    })

    return res.map(normalizeChangelog)
  } catch (error) {
    return []
  }
}
