export interface ArticleSummary {
  date: string
  readTime: string
  category: string
  desc: string
  Views: number
  articleContent: string
  articleStatus: string
  classifyId: string
  coverUrl: string
  createTime: string
  describe: string
  id: number
  tag: string
  title: string
  updataTime: string
}

export interface ArticleDetail extends ArticleSummary {
  coverImage: string
  content: string
}

export type DiaryMomentType = 'text' | 'image' | 'video'

export interface DiaryMoment {
  id: number
  type: DiaryMomentType
  media: string | null
  poster?: string
  content: string
  longContent?: string
  location: string
  date: string
  weather: string
  likes: number
  comments: number
}

export interface DiaryMomentSummary {
  id: number
  type: DiaryMomentType
  media: string | null
  poster?: string
  content: string
  location: string
  date: string
  weather: string
}

export interface Project {
  id: number
  title: string
  category: string
  desc: string
  longDesc: string
  image: string
  images: string[]
  videoUrl: string
  tags: string[]
  role: string
  date: string
  github: string
  demo: string
}

export interface ChangelogChange {
  type: string
  text: string
}

export interface Changelog {
  id?: number
  version: string
  date: string
  tag: string
  title: string
  changes: ChangelogChange[]
}

export interface CommentItem {
  id: number
  targetType: string
  targetId: number
  parentId?: number | null
  replyTo?: string
  author: string
  content: string
  likes: number
  liked?: boolean
  status: string
  time?: string
  createTime?: string
  replies: CommentItem[]
}

export interface ResumeSkill {
  name: string
  level: string
}

export interface ResumeTimelineItem {
  title: string
  date: string
  company?: string
  school?: string
  stack?: string
  desc: string[] | string
}

export interface ResumeProfile {
  title: string
  subtitle: string
  name: string
  role: string
  avatar: string
  resumeFile: string
  location: string
  email: string
  summary: string
  skills: ResumeSkill[]
  experiences: ResumeTimelineItem[]
  educations: ResumeTimelineItem[]
  projects: ResumeTimelineItem[]
}
