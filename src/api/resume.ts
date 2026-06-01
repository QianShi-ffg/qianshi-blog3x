import { apiClient } from './http'
import type { ResumeProfile } from '@/types/content'

export const defaultResume: ResumeProfile = {
  title: '关于我',
  subtitle: '热爱简洁、易用，也喜欢把日常里的想法认真做出来。',
  name: 'QianShiBlog',
  role: '前端开发人员',
  avatar:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20avatar%20illustration%2C%20flat%20design%2C%20soft%20colors%2C%20young%20developer&image_size=square',
  location: '中国 · 杭州',
  email: 'hello@QianShiBlog.dev',
  summary: '',
  skills: [
    { name: 'Vue.js / React', level: '精通' },
    { name: 'TypeScript', level: '掌握' },
    { name: 'CSS / Tailwind', level: '精通' },
    { name: 'Node.js', level: '熟悉' },
  ],
  experiences: [
    {
      title: '前端开发人员',
      date: '2021 至今',
      company: '个人项目与产品实践',
      desc: [
        '负责个人站点、后台管理和内容展示页面的设计与实现。',
        '持续优化页面动效、响应式体验和内容维护流程。',
        '把日常记录、文章和作品整理成可长期维护的个人空间。',
      ],
    },
  ],
  educations: [
    {
      title: '持续学习',
      date: '长期',
      school: '自我驱动',
      desc: '关注界面体验、交互细节和产品表达，也保持对生活本身的观察。',
    },
  ],
  projects: [
    {
      title: 'QianShiBlog',
      date: '长期维护',
      stack: '个人网站 / 内容管理 / 作品展示',
      desc: [
        '维护文章、日记、作品、友链等内容模块。',
        '让后台管理和前台展示形成一条更顺手的内容链路。',
      ],
    },
  ],
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
    avatar: resume.avatar || defaultResume.avatar,
    skills: resume.skills?.length ? resume.skills : defaultResume.skills,
    experiences: resume.experiences?.length
      ? resume.experiences.map((item) => ({ ...item, desc: normalizeListText(item.desc) }))
      : defaultResume.experiences,
    educations: resume.educations?.length
      ? resume.educations.map((item) => ({ ...item, desc: normalizeListText(item.desc) }))
      : defaultResume.educations,
    projects: resume.projects?.length
      ? resume.projects.map((item) => ({ ...item, desc: normalizeListText(item.desc) }))
      : defaultResume.projects,
  }
}

export const getResume = async () => {
  const res = await apiClient.get<Partial<ResumeProfile> | null>('/resume', {
    cache: 'no-store',
  })

  return normalizeResume(res)
}
