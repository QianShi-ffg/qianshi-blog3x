import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', () => {
  const currentPage = ref(1)
  const coverUrl = ref('')

  function setPage(page: number) {
    currentPage.value = page
  }

  function setCoverUrl(url: string) {
    coverUrl.value = url
  }

  return { currentPage, coverUrl, setPage, setCoverUrl }
})
