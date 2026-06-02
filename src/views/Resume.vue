<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Briefcase, Download, FolderGit2, GraduationCap, Mail, MapPin } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { defaultResume, getResume } from '@/api/resume'
import type { ResumeProfile, ResumeSkill, ResumeTimelineItem } from '@/types/content'

const resumeRoot = ref<HTMLElement | null>(null)
const resume = ref<ResumeProfile>(defaultResume)
let ctx: gsap.Context | undefined

const getFileUrl = (path: string) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''
  return `${baseURL.replace(/\/$/, '')}${path}`
}

const avatarUrl = computed(() => resume.value.avatar || defaultResume.avatar)
const resumeFileUrl = computed(() => getFileUrl(resume.value.resumeFile))
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const getResumeFilename = () => {
  const path = resumeFileUrl.value.split('?')[0]
  const filename = decodeURIComponent(path.split('/').pop() || '')
  return filename || 'resume.pdf'
}

const downloadResume = async () => {
  if (!resumeFileUrl.value) return

  const link = document.createElement('a')
  link.download = getResumeFilename()

  try {
    const response = await fetch(resumeFileUrl.value)
    if (!response.ok) throw new Error('resume download failed')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    link.href = url
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  } catch {
    link.href = resumeFileUrl.value
    link.target = '_blank'
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

const skillTagClass = (skill: ResumeSkill) => {
  if (skill.level.includes('精通')) return 'cl-tag-rose'
  if (skill.level.includes('掌握')) return 'cl-tag-amber'
  return 'cl-tag-sky'
}

const itemDescList = (item: ResumeTimelineItem) => {
  if (Array.isArray(item.desc)) return item.desc
  if (!item.desc) return []
  return String(item.desc).split('\n').map((value) => value.trim()).filter(Boolean)
}

onMounted(() => {
  getResume()
    .then((data) => {
      resume.value = data
    })
    .catch(() => {
      resume.value = defaultResume
    })

  if (!resumeRoot.value || prefersReducedMotion()) return

  ctx = gsap.context(() => {
    gsap.to('.resume-avatar-orbit', {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: 'none',
    })

    gsap.to('.resume-timeline-dot-active', {
      scale: 1.42,
      duration: 1.15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    gsap.from('.resume-section-icon-large', {
      scale: 0.6,
      rotation: -10,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.8)',
      delay: 0.25,
    })
  }, resumeRoot.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="resumeRoot" class="resume-page-container">
    <div class="resume-header-wrapper">
      <div>
        <h1 class="resume-title">{{ resume.title }}</h1>
        <p class="resume-subtitle">{{ resume.subtitle }}</p>
      </div>
      <button
        class="resume-download-btn interactive-lift"
        :disabled="!resumeFileUrl"
        @click="downloadResume"
      >
        下载简历 PDF
        <Download class="resume-download-icon" />
      </button>
    </div>

    <div class="resume-grid">
      <div class="resume-left-column">
        <div class="resume-profile-card interactive-card">
          <div class="resume-avatar-wrapper">
            <span class="resume-avatar-orbit" aria-hidden="true"></span>
            <img :src="avatarUrl" alt="Avatar" class="resume-avatar" />
          </div>
          <h2 class="resume-name">{{ resume.name }}</h2>
          <p class="resume-role">{{ resume.role }}</p>

          <div class="resume-contact-list">
            <div class="resume-contact-item">
              <MapPin class="resume-contact-icon" />
              <span>{{ resume.location }}</span>
            </div>
            <div class="resume-contact-item">
              <Mail class="resume-contact-icon" />
              <a :href="`mailto:${resume.email}`" class="resume-contact-link">{{ resume.email }}</a>
            </div>
          </div>
        </div>

        <div class="resume-skills-card interactive-card">
          <div class="resume-section-header">
            <h3 class="resume-section-title">核心技能</h3>
          </div>

          <div class="resume-skills-list">
            <div
              v-for="skill in resume.skills"
              :key="`${skill.name}-${skill.level}`"
              class="resume-skill-item interactive-lift"
            >
              <span class="resume-skill-name">{{ skill.name }}</span>
              <span class="resume-skill-tag" :class="skillTagClass(skill)">{{ skill.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="resume-right-column">
        <section class="resume-experience-card interactive-card">
          <div class="resume-section-header-large">
            <Briefcase class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">工作经历</h3>
          </div>

          <div class="resume-timeline-spaced">
            <div
              v-for="(item, index) in resume.experiences"
              :key="`experience-${index}`"
              class="resume-timeline-item"
            >
              <div :class="index === 0 ? 'resume-timeline-dot-active' : 'resume-timeline-dot'"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">{{ item.title }}</h4>
                <span :class="index === 0 ? 'resume-timeline-date-active' : 'resume-timeline-date'">
                  {{ item.date }}
                </span>
              </div>
              <p v-if="item.company" class="resume-timeline-company">{{ item.company }}</p>
              <ul class="resume-timeline-desc">
                <li v-for="desc in itemDescList(item)" :key="desc">{{ desc }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="resume-education-card interactive-card">
          <div class="resume-section-header-large">
            <GraduationCap class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">教育背景</h3>
          </div>

          <div class="resume-timeline">
            <div v-for="(item, index) in resume.educations" :key="`education-${index}`" class="resume-timeline-item">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">{{ item.title }}</h4>
                <span class="resume-timeline-date">{{ item.date }}</span>
              </div>
              <p v-if="item.school" class="resume-timeline-company">{{ item.school }}</p>
              <p class="resume-timeline-desc-inline">{{ itemDescList(item).join(' ') }}</p>
            </div>
          </div>
        </section>

        <section class="resume-education-card interactive-card">
          <div class="resume-section-header-large">
            <FolderGit2 class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">项目经历</h3>
          </div>

          <div class="resume-timeline">
            <div v-for="(item, index) in resume.projects" :key="`project-${index}`" class="resume-timeline-item project-item">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">{{ item.title }}</h4>
                <span class="resume-timeline-date">{{ item.date }}</span>
              </div>
              <p v-if="item.stack" class="resume-timeline-company">{{ item.stack }}</p>
              <ul class="resume-timeline-desc">
                <li v-for="desc in itemDescList(item)" :key="desc">{{ desc }}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-page-container {
  min-height: 80vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 8rem 1.5rem 4rem;
}

.resume-header-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.resume-title {
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
}

.resume-subtitle {
  max-width: 42rem;
  color: var(--color-text);
  font-size: 1.125rem;
  line-height: 1.8;
}

.resume-download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.72rem 1.45rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(244, 63, 94, 0.18);
  text-decoration: none;
}

.resume-download-btn:disabled {
  cursor: not-allowed;
  opacity: 0.56;
}

.resume-download-icon {
  width: 1rem;
  height: 1rem;
}

.resume-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

.resume-left-column,
.resume-right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.resume-profile-card,
.resume-skills-card,
.resume-experience-card,
.resume-education-card {
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  background: var(--color-card);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}

.resume-profile-card {
  text-align: center;
}

.resume-avatar-wrapper {
  position: relative;
  isolation: isolate;
  width: 8rem;
  height: 8rem;
  margin: 0 auto 1.5rem;
  overflow: hidden;
  border: 4px solid #fff;
  border-radius: 999px;
  box-shadow: 0 16px 36px rgba(244, 63, 94, 0.18);
}

.resume-avatar-orbit {
  position: absolute;
  inset: -35%;
  z-index: 0;
  background: conic-gradient(from 120deg, transparent, rgba(244, 63, 94, 0.72), rgba(14, 165, 233, 0.6), transparent);
  filter: blur(4px);
  opacity: 0.78;
}

.resume-avatar {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  padding: 4px;
}

.resume-name {
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-size: 1.5rem;
  font-weight: 800;
}

.resume-role {
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
}

.resume-contact-list {
  display: grid;
  gap: 1rem;
  color: var(--color-text);
  font-size: 0.875rem;
  text-align: left;
}

.resume-contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.resume-contact-icon {
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
}

.resume-contact-link:hover {
  color: var(--color-primary);
}

@media (max-width: 767px) {
  .resume-profile-card,
  .resume-skills-card,
  .resume-experience-card,
  .resume-education-card {
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: none;
  }

  .resume-profile-card {
    text-align: left;
  }

  .resume-avatar-wrapper {
    display: none;
  }

  .resume-role {
    margin-bottom: 0.75rem;
  }

  .resume-contact-list {
    gap: 0.25rem;
  }

  .resume-contact-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    overflow-wrap: anywhere;
  }

  .resume-grid {
    gap: 1rem;
  }

  .resume-left-column,
  .resume-right-column {
    gap: 1rem;
  }

  .resume-section-header,
  .resume-section-header-large {
    margin-bottom: 1rem;
  }

  .resume-section-icon-large {
    display: none;
  }

  .resume-skill-item {
    padding: 0.7rem 0.875rem;
  }

  .resume-timeline,
  .resume-timeline-spaced {
    gap: 1.5rem;
    margin-left: 0;
    border-left: 0;
  }

  .resume-timeline-item {
    padding-left: 0;
  }

  .resume-timeline-dot,
  .resume-timeline-dot-active {
    display: none;
  }

  .resume-timeline-company {
    margin-bottom: 0.5rem;
  }

  .resume-timeline-desc {
    gap: 0.35rem;
    line-height: 1.6;
  }
}

.resume-section-header,
.resume-section-header-large {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.resume-section-title {
  font-size: 1.125rem;
  font-weight: 800;
}

.resume-section-icon-large {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
}

.resume-section-title-large {
  font-size: 1.25rem;
  font-weight: 800;
}

.resume-skills-list {
  display: grid;
  gap: 1rem;
}

.resume-skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: var(--color-background);
}

.resume-skill-name {
  color: var(--color-heading);
  font-weight: 700;
}

.resume-skill-tag {
  flex: none;
  padding: 0.16rem 0.75rem;
  border: 1px solid;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.cl-tag-rose {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #e11d48;
}

.cl-tag-amber {
  border-color: #fde68a;
  background: #fffbeb;
  color: #d97706;
}

.cl-tag-sky {
  border-color: #bae6fd;
  background: #f0f9ff;
  color: #0284c7;
}

.resume-timeline,
.resume-timeline-spaced {
  position: relative;
  display: grid;
  gap: 2rem;
  margin-left: 0.75rem;
  border-left: 1px solid var(--color-border);
}

.resume-timeline-item {
  position: relative;
  padding-left: 2rem;
}

.project-item:not(:last-child) {
  margin-bottom: 0.5rem;
}

.resume-timeline-dot,
.resume-timeline-dot-active {
  position: absolute;
  top: 0.4rem;
  left: -0.34rem;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  box-shadow: 0 0 0 4px var(--color-background);
}

.resume-timeline-dot {
  background: var(--color-text);
}

.resume-timeline-dot-active {
  background: var(--color-primary);
}

.resume-timeline-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.resume-timeline-title {
  color: var(--color-heading);
  font-size: 1.05rem;
  font-weight: 800;
}

.resume-timeline-date,
.resume-timeline-date-active {
  width: fit-content;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
}

.resume-timeline-date {
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
}

.resume-timeline-date-active {
  background: var(--color-secondary);
  color: var(--color-primary);
}

.resume-timeline-company {
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-weight: 700;
}

.resume-timeline-desc {
  display: grid;
  gap: 0.5rem;
  color: var(--color-text);
  font-size: 0.92rem;
  line-height: 1.75;
}

.resume-timeline-desc-inline {
  color: var(--color-text);
  font-size: 0.92rem;
  line-height: 1.75;
}

.interactive-card,
.interactive-lift {
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.interactive-card:hover,
.interactive-lift:hover {
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .resume-header-wrapper {
    flex-direction: row;
    align-items: flex-end;
  }

  .resume-timeline-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 1024px) {
  .resume-page-container {
    padding-inline: 3rem;
  }

  .resume-grid {
    grid-template-columns: 4fr 8fr;
  }
}
</style>
