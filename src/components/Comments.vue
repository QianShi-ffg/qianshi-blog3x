<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Heart, User } from 'lucide-vue-next'
import { likeComment, listComments, saveComment } from '@/api/comment'
import type { CommentItem } from '@/types/content'

const props = defineProps<{
  targetType: string
  targetId: number
}>()

const emits = defineEmits<{
  commentChange: [count: number]
}>()

const comments = ref<CommentItem[]>([])

const visitorName = ref('')
const newComment = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const noticeMessage = ref('')

// Reply state
const activeReplyId = ref<number | null>(null)
const replyContent = ref('')
const replyTargetAuthor = ref('')

const commentCount = computed(() => {
  return comments.value.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)
})

const avatarFrameCount = 150

const getAvatarFrame = (seed: string | number, offset = 0) => {
  const value = String(seed || 'visitor')
  let hash = offset

  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash % avatarFrameCount
}

const getAvatarStyle = (seed: string | number, offset = 0, size = 40) => {
  const frame = getAvatarFrame(seed, offset)

  return {
    '--avatar-y': `-${frame * size}px`,
  }
}

onMounted(async () => {
  const savedName = localStorage.getItem('blog_visitor_name')
  if (savedName) {
    visitorName.value = savedName
  }
  await loadComments()
})

const saveVisitorName = () => {
  if (visitorName.value.trim()) {
    localStorage.setItem('blog_visitor_name', visitorName.value.trim())
  } else {
    localStorage.removeItem('blog_visitor_name')
  }
}

const isCommentLiked = (comment: CommentItem) => Boolean(comment.liked)

const getCommentErrorMessage = (error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message : fallback
  return message === '请求错误(400)' ? '评论太频繁，请稍后再试' : message
}

const loadComments = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    comments.value = await listComments(props.targetType, props.targetId)
    emits('commentChange', commentCount.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '评论加载失败'
    comments.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleLike = async (comment: CommentItem) => {
  noticeMessage.value = ''
  try {
    const res = await likeComment(comment.id)
    comment.likes = res.likes
    comment.liked = res.liked
  } catch (error) {
    noticeMessage.value = error instanceof Error ? error.message : '点赞失败'
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  noticeMessage.value = ''
  try {
    saveVisitorName()
    await saveComment({
      targetType: props.targetType,
      targetId: props.targetId,
      author: visitorName.value.trim() || '访客',
      content: newComment.value,
    })

    newComment.value = ''
    await loadComments()
  } catch (error) {
    noticeMessage.value = getCommentErrorMessage(error, '评论发布失败')
  }
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

const submitReply = async (commentId: number) => {
  if (!replyContent.value.trim()) return

  noticeMessage.value = ''
  try {
    saveVisitorName()
    await saveComment({
      targetType: props.targetType,
      targetId: props.targetId,
      parentId: commentId,
      replyTo: replyTargetAuthor.value,
      author: visitorName.value.trim() || '访客',
      content: replyContent.value,
    })

    activeReplyId.value = null
    replyContent.value = ''
    await loadComments()
  } catch (error) {
    noticeMessage.value = getCommentErrorMessage(error, '回复发布失败')
  }
}
</script>

<template>
  <div class="comments-section">
    <h3 class="section-title">
      评论 <span class="comment-count">({{ commentCount }})</span>
    </h3>

    <!-- Comment Input -->
    <div class="comment-input-wrapper">
      <span
        class="current-user-avatar avatar-sprite"
        :style="getAvatarStyle(visitorName || 'current-user')"
        role="img"
        aria-label="Your Avatar"
      ></span>
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
          <button @click="submitComment" class="submit-btn interactive-lift" :disabled="!newComment.trim()">
            发布评论
          </button>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <p v-if="noticeMessage" class="comment-state comment-notice">{{ noticeMessage }}</p>
    <p v-if="errorMessage" class="comment-state">{{ errorMessage }}</p>
    <p v-else-if="isLoading" class="comment-state">评论加载中...</p>
    <p v-else-if="comments.length === 0" class="comment-state">还没有评论，来做第一个留言的人吧。</p>
    <div v-else class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- Main Comment -->
        <div class="comment-main">
          <span
            class="comment-avatar avatar-sprite"
            :style="getAvatarStyle(comment.author || comment.id)"
            role="img"
            :aria-label="comment.author"
          ></span>
          <div class="comment-content-wrapper">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time || comment.createTime }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <button
                @click="toggleLike(comment)"
                class="action-btn group"
                :class="{ 'is-liked': isCommentLiked(comment) }"
              >
                <Heart
                  class="w-4 h-4"
                  :class="{ 'fill-rose-500 text-rose-500': isCommentLiked(comment) }"
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
            <span
              v-if="reply.author === 'QianShiBlog'"
              class="reply-avatar avatar-sprite"
              :style="{ '--avatar-y': '-160px' }"
              role="img"
              aria-label="Author"
            ></span>
            <span
              v-else
              class="reply-avatar avatar-sprite"
              :style="getAvatarStyle(reply.author || reply.id, 1, 32)"
              role="img"
              aria-label="Visitor"
            ></span>
            <div class="reply-content-wrapper">
              <div class="comment-header">
                <div class="flex items-center gap-2">
                  <span class="comment-author">{{ reply.author }}</span>
                  <span v-if="reply.author === 'QianShiBlog'" class="author-badge">作者</span>
                </div>
                <span class="comment-time">{{ reply.time || reply.createTime }}</span>
              </div>
              <p class="comment-text">
                <span v-if="reply.replyTo" class="reply-target">@{{ reply.replyTo }} </span>{{ reply.content }}
              </p>
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
                <button @click="activeReplyId = null" class="cancel-btn interactive-lift text-xs transition-colors">
                  取消
                </button>
                <button
                  @click="submitReply(comment.id)"
                  class="submit-btn interactive-lift"
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

.comment-state {
  @apply text-sm py-6;
  color: var(--color-text);
}

.comment-notice {
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  color: var(--color-primary);
  background: rgba(244, 63, 94, 0.08);
}

.comment-item {
  @apply flex flex-col gap-4 rounded-2xl p-3;
  position: relative;
  overflow: hidden;
}

.comment-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: rgba(244, 63, 94, 0.035);
  transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.comment-item > * {
  position: relative;
  z-index: 1;
}

.comment-item:hover::before {
  opacity: 1;
}

:global(html.dark .comment-item::before){
  background-color: rgba(244, 63, 94, 0.08);
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
  @apply w-10 h-10 rounded-full shrink-0;
}

.avatar-sprite {
  background-image: url('/images/comment-cat-avatars.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 0 var(--avatar-y);
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

.reply-target {
  color: var(--color-primary);
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

@media (max-width: 767px) {
  .comments-section {
    margin-top: 2rem;
    padding-top: 2rem;
  }

  .comment-input-wrapper {
    gap: 0.75rem;
  }

  .input-container {
    padding: 0.875rem;
    border-radius: 1rem;
  }

  .visitor-info {
    min-height: 44px;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .visitor-info .visitor-name-input {
    min-height: 44px;
  }

  .comment-textarea {
    min-height: 5.5rem;
    padding-block: 0.5rem;
  }

  .input-actions .submit-btn,
  .input-container.reply-container .submit-btn {
    min-height: 44px;
    padding: 0.625rem 1.125rem;
    font-size: 0.875rem;
  }

  .cancel-btn {
    min-height: 44px;
    padding-inline: 0.75rem;
  }

  .comment-main,
  .reply-item {
    gap: 0.75rem;
  }

  .replies-wrapper {
    padding-left: 1rem;
  }

  .replies-wrapper::before {
    left: 0.25rem;
  }

  .comment-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.2rem;
  }

  .comment-actions {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .comment-actions .action-btn {
    min-height: 44px;
    padding: 0.5rem 0.625rem;
    border-radius: 9999px;
  }
}
</style>
