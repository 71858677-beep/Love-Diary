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
const completeDate = ref('')
const viewCompletedId = ref<string | null>(null)
const editCompleted = ref(false)
const editCompletedTitle = ref('')
const editCompletedPhotos = ref<string[]>([])
const editCompletedNote = ref('')
const editCompletedDate = ref('')
const fullscreenPhotos = ref<string[]>([])
const fullscreenIndex = ref(0)

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
    completeDate.value = new Date().toISOString().slice(0, 10)
  }
}

function openViewCompleted(id: string) {
  const item = bucketStore.items.find((i) => i.id === id)
  if (!item) return
  viewCompletedId.value = id
  editCompleted.value = false
}

function startEditCompleted(id: string) {
  const item = bucketStore.items.find((i) => i.id === id)
  if (!item) return
  editCompleted.value = true
  editCompletedTitle.value = item.title
  editCompletedPhotos.value = [...(item.photos || [])]
  editCompletedNote.value = item.note || ''
  editCompletedDate.value = item.completedAt?.slice(0, 10) || ''
}

function saveEditCompleted(id: string) {
  if (!editCompletedTitle.value.trim()) return
  const item = bucketStore.items.find((i) => i.id === id)
  if (!item) return
  item.title = editCompletedTitle.value.trim()
  item.photos = [...editCompletedPhotos.value]
  item.note = editCompletedNote.value.trim() || undefined
  if (editCompletedDate.value) {
    item.completedAt = new Date(editCompletedDate.value + 'T00:00:00').toISOString()
  }
  editCompleted.value = false
}

function openFullscreen(photos: string[], index: number) {
  fullscreenPhotos.value = photos
  fullscreenIndex.value = index
}

function prevImage() {
  if (fullscreenIndex.value > 0) fullscreenIndex.value--
}

function nextImage() {
  if (fullscreenIndex.value < fullscreenPhotos.value.length - 1) fullscreenIndex.value++
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
    completedAt: completeDate.value
      ? new Date(completeDate.value + 'T00:00:00').toISOString()
      : new Date().toISOString(),
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
      <DiaryInput v-model="formTitle" placeholder="想一起做的事..." @keyup.enter="submit" />
      <div class="flex gap-3">
        <DiaryButton variant="secondary" class="flex-1" @click="showAdd = false">取消</DiaryButton>
        <DiaryButton variant="primary" class="flex-1" :disabled="!formTitle.trim()" @click="submit">
          {{ editId ? '保存' : '添加' }}
        </DiaryButton>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="bucketStore.loaded" class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 mb-6">
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

            <div class="flex-1 min-w-0"
              :class="item.completed ? 'cursor-pointer' : ''"
              @click.stop="item.completed ? openViewCompleted(item.id) : null">
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
            <div>
              <p class="text-xs text-warm-400 mb-1">完成日期</p>
              <input v-model="completeDate" type="date"
                class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
            </div>
            <DiaryInput v-model="completeNote" type="textarea" placeholder="完成感想..." />
            <div class="flex gap-3">
              <DiaryButton variant="secondary" class="flex-1" @click="cancelComplete">先不标记</DiaryButton>
              <DiaryButton variant="primary" class="flex-1" @click="confirmComplete(item.id)">标记完成 💕</DiaryButton>
            </div>
          </div>
        </DiaryCard>
      </div>
      </TransitionGroup>
    </div>

    <!-- View Completed Modal -->
    <Teleport to="body">
      <div v-if="viewCompletedId" class="love-modal-overlay" @click.self="viewCompletedId = null">
        <div class="love-modal-content">
          <div class="flex items-center justify-between mb-4">
            <h3 v-if="!editCompleted" class="font-display text-lg text-warm-800">
              {{ bucketStore.items.find(i => i.id === viewCompletedId)?.title }}
            </h3>
            <div class="flex items-center gap-2">
              <button v-if="!editCompleted" class="text-xs text-warm-400 hover:text-sunshine-500 px-1"
                @click="startEditCompleted(viewCompletedId!)">✏️ 编辑</button>
              <button class="text-warm-400 hover:text-warm-600 text-lg px-1" @click="viewCompletedId = null">✕</button>
            </div>
          </div>

          <template v-if="editCompleted">
            <div class="space-y-3">
              <DiaryInput v-model="editCompletedTitle" placeholder="心愿标题..." />
              <div>
                <p class="text-xs text-warm-400 mb-2">照片</p>
                <ImageUploader v-model:images="editCompletedPhotos" :max="6" />
              </div>
              <div>
                <p class="text-xs text-warm-400 mb-1">完成日期</p>
                <input v-model="editCompletedDate" type="date"
                  class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
              </div>
              <DiaryInput v-model="editCompletedNote" type="textarea" placeholder="完成感想..." />
              <div class="flex gap-3">
                <DiaryButton variant="secondary" class="flex-1" @click="editCompleted = false">取消</DiaryButton>
                <DiaryButton variant="primary" class="flex-1" :disabled="!editCompletedTitle.trim()" @click="saveEditCompleted(viewCompletedId!)">保存</DiaryButton>
              </div>
            </div>
          </template>

          <template v-else>
            <p class="text-xs text-warm-400 mb-4">
              完成于 {{ bucketStore.items.find(i => i.id === viewCompletedId)?.completedAt?.slice(0, 10) || '' }}
            </p>

            <div v-if="bucketStore.items.find(i => i.id === viewCompletedId)?.photos?.length" class="grid grid-cols-2 gap-2 mb-4">
              <img v-for="(img, idx) in (bucketStore.items.find(i => i.id === viewCompletedId)?.photos || [])" :key="idx"
                :src="img" class="w-full rounded-lg object-cover border border-warm-100 cursor-pointer hover:opacity-90 transition-opacity"
                @click.stop="openFullscreen(bucketStore.items.find(i => i.id === viewCompletedId)?.photos || [], idx)" />
            </div>

            <p v-if="bucketStore.items.find(i => i.id === viewCompletedId)?.note"
              class="text-warm-600 leading-relaxed text-sm mb-4">
              {{ bucketStore.items.find(i => i.id === viewCompletedId)?.note }}
            </p>

            <DiaryButton variant="secondary" class="w-full" @click="() => { const id = viewCompletedId; viewCompletedId = null; confirmUncompleteId = id; }">
              取消标记 🗑️
            </DiaryButton>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- Fullscreen Image -->
    <Teleport to="body">
      <div v-if="fullscreenPhotos.length" class="love-modal-overlay" style="z-index: 100; background: rgb(0 0 0 / 0.9);" @click="fullscreenPhotos = []">
        <button v-if="fullscreenIndex > 0"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors z-10"
          @click.stop="prevImage">‹</button>
        <img :src="fullscreenPhotos[fullscreenIndex]" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" @click.stop />
        <button v-if="fullscreenIndex < fullscreenPhotos.length - 1"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xl transition-colors z-10"
          @click.stop="nextImage">›</button>
        <button class="absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10" @click="fullscreenPhotos = []">✕</button>
        <span class="absolute bottom-4 text-white/60 text-xs">{{ fullscreenIndex + 1 }} / {{ fullscreenPhotos.length }}</span>
      </div>
    </Teleport>

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
