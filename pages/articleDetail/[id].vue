<template>
  <div class="articleDetail">
    <div class="title">{{ data.title }}</div>
    <div class="content" v-html="html"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
// import 'highlight.js/styles/gradient-light.css'
// import 'highlight.js/styles/hybrid.css'
// import 'highlight.js/styles/kimbie-light.css'
// import 'highlight.js/styles/nord.css'
// import 'highlight.js/styles/paraiso-dark.css'
// import 'highlight.js/styles/paraiso-light.css'
// import 'highlight.js/styles/qtcreator-light.css'
// import 'highlight.js/styles/tokyo-night-dark.css'

const route = useRoute();
const data = ref<any>({
  articleContent: ""
});
const md: any = new MarkdownIt({
  html: false, // 在源码中启用 HTML 标签
  xhtmlOut: false, // 使用 '/' 来闭合单标签 （比如 <br />）。
  breaks: false, // 转换段落里的 '\n' 到 <br>。
  langPrefix: "language-", // 给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用。
  linkify: false, // 将类似 URL 的文本自动转换为链接
  // 高亮函数，会返回转义的HTML。
  // 如果结果以 <pre ... 开头，内部包装器则会跳过。
  highlight: function (str, lang) {
    console.log(str, lang, hljs.getLanguage(lang))
    let currentLang: string = ''
    if (lang === 'vue' || lang === 'react') {
      currentLang = 'js'
    } else {
      currentLang = lang
    }
    if (lang && hljs.getLanguage(currentLang)) {
      try {
        return `<pre class="hljs"><code language-${currentLang} language="${lang}"><span class="copyBtn">copy</span>` +
            hljs.highlight(currentLang, str, true).value +
            '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const {
    data: posts,
    pending,
    error
  } = await useFetch(() => `/article/${route.params.id}`, {
    baseURL: "https://oss.xingyijun.cn"
  });

onMounted(() => {
  data.value = posts.value.data;
  // const copyBtn: any = document.getElementsByClassName('copyBtn')[0]
  // if (copyBtn) {
  //   copyBtn.onclick = (e: any) => {
  //     console.log(e, 89999999999)
  //   };
  // }
});


const html = computed(() => {
  return md.render(data.value.articleContent);
});

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
