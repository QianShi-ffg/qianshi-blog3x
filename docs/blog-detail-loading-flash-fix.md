# 文章详情页加载闪屏问题排查与修复记录

## 1. 问题背景

本次问题出现在文章列表页跳转文章详情页的过程中，典型路径为：

```text
/blog -> /blog/:id
```

用户在实际预览中观察到，点击文章卡片进入详情页时，详情页顶部 hero 区域会出现明显的视觉闪屏：

```text
白色/空白底色 -> 灰色 loading 骨架 -> 实际封面图片
```

这类问题虽然不是功能错误，但会直接影响页面的精致感。尤其文章详情页首屏以大图 hero 为视觉中心，任何短暂的空白、灰底或位置跳动都会被放大。

## 2. 现象复现

在浏览器中进入文章列表页：

```text
http://localhost:5173/blog
```

点击文章卡片进入详情页，例如：

```text
http://localhost:5173/blog/24
```

初始可见问题包括：

- 页面跳转时曾出现向左偏移的离场动画。
- 详情页进入时，旧的文章列表页曾短暂残留在 loading 层后面。
- 详情页 hero 区域先出现灰色骨架，再切换成真实封面图，造成闪屏。
- `post-hero-header` 内部标题元素仍有从下往上的入场动画，加重了“页面在动”的错觉。

## 3. 初步判断与尝试

### 3.1 路由过渡动画导致页面偏移

最早的问题是路由离场动画中存在位置相关样式。全局路由 transition 在离场阶段使用了绝对定位或位移类样式后，旧页面在退出时会出现横向偏移。

处理方向：

- 将页面离场动画收敛为纯 opacity 淡入淡出。
- 移除会导致布局偏移的 transform / absolute 离场效果。
- 保留较短的淡入淡出时间，避免整页跳转过于生硬。

### 3.2 `post-hero-header` 自身动画造成闪动错觉

文章详情页 hero 内部元素使用了 `v-motion`，标题、分类、元信息都有从下向上的进入动画。即使路由层动画已经改成淡入淡出，hero 内部仍然会给用户一种“页面先跳一下再稳定”的感觉。

处理方向：

- 不把问题只归因于路由 transition。
- 重点检查详情页首屏本身的 loading、图片加载、内容动画时序。

### 3.3 loading 骨架与真实封面图不一致

真正造成“白到灰到图”的核心原因在 `BlogPost.vue`：

- 页面刚进入时，文章详情接口还没有返回，`article` 为空。
- 此时渲染的是第一套 loading 页面：`!article && isLoading`。
- 这套 loading 页面最初没有拿到文章封面图，只能显示默认灰色/渐变背景。
- 接口返回后，页面切到真实文章内容或第二套 overlay loading。
- 真实封面图加载完成后，再显示最终 hero。

于是用户看到的就是：

```text
路由切换底色 -> 无封面 loading -> 带封面的真实 hero
```

这也是本次闪屏体验差的根因。

## 4. 定位结论

问题不是单一动画导致的，而是多个时序叠加：

1. 全局路由 transition 曾经让页面离场产生偏移。
2. `/blog -> /blog/:id` 使用 `mode="out-in"` 时，旧页面先退出，新页面再进入，中间更容易露出底色。
3. 详情页第一套 loading 分支没有立即使用封面图。
4. 真实 `<img>` 解码完成前，loading 背景和最终 hero 视觉不一致。
5. hero 内部入场动画进一步放大了闪动感。

因此，修复目标不是“加一个更复杂的骨架屏”，而是让首帧、loading 帧、最终帧尽量共享同一个视觉背景。

## 5. 最终解决方案

### 5.1 列表跳详情时提前传递封面图

在 `src/views/Blog.vue` 中，点击文章卡片时不只传文章 id，还把列表中已有的 `coverUrl` 通过 query 带到详情页：

```ts
const openArticle = (article: ArticleSummary) => {
  router.push({
    path: `/blog/${article.id}`,
    query: article.coverUrl ? { coverUrl: article.coverUrl } : undefined,
  })
}
```

这样详情页不需要等详情接口返回，就能在第一帧拿到封面图。

### 5.2 详情页统一封面来源

在 `src/views/BlogPost.vue` 中增加统一的封面计算逻辑：

```ts
const initialCoverUrl = typeof route.query.coverUrl === 'string' ? route.query.coverUrl : ''
const coverSrc = computed(() => article.value?.coverUrl || initialCoverUrl || thumb)
```

优先级为：

```text
详情接口返回的 coverUrl -> 列表页传入的 coverUrl -> 本地默认图
```

这样 loading 和最终 hero 都使用同一个 `coverSrc`，避免中途换底。

### 5.3 第一套 loading 页面也使用封面背景

之前只有第二套 overlay loading 使用封面背景，第一套 `!article && isLoading` loading 页面没有用。

修复后，第一套 loading 也设置同一个 CSS 变量：

```vue
<div
  v-if="!article && isLoading"
  class="blog-post-loading-page"
  :style="{ '--post-loading-cover-url': `url(${coverSrc})` }"
>
```

对应的 `.post-loading-cover` 使用这个变量作为背景图。这样页面刚进入详情时，首屏 hero 区域已经是当前文章封面，而不是纯灰色骨架。

### 5.4 预加载封面图后再移除 loading

详情接口返回后，先预加载并尝试 decode 图片：

```ts
const preloadImage = (src: string) => {
  return new Promise<void>((resolve) => {
    const image = new Image()

    const finish = () => resolve()

    image.onload = async () => {
      try {
        await image.decode?.()
      } catch {
        // Keep rendering even when the browser cannot decode ahead of paint.
      }
      finish()
    }
    image.onerror = finish
    image.src = src
  })
}
```

这样 loading overlay 不会在图片还没准备好时过早消失。

### 5.5 文章详情进入时跳过全局路由淡入淡出

在 `src/App.vue` 中，进入 `blog-post` 时不再走全局 page fade：

```vue
<transition
  :name="route.name === 'blog-post' ? undefined : 'page-fade'"
  :css="route.name !== 'blog-post'"
  :mode="route.name === 'blog-post' ? undefined : 'out-in'"
>
  <component :is="Component" :key="route.path" />
</transition>
```

原因是文章详情页本身已经有首屏 loading 和图片过渡，再叠加全局路由淡入淡出只会增加中间态。对 `/blog -> /blog/:id` 这类图片详情页，直接进入详情组件，再由组件内部控制首屏视觉，会更稳定。

### 5.6 文章路由滚动使用即时滚动

在 `src/router/index.ts` 中，文章列表和文章详情之间切换时使用即时滚动：

```ts
const isArticleRouteChange =
  (from.name === 'blog' && to.name === 'blog-post') ||
  (from.name === 'blog-post' && to.name === 'blog')

return {
  top: 0,
  behavior: isArticleRouteChange ? 'auto' : 'smooth',
}
```

避免路由切换时滚动动画和页面切换动画叠加，造成顶部区域不稳定。

## 6. 验证结果

完成修改后执行验证：

```bash
pnpm run build-only
pnpm run test:unit -- --run
```

结果：

- `pnpm run build-only` 通过。
- `pnpm run test:unit -- --run` 通过。
- 在浏览器中从 `/blog` 点击文章卡片进入 `/blog/23`、`/blog/24`，首屏早期帧已经稳定显示同一张封面图。
- 未再观察到旧列表页残影。
- 未再观察到明显的灰色 hero 插帧。

## 7. 本次经验

### 7.1 loading 不应该和最终内容视觉断层

骨架屏不是越明显越好。对大图详情页来说，如果最终首屏是图片 hero，loading 首屏也应该尽量使用同一张图或同一色彩基底。

否则用户看到的不是“加载状态”，而是“页面换了一次皮”。

### 7.2 路由动画和页面内部动画要分工明确

全局路由 transition 适合普通页面淡入淡出，但图片详情页往往需要自己的首屏控制。

当页面内部已经有 loading overlay、图片预加载、标题入场动画时，再叠加全局 out-in transition，容易产生：

- 空白中间帧
- 旧页面残影
- 页面偏移错觉
- 多段动画互相抢注意力

### 7.3 列表页已有数据应复用到详情页首屏

文章列表中已经有 `coverUrl`，详情页没有必要等待详情接口返回后才知道封面图。

把列表已有的封面图作为详情页初始渲染数据，可以显著改善首屏体验，同时不改变接口数据的最终权威来源。

### 7.4 动画优化要以真实浏览器复现为准

这次问题仅靠代码判断很容易漏掉实际视觉体验。最终通过浏览器实际点击跳转，并抓取跳转后的早期帧，才确认问题来自首屏 loading 时序，而不是单纯来自 CSS transition。

## 8. 涉及文件

本次问题修复主要涉及：

```text
src/App.vue
src/router/index.ts
src/views/Blog.vue
src/views/BlogPost.vue
```

其中最终针对闪屏核心问题的关键点在：

```text
src/views/Blog.vue       提前传递 coverUrl
src/views/BlogPost.vue   loading 与真实 hero 统一 coverSrc
src/App.vue              文章详情进入时跳过全局 page fade
src/router/index.ts      文章路由切换使用即时滚动
```

