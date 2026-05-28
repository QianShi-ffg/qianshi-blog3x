import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import App from './App.vue'
import router from './router'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
