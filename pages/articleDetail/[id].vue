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
import "highlight.js/styles/tokyo-night-dark.css";
// import 'highlight.js/styles/tokyo-night-light.css'

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
    let currentLang: string = "";
    if (lang === "vue" || lang === "react") {
      currentLang = "js";
    } else {
      currentLang = lang;
    }
    const linesLength = str.split(/\n/).length - 1;
    // 生成行号
    let linesNum = '<span class="line-numbers-rows">';
    for (let index = 0; index < linesLength; index++) {
      linesNum = linesNum + `<span>${index + 1}</span>`;
    }
    linesNum += "</span>";
    if (lang && hljs.getLanguage(currentLang)) {
      try {
        return (
          `<pre class="hljs">${linesNum}<span class="copyBtn">复制代码</span><code language-${currentLang} language="${lang}">` +
          hljs.highlight(currentLang, str, true).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  }
});

const html = computed(() => {
  return md.render(data.value.articleContent);
});

const init = async () => {
  const {
    data: posts,
    pending,
    error,
    refresh
  } = await useFetch(() => `/article/${route.params.id}`, {
    baseURL: "https://oss.xingyijun.cn"
  });
  await refresh();
  data.value = posts.value.data;
};

onMounted(() => {
  init();
  nextTick(() => {
    window.addEventListener("click", copyText);
  });
});

onUnmounted(() => {
  window.removeEventListener("click", copyText);
});

const copyText = (e: any) => {
  if (e.target.className === "copyBtn") {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(e.target.nextElementSibling.innerText)
        .then(() => {
          if (e.target.innerText !== "已复制") {
            const originalText = e.target.innerText;
            e.target.innerText = "已复制";
            setTimeout(() => {
              e.target.innerText = originalText;
            }, 1500);
          }
        })
        .catch((err) => {
          console.log("Something went wrong", err);
        });
    } else {
      // 创建text area
      const textArea = document.createElement("textarea");
      textArea.value = `${e.target.nextElementSibling.innerText}`;
      // 使text area不在viewport，同时设置不可见
      e.target.parentNode.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        // 执行复制命令并移除文本框
        document.execCommand("copy") ? resolve('') : reject(new Error("出错了"));
        textArea.remove();
      }).then(
        () => {
          if (e.target.innerText !== "已复制") {
            const originalText = e.target.innerText;
            e.target.innerText = "已复制";
            setTimeout(() => {
              e.target.innerText = originalText;
            }, 1500);
          }
        },
      );
    }
  }
};

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
