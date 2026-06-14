export const parseMediaList = (media?: string | string[] | null) => {
  if (!media) return []
  if (Array.isArray(media)) return media.filter(Boolean)

  const value = media.trim()
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
    }
  } catch {
    // Old diary data is saved as a plain URL.
  }

  return [value]
}

export const getPrimaryMedia = (media?: string | string[] | null) => parseMediaList(media)[0] || ''
