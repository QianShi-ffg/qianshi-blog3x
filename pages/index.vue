<template>
  <div class="list">
    <div class="listItem" v-for="item in listData" :key="item.id" @click="jump(item.id)">
      <div class="title">{{ item.title }}</div>
      <div>{{ item.describe }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { data: posts, pending, error } = await useFetch(() => `/article/publishArticle?page=1&pageSize=10`, { baseURL: 'http://oss.xingyijun.cn' });

const router = useRouter()
const listData = ref<any>([])

onMounted(() => {
  listData.value = posts.value.data
})

const jump = (value: any) => {
  router.push(`/articleDetail/${value}`)
}
</script>

<style lang="scss" scoped>
.list {
  margin: 20px auto;
  min-width: 1200px;
  .listItem {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 50px;
    margin: 20px auto;
    box-sizing: border-box;
    width: 800px;
    height: 90px;
    margin-bottom: 20px;
    background-color: #f4f3ee;
    cursor: pointer;
    .title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }
}
</style>