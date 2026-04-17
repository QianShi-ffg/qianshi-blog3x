<script setup lang="ts">
const emit = defineEmits(['navigate']);

const navigateTo = (page) => {
  emit('navigate', page);
};

const experiences = [
  {
    title: '高级前端开发工程师',
    company: '某互联网科技公司',
    period: '2023年 - 至今',
    description: '负责公司核心产品的前端架构设计与开发，带领团队完成多个重要项目的交付。'
  },
  {
    title: '前端开发工程师',
    company: '某创业公司',
    period: '2021年 - 2023年',
    description: '参与公司产品的设计与开发，负责前端技术选型和性能优化工作。'
  },
  {
    title: 'Web开发工程师',
    company: '某软件公司',
    period: '2019年 - 2021年',
    description: '负责企业官网和内部系统的开发与维护工作。'
  }
];

const education = [
  {
    degree: '计算机科学与技术 学士',
    school: '某大学',
    period: '2015年 - 2019年',
    description: '主修课程包括数据结构、算法设计、操作系统、计算机网络等。'
  }
];

const certifications = [
  'AWS Certified Solutions Architect',
  'Google Cloud Professional Developer',
  '阿里云高级工程师认证'
];
</script>

<template>
  <div class="resume">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('portfolio')">作品</a></li>
              <li><a href="#" class="nav-link active" @click.prevent="navigateTo('resume')">简历</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('friends')">友链</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main">
      <div class="container">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content">
            <h2 class="hero-title">张明</h2>
            <p class="hero-subtitle">高级前端开发工程师</p>
            <div class="hero-info">
              <span class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                北京
              </span>
              <span class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                zhangming@example.com
              </span>
              <span class="info-item">
                <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                138-xxxx-xxxx
              </span>
            </div>
            <div class="hero-actions">
              <a href="#" class="btn btn-primary">
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                下载简历
              </a>
              <a href="#" class="btn btn-secondary">
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                联系我
              </a>
            </div>
          </div>
          <div class="hero-avatar">
            <div class="avatar-wrapper">
              <span class="avatar-text">张</span>
            </div>
          </div>
        </section>

        <!-- 个人简介 -->
        <section class="section">
          <h3 class="section-title">
            <span class="title-icon">👤</span>
            个人简介
          </h3>
          <div class="section-content">
            <p class="intro-text">
              拥有5年前端开发经验，擅长 Vue 和 React 技术栈，对前端工程化和性能优化有深入研究。
              热爱技术，关注用户体验，致力于打造高质量的 Web 应用。具有良好的团队协作能力和沟通能力，
              能够独立完成复杂项目的架构设计。
            </p>
          </div>
        </section>

        <!-- 工作经历 -->
        <section class="section">
          <h3 class="section-title">
            <span class="title-icon">💼</span>
            工作经历
          </h3>
          <div class="timeline">
            <div v-for="exp in experiences" :key="exp.title" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4 class="timeline-title">{{ exp.title }}</h4>
                  <span class="timeline-period">{{ exp.period }}</span>
                </div>
                <p class="timeline-company">{{ exp.company }}</p>
                <p class="timeline-description">{{ exp.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 教育背景 -->
        <section class="section">
          <h3 class="section-title">
            <span class="title-icon">🎓</span>
            教育背景
          </h3>
          <div class="timeline">
            <div v-for="edu in education" :key="edu.degree" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4 class="timeline-title">{{ edu.degree }}</h4>
                  <span class="timeline-period">{{ edu.period }}</span>
                </div>
                <p class="timeline-company">{{ edu.school }}</p>
                <p class="timeline-description">{{ edu.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 证书资质 -->
        <section class="section">
          <h3 class="section-title">
            <span class="title-icon">📜</span>
            证书资质
          </h3>
          <div class="certifications">
            <div v-for="cert in certifications" :key="cert" class="certification-item">
              <svg class="cert-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>{{ cert }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3 class="footer-logo">我的博客</h3>
            <p class="footer-description">记录生活，分享成长</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="#" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" @click.prevent="navigateTo('portfolio')">作品</a></li>
              <li><a href="#" @click.prevent="navigateTo('resume')">简历</a></li>
              <li><a href="#" @click.prevent="navigateTo('friends')">友链</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 我的博客. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 头部 */
.header {
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #DC2626;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #B91C1C;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #3F3F46;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
}

.nav-link:hover,
.nav-link.active {
  color: #DC2626;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #DC2626;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* 主内容 */
.main {
  flex: 1;
  padding: 60px 0;
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
  margin-bottom: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  flex: 1;
  z-index: 1;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #18181B;
}

.hero-subtitle {
  font-size: 20px;
  color: #DC2626;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.hero-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4B5563;
  font-size: 14px;
}

.info-icon {
  width: 18px;
  height: 18px;
  color: #DC2626;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #DC2626;
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: #B91C1C;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #FFFFFF;
  color: #DC2626;
  border: 2px solid #DC2626;
}

.btn-secondary:hover {
  background-color: #FEE2E2;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.hero-avatar {
  z-index: 1;
}

.avatar-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
}

.avatar-text {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
}

/* Section */
.section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #18181B;
}

.title-icon {
  font-size: 28px;
}

.section-content {
  background-color: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.intro-text {
  margin: 0;
  color: #4B5563;
  line-height: 1.8;
  font-size: 15px;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #E5E7EB;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #DC2626;
  border: 3px solid #FEE2E2;
}

.timeline-content {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.timeline-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #18181B;
}

.timeline-period {
  font-size: 13px;
  color: #9CA3AF;
}

.timeline-company {
  font-size: 14px;
  color: #DC2626;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.timeline-description {
  margin: 0;
  font-size: 14px;
  color: #4B5563;
  line-height: 1.6;
}

/* Certifications */
.certifications {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.certification-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.certification-item:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.cert-icon {
  width: 24px;
  height: 24px;
  color: #DC2626;
  flex-shrink: 0;
}

.certification-item span {
  font-size: 14px;
  color: #18181B;
  font-weight: 500;
}

/* 页脚 */
.footer {
  background-color: #F9FAFB;
  padding: 60px 0 30px;
  border-top: 1px solid #E4E4E7;
  margin-top: 80px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-info {
  flex: 1;
  min-width: 250px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #DC2626;
}

.footer-description {
  margin: 0;
  color: #6B7280;
  line-height: 1.6;
}

.footer-links h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #18181B;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  text-decoration: none;
  color: #6B7280;
  transition: color 0.3s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: #DC2626;
}

.footer-bottom {
  border-top: 1px solid #E4E4E7;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #6B7280;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    flex-direction: column-reverse;
    text-align: center;
    padding: 30px;
    gap: 30px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-info {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .avatar-wrapper {
    width: 100px;
    height: 100px;
  }

  .avatar-text {
    font-size: 36px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .nav ul {
    gap: 20px;
  }

  .timeline-header {
    flex-direction: column;
    gap: 8px;
  }

  .certifications {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}
</style>