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

const normalizeListText = (value: string[] | string) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value).split('\n').map((item) => item.trim()).filter(Boolean)
}

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

export const getResume = async () => {
  const res = await apiClient.get<Partial<ResumeProfile> | null>('/resume', {
    cache: 'no-store',
  })

  return normalizeResume(res)
}

export const verifyResumePassword = async (password: string) => {
  return apiClient.post<Record<string, never>>('/resume/verify-password', {
    password: await encryptPassword(password),
  })
}

const getApiUrl = (path: string) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  return `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

const getFilenameFromDisposition = (disposition: string | null) => {
  if (!disposition) return 'resume.pdf'
  const filename = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)?.[1]
  return filename ? decodeURIComponent(filename) : 'resume.pdf'
}

const resumeErrorMessageMap: Record<string, string> = {
  'Resume password is required': '请先设置简历下载密码',
  'Resume password is not configured': '简历下载密码未配置',
  'Resume password is incorrect': '简历密码不正确',
  'Resume file is not configured': '简历文件未配置',
  'Invalid resume file path': '简历文件路径无效',
  'Resume file does not exist': '简历文件不存在',
}

const toResumeErrorMessage = (message?: string) => {
  if (!message) return '密码验证失败'
  return resumeErrorMessageMap[message] || message
}

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
