<template>
  <div class="articleDetail">
    <div class="title">{{ data.title }}</div>
    <div class="content" v-html="html"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
const route = useRoute()
const data = ref<any>({
  articleContent: ''
})

const { data: posts, pending, error } = await useFetch(() => `/article/${route.params.id}`, { baseURL: 'https://oss.xingyijun.cn' });

onMounted(() => {
  data.value = posts.value.data
})

const html = computed(()=>{
  return md.render(data.value.articleContent);
})

// console.log(html)
</script>

<style lang="scss" scoped>
.articleDetail {
  padding: 20px;
  width: 900px;
  box-sizing: border-box;
  margin: 20px auto;
  background-color: #f4f3ee;
  .title {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 50px;
  }
}
</style>