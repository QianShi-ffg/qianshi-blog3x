import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/Blog.vue')
    },
    {
      path: '/blog/:id',
      name: 'blog-post',
      component: () => import('../views/BlogPost.vue')
    },
    {
      path: '/diary',
      name: 'diary',
      component: () => import('../views/Diary.vue')
    },
    {
      path: '/diary/:id',
      name: 'diary-detail',
      component: () => import('../views/DiaryDetail.vue')
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/Portfolio.vue')
    },
    {
      path: '/portfolio/:id',
      name: 'portfolio-detail',
      component: () => import('../views/PortfolioDetail.vue')
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('../views/Resume.vue')
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('../views/Links.vue')
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('../views/Changelog.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
