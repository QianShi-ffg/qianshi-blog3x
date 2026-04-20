<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessageCircle, Heart, Share2, CornerDownRight, User } from 'lucide-vue-next'

const comments = ref([
  {
    id: 1,
    author: '前端小菜鸟',
    avatar:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20cute%20cartoon%20bird%20avatar%2C%20flat%20design%2C%20blue%20background&image_size=square',
    content:
      '太强了！原生 Pointer Events 确实比很多第三方库在定制化场景下好用，就是边界情况处理起来太痛苦了。',
    time: '2 小时前',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 101,
        author: 'QianShiBlog',
        isAuthor: true,
        content: '是的，特别是多层级嵌套的时候，`pointer-events: none` 和事件穿透简直让人头秃 😂',
        time: '1 小时前',
      },
    ],
  },
  {
    id: 2,
    author: 'CodeMaster99',
    avatar:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20geometric%20avatar%2C%20dark%20theme%2C%20hacker%20style&image_size=square',
    content: '请问有开源相关的实现逻辑吗？最近公司也有类似的需求，正在调研技术方案。',
    time: '5 小时前',
    likes: 5,
    isLiked: true,
    replies: [],
  },
  {
    id: 3,
    author: '摸鱼达人',
    avatar:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20lazy%20cat%20avatar%2C%20cute%2C%20pastel%20colors&image_size=square',
    content: '这就是我不做前端的原因，DOM操作太繁琐了，还是写接口爽。不过视觉反馈确实很直接。',
    time: '1 天前',
    likes: 2,
    isLiked: false,
    replies: [],
  },
])

const visitorName = ref('')
const newComment = ref('')

// Reply state
const activeReplyId = ref<number | null>(null)
const replyContent = ref('')
const replyTargetAuthor = ref('')

onMounted(() => {
  const savedName = localStorage.getItem('blog_visitor_name')
  if (savedName) {
    visitorName.value = savedName
  }
})

const saveVisitorName = () => {
  if (visitorName.value.trim()) {
    localStorage.setItem('blog_visitor_name', visitorName.value.trim())
  } else {
    localStorage.removeItem('blog_visitor_name')
  }
}

const toggleLike = (comment: any) => {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

const submitComment = () => {
  if (!newComment.value.trim()) return

  saveVisitorName()
  const nameToUse = visitorName.value.trim() || '访客'

  comments.value.unshift({
    id: Date.now(),
    author: nameToUse,
    avatar:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20simple%20default%20user%20avatar%2C%20gray%20silhouette%20on%20white%20background&image_size=square',
    content: newComment.value,
    time: '刚刚',
    likes: 0,
    isLiked: false,
    replies: [],
  })

  newComment.value = ''
}

const openReply = (commentId: number, author: string) => {
  if (activeReplyId.value === commentId && replyTargetAuthor.value === author) {
    activeReplyId.value = null
    replyContent.value = ''
    return
  }
  activeReplyId.value = commentId
  replyTargetAuthor.value = author
  replyContent.value = ''
}

const submitReply = (commentId: number) => {
  if (!replyContent.value.trim()) return

  saveVisitorName()
  const nameToUse = visitorName.value.trim() || '访客'

  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    if (!comment.replies) {
      comment.replies = []
    }
    comment.replies.push({
      id: Date.now(),
      author: nameToUse,
      isAuthor: false,
      content: `回复 @${replyTargetAuthor.value} : ${replyContent.value}`,
      time: '刚刚',
    })
  }

  activeReplyId.value = null
  replyContent.value = ''
}
</script>

<template>
  <div class="comments-section">
    <h3 class="section-title">
      评论 <span class="comment-count">({{ comments.length }})</span>
    </h3>

    <!-- Comment Input -->
    <div class="comment-input-wrapper">
      <img
        src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20simple%20default%20user%20avatar%2C%20gray%20silhouette%20on%20white%20background&image_size=square"
        alt="Your Avatar"
        class="current-user-avatar"
      />
      <div class="input-container">
        <div class="visitor-info">
          <User class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            v-model="visitorName"
            type="text"
            placeholder="昵称 (选填，留空则为访客)"
            class="visitor-name-input"
            maxlength="20"
          />
        </div>
        <textarea
          v-model="newComment"
          placeholder="说点什么吧..."
          class="comment-textarea"
          rows="3"
        ></textarea>
        <div class="input-actions">
          <button @click="submitComment" class="submit-btn" :disabled="!newComment.trim()">
            发布评论
          </button>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- Main Comment -->
        <div class="comment-main">
          <img :src="comment.avatar" :alt="comment.author" class="comment-avatar" />
          <div class="comment-content-wrapper">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <button
                @click="toggleLike(comment)"
                class="action-btn group"
                :class="{ 'is-liked': comment.isLiked }"
              >
                <Heart
                  class="w-4 h-4"
                  :class="{ 'fill-rose-500 text-rose-500': comment.isLiked }"
                />
                <span>{{ comment.likes }}</span>
              </button>
              <button
                class="action-btn hover:text-slate-700"
                @click="openReply(comment.id, comment.author)"
              >
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div
          v-if="(comment.replies && comment.replies.length > 0) || activeReplyId === comment.id"
          class="replies-wrapper"
        >
          <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <img
              v-if="reply.isAuthor"
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20avatar%20illustration%2C%20flat%20design%2C%20soft%20colors%2C%20young%20developer&image_size=square"
              alt="Author"
              class="reply-avatar"
            />
            <img
              v-else
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20simple%20default%20user%20avatar%2C%20gray%20silhouette%20on%20white%20background&image_size=square"
              alt="Visitor"
              class="reply-avatar"
            />
            <div class="reply-content-wrapper">
              <div class="comment-header">
                <div class="flex items-center gap-2">
                  <span class="comment-author">{{ reply.author }}</span>
                  <span v-if="reply.isAuthor" class="author-badge">作者</span>
                </div>
                <span class="comment-time">{{ reply.time }}</span>
              </div>
              <p class="comment-text">{{ reply.content }}</p>
              <div class="comment-actions">
                <button
                  class="action-btn hover:text-slate-700"
                  @click="openReply(comment.id, reply.author)"
                >
                  <span>回复</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Reply Input Box -->
          <div v-if="activeReplyId === comment.id" class="reply-input-wrapper mt-4">
            <div class="input-container reply-container">
              <textarea
                v-model="replyContent"
                :placeholder="`回复 @${replyTargetAuthor}...`"
                class="comment-textarea"
                rows="2"
                ref="replyInputRef"
              ></textarea>
              <div class="input-actions flex justify-end items-center mt-2 gap-4">
                <button @click="activeReplyId = null" class="cancel-btn text-xs transition-colors">
                  取消
                </button>
                <button
                  @click="submitReply(comment.id)"
                  class="submit-btn"
                  :disabled="!replyContent.trim()"
                >
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comments-section {
  @apply mt-12 pt-12 border-t;
  border-color: var(--color-border);
}

.section-title {
  @apply text-xl font-bold mb-8 flex items-center gap-2;
  color: var(--color-heading);

  .comment-count {
    @apply font-normal text-base;
    color: var(--color-text);
  }
}

.comment-input-wrapper {
  @apply flex gap-4 mb-10;

  .current-user-avatar {
    @apply w-10 h-10 rounded-full object-cover shrink-0 ring-2;
    --tw-ring-color: var(--color-border);
  }
}

.input-container {
  @apply flex-1 rounded-2xl p-4 transition-colors flex flex-col gap-2;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);

  &:focus-within {
    border-color: var(--color-primary);
    background-color: var(--color-card);
    box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.1);
  }

  &.reply-container {
    @apply p-3 rounded-xl;
    background-color: var(--color-background);

    .submit-btn {
      @apply px-4 py-1.5 text-xs;
    }
  }
}

.visitor-info {
  @apply flex items-center gap-2 pb-2 mb-1 transition-colors;
  border-bottom: 1px solid var(--color-border);

  &:focus-within {
    border-color: var(--color-primary);
  }

  .visitor-name-input {
    @apply bg-transparent border-none outline-none text-sm w-full font-medium;
    color: var(--color-text);
    &::placeholder {
      color: #94a3b8; /* slate-400 */
    }
  }
}

.comment-textarea {
  @apply w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed;
  color: var(--color-text);
  &::placeholder {
    color: #94a3b8; /* slate-400 */
  }
}

.cancel-btn {
  color: var(--color-text);
  &:hover {
    color: var(--color-heading);
  }
}

.input-actions {
  @apply flex justify-end mt-1;

  .submit-btn {
    @apply px-5 py-2 bg-rose-500 text-white text-sm font-medium rounded-full transition-all hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-500;
  }
}

.comments-list {
  @apply space-y-8;
}

.comment-item {
  @apply flex flex-col gap-4;
}

.comment-main,
.reply-item {
  @apply flex gap-4;
}

.replies-wrapper {
  @apply pl-14 space-y-6 mt-2 relative;

  &::before {
    content: '';
    @apply absolute left-8 top-0 bottom-4 w-px;
    background-color: var(--color-border);
  }
}

.comment-avatar,
.reply-avatar {
  @apply w-10 h-10 rounded-full object-cover shrink-0;
}

.reply-avatar {
  @apply w-8 h-8;
}

.comment-content-wrapper,
.reply-content-wrapper {
  @apply flex-1;
}

.comment-header {
  @apply flex justify-between items-center mb-1;

  .comment-author {
    @apply font-medium text-sm;
    color: var(--color-heading);
  }

  .author-badge {
    @apply text-[10px] px-1.5 py-0.5 rounded font-semibold;
    background-color: var(--color-secondary);
    color: var(--color-primary);
  }

  .comment-time {
    @apply text-xs;
    color: #94a3b8; /* slate-400 */
  }
}

.comment-text {
  @apply text-sm leading-relaxed mb-2;
  color: var(--color-text);
}

.comment-actions {
  @apply flex items-center gap-4;

  .action-btn {
    @apply flex items-center gap-1.5 text-xs font-medium transition-colors;
    color: #94a3b8; /* slate-400 */

    &.is-liked {
      color: var(--color-primary);
    }

    &:hover:not(.is-liked) {
      color: var(--color-text);
    }
  }
}
</style>
