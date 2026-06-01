import { apiClient } from './http'
import type { Changelog, ChangelogChange } from '@/types/content'

const normalizeChanges = (changes: ChangelogChange[] | string | null | undefined): ChangelogChange[] => {
  if (Array.isArray(changes)) return changes
  if (!changes) return []

  return String(changes)
    .split('\n')
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'feat', text }))
}

const normalizeChangelog = (item: Partial<Changelog>): Changelog => ({
  version: item.version || '',
  date: item.date || '',
  tag: item.tag || 'FEATURE',
  title: item.title || '',
  changes: normalizeChanges(item.changes),
  ...(item.id ? { id: item.id } : {}),
})

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
