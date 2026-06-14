import { apiClient } from './http'
import type { ResumeProfile } from '@/types/content'
import { encryptPassword } from '@/utils/passwordCrypto'

export const defaultResume: ResumeProfile = {
  title: '',
  subtitle: '',
  name: '',
  role: '',
  avatar: '',
  resumeFile: '',
  hasResumeFile: false,
  resumeProtected: false,
  location: '',
  email: '',
  summary: '',
  skills: [],
  experiences: [],
  educations: [],
  projects: [],
}

/**
 * 将后台可能返回的换行文本统一转换为数组，供前台列表渲染。
 */
const normalizeListText = (value: string[] | string) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value).split('\n').map((item) => item.trim()).filter(Boolean)
}

/**
 * 标准化简历结构，缺失字段补默认值，避免页面直接访问空字段。
 */
const normalizeResume = (resume: Partial<ResumeProfile> | null): ResumeProfile => {
  if (!resume) return defaultResume

  return {
    ...defaultResume,
    ...resume,
    avatar: resume.avatar || '',
    resumeFile: resume.resumeFile || '',
    skills: resume.skills || [],
    experiences: resume.experiences?.map((item) => ({ ...item, desc: normalizeListText(item.desc) })) || [],
    educations: resume.educations?.map((item) => ({ ...item, desc: normalizeListText(item.desc) })) || [],
    projects: resume.projects?.map((item) => ({ ...item, desc: normalizeListText(item.desc) })) || [],
  }
}

/**
 * 查询前台公开简历信息；受保护简历只返回预览内容。
 */
export const getResume = async () => {
  const res = await apiClient.get<Partial<ResumeProfile> | null>('/resume', {
    cache: 'no-store',
  })

  return normalizeResume(res)
}

/**
 * 校验简历访问密码，密码提交前先在前端加密。
 */
export const verifyResumePassword = async (password: string) => {
  return apiClient.post<Record<string, never>>('/resume/verify-password', {
    password: await encryptPassword(password),
  })
}

/**
 * 拼接后端接口完整地址，专门给原生 fetch 下载场景使用。
 */
const getApiUrl = (path: string) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  return `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/**
 * 从下载响应头里解析文件名，解析失败时使用默认 resume.pdf。
 */
const getFilenameFromDisposition = (disposition: string | null) => {
  if (!disposition) return 'resume.pdf'
  const filename = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)?.[1]
  return filename ? decodeURIComponent(filename) : 'resume.pdf'
}

const resumeErrorMessageMap: Record<string, string> = {
  'Resume password is required': '请先设置简历下载密码',
  'Resume password is not configured': '简历下载密码未配置',
  'Resume password is incorrect': '简历密码不正确',
  'Resume is not configured': '简历信息未配置',
  'Resume file is not configured': '简历文件未配置',
  'Invalid resume file path': '简历文件路径无效',
  'Resume file does not exist': '简历文件不存在',
}

/**
 * 将后端英文错误转换为前台可展示的中文提示。
 */
const toResumeErrorMessage = (message?: string) => {
  if (!message) return '密码验证失败'
  return resumeErrorMessageMap[message] || message
}

/**
 * 密码通过后查询完整简历内容，用于“查看更多”解锁后的页面渲染。
 */
export const getFullResume = async (password: string) => {
  try {
    const res = await apiClient.post<Partial<ResumeProfile> | null>('/resume/full', {
      password: await encryptPassword(password),
    })
    return normalizeResume(res)
  } catch (error) {
    throw new Error(toResumeErrorMessage(error instanceof Error ? error.message : ''))
  }
}

/**
 * 带密码下载简历文件，返回文件 blob 和后端响应中的文件名。
 */
export const downloadResumeWithPassword = async (password: string) => {
  const encryptedPassword = await encryptPassword(password)
  const response = await fetch(getApiUrl('/resume/download'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: encryptedPassword }),
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const payload = await response.json()
      throw new Error(toResumeErrorMessage(payload.message))
    }
    throw new Error(toResumeErrorMessage(await response.text()))
  }

  return {
    blob: await response.blob(),
    filename: getFilenameFromDisposition(response.headers.get('content-disposition')),
  }
}
