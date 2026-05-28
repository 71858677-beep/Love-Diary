<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFragmentsStore } from '@/stores/fragments'
import { useIdentityStore } from '@/stores/identity'
import { generateId, formatDate } from '@/utils/date'
import DiaryCard from '@/components/ui/DiaryCard.vue'
import DiaryButton from '@/components/ui/DiaryButton.vue'
import DiaryInput from '@/components/ui/DiaryInput.vue'
import EmptyState from '@/components/features/EmptyState.vue'
import WeatherPicker from '@/components/features/WeatherPicker.vue'
import ImageUploader from '@/components/features/ImageUploader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Fragment } from '@/types'

const fragmentsStore = useFragmentsStore()
const identity = useIdentityStore()
const showForm = ref(false)
const editId = ref<string | null>(null)
const detailId = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)

const detailFragment = computed(() =>
  detailId.value ? fragmentsStore.items.find((f) => f.id === detailId.value) ?? null : null
)

// Form state
const formText = ref('')
const formWeather = ref('sunny')
const formImages = ref<string[]>([])

function openCreate() {
  editId.value = null
  resetForm()
  showForm.value = true
}

function openEdit(fragment: Fragment) {
  editId.value = fragment.id
  formText.value = fragment.text
  formWeather.value = fragment.weather
  formImages.value = [...fragment.images]
  detailId.value = null
  showForm.value = true
}

function toggleForm() {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

function resetForm() {
  formText.value = ''
  formWeather.value = 'sunny'
  formImages.value = []
  editId.value = null
}

function submit() {
  if (!formText.value.trim()) return
  if (editId.value) {
    fragmentsStore.updateFragment(editId.value, {
      text: formText.value.trim(),
      weather: formWeather.value as Fragment['weather'],
      images: [...formImages.value],
    }, identity.current)
  } else {
    fragmentsStore.addFragment({
      id: generateId(),
      createdAt: new Date().toISOString(),
      text: formText.value.trim(),
      weather: formWeather.value as Fragment['weather'],
      images: [...formImages.value],
    }, identity.current)
  }
  resetForm()
  showForm.value = false
}

function deleteFragment(id: string) {
  confirmDeleteId.value = id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    fragmentsStore.removeFragment(confirmDeleteId.value)
    detailId.value = null
    confirmDeleteId.value = null
  }
}

function openDetail(fragment: Fragment) {
  detailId.value = fragment.id
}

function closeDetail() {
  detailId.value = null
}

const WEATHER_MAP: Record<string, string> = {
  sunny: '☀️', cloudy: '🌤️', overcast: '⛅', rainy: '🌧️',
  stormy: '⛈️', snowy: '❄️', rainbow: '🌈',
}
</script>

<template>
  <div class="px-5 pt-8 pb-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl text-warm-800">生活碎片 ✨</h1>
      <DiaryButton variant="ghost" @click="openCreate">+ 碎片</DiaryButton>
    </div>

    <EmptyState
      v-if="fragmentsStore.items.length === 0"
      emoji="📸"
      title="还没有记录"
      description="记录我们的每一个温暖瞬间"
    />

    <!-- Timeline -->
    <div v-else class="space-y-4">
      <div
        v-for="(fragment, idx) in fragmentsStore.items"
        :key="fragment.id"
        class="relative pl-8"
        style="animation: card-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
        :style="{ animationDelay: `${idx * 50}ms` }"
      >
        <div
          class="absolute left-[11px] top-4 bottom-0 w-0.5"
          :class="idx === fragmentsStore.items.length - 1 ? 'bg-transparent' : 'bg-warm-200'"
        />
        <div class="absolute left-[3px] top-4 w-[18px] h-[18px] rounded-full border-2 border-sunshine-400 bg-white flex items-center justify-center z-10">
          <div class="w-2 h-2 rounded-full bg-sunshine-400" />
        </div>

        <p class="text-xs text-warm-400 mb-2 font-medium">
          {{ formatDate(fragment.createdAt) }}
          <span class="ml-1">{{ WEATHER_MAP[fragment.weather] || '🌈' }}</span>
        </p>

        <div @click="openDetail(fragment)" class="cursor-pointer">
          <DiaryCard clickable>
            <p class="text-sm text-warm-700 line-clamp-3">{{ fragment.text }}</p>
            <div v-if="fragment.images.length" class="flex gap-1.5 mt-3">
              <img v-for="(img, i) in fragment.images.slice(0, 4)" :key="i" :src="img"
                class="w-16 h-16 rounded-lg object-cover border border-warm-100" />
              <span v-if="fragment.images.length > 4"
                class="w-16 h-16 rounded-lg bg-warm-100 flex items-center justify-center text-xs text-warm-500">
                +{{ fragment.images.length - 4 }}
              </span>
            </div>
            <div v-if="fragment.video" class="flex items-center gap-1 mt-2 text-xs text-warm-400">🎬 包含视频</div>
          </DiaryCard>
        </div>
      </div>
    </div>

    <!-- ============== Detail + Edit/Delete Modal ============== -->
    <Teleport to="body">
      <div v-if="detailFragment" class="love-modal-overlay" @click.self="closeDetail">
        <div class="love-modal-content">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs text-warm-400">{{ formatDate(detailFragment.createdAt) }}</span>
            <div class="flex items-center gap-2">
              <button class="text-xs text-warm-400 hover:text-sunshine-500 px-1" @click="openEdit(detailFragment)">✏️</button>
              <button class="text-xs text-warm-400 hover:text-red-400 px-1" @click="deleteFragment(detailFragment.id)">🗑️</button>
              <button class="text-warm-400 hover:text-warm-600 text-lg px-1" @click="closeDetail">✕</button>
            </div>
          </div>

          <p class="text-warm-700 leading-relaxed whitespace-pre-wrap">{{ detailFragment.text }}</p>

          <div v-if="detailFragment.images.length" class="mt-4 grid grid-cols-2 gap-2">
            <img v-for="(img, i) in detailFragment.images" :key="i" :src="img"
              class="w-full rounded-lg object-cover border border-warm-100" />
          </div>

          <video v-if="detailFragment.video" :src="detailFragment.video" controls class="w-full rounded-lg mt-4" />
        </div>
      </div>
    </Teleport>

    <!-- ============== Create / Edit Form Modal ============== -->
    <Teleport to="body">
      <div v-if="showForm" class="love-modal-overlay" @click.self="toggleForm">
        <div class="love-modal-content">
          <h2 class="font-display text-lg text-warm-800 mb-4">{{ editId ? '编辑碎片' : '记录此刻' }} ✍️</h2>

          <DiaryInput v-model="formText" type="textarea" placeholder="今天发生了什么..." :maxlength="500" />
          <div class="mt-4">
            <p class="text-xs text-warm-400 mb-2">天气</p>
            <WeatherPicker v-model="formWeather" />
          </div>
          <div class="mt-4">
            <p class="text-xs text-warm-400 mb-2">照片（最多 9 张）</p>
            <ImageUploader v-model:images="formImages" :max="9" />
          </div>

          <div class="mt-6 flex gap-3">
            <DiaryButton variant="secondary" class="flex-1" @click="toggleForm">取消</DiaryButton>
            <DiaryButton variant="primary" class="flex-1" :disabled="!formText.trim()" @click="submit">
              {{ editId ? '保存' : '发布 💕' }}
            </DiaryButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="confirmDeleteId !== null"
      title="删除碎片"
      message="确定要删除这条碎片吗？删除后不可恢复。"
      confirm-text="删除"
      cancel-text="保留"
      @confirm="confirmDelete"
      @cancel="confirmDeleteId = null"
    />
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
