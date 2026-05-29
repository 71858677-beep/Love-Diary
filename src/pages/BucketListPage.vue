<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBucketListStore } from '@/stores/bucketlist'
import { useIdentityStore } from '@/stores/identity'
import { generateId } from '@/utils/date'
import DiaryButton from '@/components/ui/DiaryButton.vue'
import DiaryInput from '@/components/ui/DiaryInput.vue'
import DiaryCard from '@/components/ui/DiaryCard.vue'
import EmptyState from '@/components/features/EmptyState.vue'
import ImageUploader from '@/components/features/ImageUploader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingDots from '@/components/ui/LoadingDots.vue'

const bucketStore = useBucketListStore()
const identity = useIdentityStore()
const confirmDeleteId = ref<string | null>(null)
const confirmUncompleteId = ref<string | null>(null)

const completedCount = computed(() => bucketStore.items.filter((i) => i.completed).length)
const totalCount = computed(() => bucketStore.items.length)

const sortedItems = computed(() => {
  const uncompleted = bucketStore.items.filter((i) => !i.completed)
  const completed = bucketStore.items.filter((i) => i.completed)
  return [...uncompleted, ...completed]
})

const showAdd = ref(false)
const editId = ref<string | null>(null)
const formTitle = ref('')

const expandedId = ref<string | null>(null)
const completePhotos = ref<string[]>([])
const completeNote = ref('')

function openCreate() {
  editId.value = null
  formTitle.value = ''
  showAdd.value = true
}

function openEdit(item: { id: string; title: string }) {
  editId.value = item.id
  formTitle.value = item.title
  showAdd.value = true
}

function submit() {
  if (!formTitle.value.trim()) return
  if (editId.value) {
    bucketStore.updateItem(editId.value, { title: formTitle.value.trim() }, identity.current)
  } else {
    bucketStore.addItem({
      id: generateId(),
      title: formTitle.value.trim(),
      completed: false,
      photos: [],
    }, identity.current)
  }
  formTitle.value = ''
  editId.value = null
  showAdd.value = false
}

function deleteItem(id: string) {
  confirmDeleteId.value = id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    bucketStore.removeItem(confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}

function toggleComplete(id: string) {
  const item = bucketStore.items.find((i) => i.id === id)
  if (!item) return
  if (item.completed) {
    confirmUncompleteId.value = id
  } else {
    expandedId.value = id
    completePhotos.value = []
    completeNote.value = ''
  }
}

function confirmUncomplete() {
  if (confirmUncompleteId.value) {
    bucketStore.uncompleteItem(confirmUncompleteId.value, identity.current)
    expandedId.value = null
    confirmUncompleteId.value = null
  }
}

function confirmComplete(id: string) {
  bucketStore.completeItem(id, identity.current, {
    photos: [...completePhotos.value],
    note: completeNote.value.trim() || undefined,
  })
  expandedId.value = null
}

function cancelComplete() {
  expandedId.value = null
}
</script>

<template>
  <div class="px-5 pt-8 pb-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl text-warm-800">心愿清单 💝</h1>
      <DiaryButton variant="ghost" @click="openCreate">+ 心愿</DiaryButton>
    </div>

    <LoadingDots v-if="!bucketStore.loaded" />

    <!-- Add / Edit Form -->
    <div v-if="showAdd"
      class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 mb-4 space-y-3"
      style="animation: card-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1)">
      <DiaryInput v-model="formTitle" placeholder="想一起做的事..." :maxlength="50" @keyup.enter="submit" />
      <div class="flex gap-3">
        <DiaryButton variant="secondary" class="flex-1" @click="showAdd = false">取消</DiaryButton>
        <DiaryButton variant="primary" class="flex-1" :disabled="!formTitle.trim()" @click="submit">
          {{ editId ? '保存' : '添加' }}
        </DiaryButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-warm-500">要一起做的 100 件事</span>
        <span class="text-lg font-display font-bold text-sunshine-400">
          {{ completedCount }} / 100
        </span>
      </div>
      <div class="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
        <div class="h-full bg-sunshine-400 rounded-full transition-all duration-500"
          :style="{ width: `${completedCount}%` }" />
      </div>
    </div>

    <EmptyState
      v-if="bucketStore.loaded && bucketStore.items.length === 0 && !showAdd"
      emoji="📝" title="心愿清单还是空的" description="开始添加你们想要一起完成的事吧"
    />

    <div v-else>
      <TransitionGroup name="bucket-sort" tag="div" class="space-y-3">
      <div v-for="item in sortedItems" :key="item.id" class="animate-card-enter">
        <DiaryCard :completed="item.completed"
          :class="item.completed ? 'bg-sunshine-100 border-sunshine-300' : ''">
          <div class="flex items-center gap-3">
            <button
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 transition-all active:scale-90"
              :class="item.completed
                ? 'bg-sunshine-400 border-sunshine-400 text-white'
                : 'border-warm-300 text-transparent hover:border-sunshine-400'"
              @click.stop="toggleComplete(item.id)">
              ✓
            </button>

            <div class="flex-1 min-w-0">
              <span class="font-body text-sm"
                :class="item.completed ? 'text-warm-500 line-through' : 'text-warm-700'">
                {{ item.title }}
              </span>
              <p v-if="item.completedAt" class="text-[10px] text-warm-400 mt-0.5">
                完成于 {{ item.completedAt.slice(0, 10) }}
              </p>
            </div>

            <div class="flex items-center gap-1 flex-shrink-0">
              <button class="text-xs text-warm-400 hover:text-sunshine-500 p-1"
                @click.stop="openEdit(item)">✏️</button>
              <button class="text-xs text-warm-400 hover:text-red-400 p-1"
                @click.stop="deleteItem(item.id)">🗑️</button>
            </div>
          </div>

          <!-- Expand completion form -->
          <div v-if="expandedId === item.id" class="mt-4 pt-4 border-t border-warm-200 space-y-4" @click.stop>
            <p class="text-sm font-medium text-warm-600">记录这个特别的时刻 🎉</p>
            <div>
              <p class="text-xs text-warm-400 mb-2">打卡合照（可选）</p>
              <ImageUploader v-model:images="completePhotos" :max="6" />
            </div>
            <DiaryInput v-model="completeNote" type="textarea" placeholder="完成感想..." :maxlength="300" />
            <div class="flex gap-3">
              <DiaryButton variant="secondary" class="flex-1" @click="cancelComplete">先不标记</DiaryButton>
              <DiaryButton variant="primary" class="flex-1" @click="confirmComplete(item.id)">标记完成 💕</DiaryButton>
            </div>
          </div>
        </DiaryCard>
      </div>
      </TransitionGroup>
    </div>

    <ConfirmDialog
      :show="confirmDeleteId !== null"
      title="删除心愿"
      message="确定要删除这个心愿吗？"
      confirm-text="删除"
      cancel-text="保留"
      @confirm="confirmDelete"
      @cancel="confirmDeleteId = null"
    />

    <ConfirmDialog
      :show="confirmUncompleteId !== null"
      title="取消标记"
      message="确定要取消完成标记吗？已添加的照片和感想也会被清除。"
      confirm-text="取消标记"
      cancel-text="保留"
      @confirm="confirmUncomplete"
      @cancel="confirmUncompleteId = null"
    />
  </div>
</template>

<style scoped>
.bucket-sort-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
