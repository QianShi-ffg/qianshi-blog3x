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
  longContent: string
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
