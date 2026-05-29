<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFootprintsStore } from '@/stores/footprints'
import { useIdentityStore } from '@/stores/identity'
import { generateId, formatDateFull } from '@/utils/date'
import DiaryButton from '@/components/ui/DiaryButton.vue'
import DiaryInput from '@/components/ui/DiaryInput.vue'
import EmptyState from '@/components/features/EmptyState.vue'
import ImageUploader from '@/components/features/ImageUploader.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const footprintsStore = useFootprintsStore()
const identity = useIdentityStore()
const showForm = ref(false)
const editId = ref<string | null>(null)
const detailId = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)

const detailFp = computed(() =>
  detailId.value ? footprintsStore.items.find((f) => f.id === detailId.value) ?? null : null
)

const formDest = ref('')
const formStartDate = ref('')
const formEndDate = ref('')
const formPhotos = ref<string[]>([])
const formNotes = ref('')

function openCreate() {
  editId.value = null
  resetForm()
  showForm.value = true
}

function openEdit(fp: { id: string; destination: string; dateRange: [string, string]; photos: string[]; notes: string }) {
  editId.value = fp.id
  formDest.value = fp.destination
  formStartDate.value = fp.dateRange[0]
  formEndDate.value = fp.dateRange[1] !== fp.dateRange[0] ? fp.dateRange[1] : ''
  formPhotos.value = [...fp.photos]
  formNotes.value = fp.notes
  showForm.value = true
}

function toggleForm() {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

function resetForm() {
  formDest.value = ''
  formStartDate.value = ''
  formEndDate.value = ''
  formPhotos.value = []
  formNotes.value = ''
  editId.value = null
}

function submit() {
  if (!formDest.value.trim() || !formStartDate.value) return
  const data = {
    destination: formDest.value.trim(),
    dateRange: [formStartDate.value, formEndDate.value || formStartDate.value] as [string, string],
    photos: [...formPhotos.value],
    notes: formNotes.value.trim(),
  }
  if (editId.value) {
    footprintsStore.updateFootprint(editId.value, data, identity.current)
  } else {
    footprintsStore.addFootprint({ id: generateId(), ...data }, identity.current)
  }
  resetForm()
  showForm.value = false
}

function deleteFootprint(id: string) {
  confirmDeleteId.value = id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    footprintsStore.removeFootprint(confirmDeleteId.value)
    detailId.value = null
    confirmDeleteId.value = null
  }
}
</script>

<template>
  <div class="px-5 pt-8 pb-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl text-warm-800">旅行足迹 ✈️</h1>
      <DiaryButton variant="ghost" @click="openCreate">+ 足迹</DiaryButton>
    </div>

    <EmptyState
      v-if="footprintsStore.loaded && footprintsStore.items.length === 0"
      emoji="🗺️" title="还没有旅行记录" description="记录我们一起走过的每一步"
    />

    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="(fp, idx) in footprintsStore.items" :key="fp.id"
        style="animation: card-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
        :style="{ animationDelay: `${idx * 60}ms` }">
        <div @click="detailId = fp.id"
          class="bg-white p-3 pb-4 shadow-diary-md rotate-[0.5deg] hover:rotate-0 hover:shadow-diary-lg transition-all duration-300 cursor-pointer">
          <div class="aspect-square bg-warm-100 rounded-sm overflow-hidden border border-warm-200">
            <img v-if="fp.photos.length" :src="fp.photos[0]" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">📍</div>
          </div>
          <p class="mt-2 font-hand text-lg text-warm-700 text-center leading-tight">{{ fp.destination }}</p>
          <p class="text-[10px] text-warm-400 text-center mt-0.5">{{ formatDateFull(fp.dateRange[0]) }}</p>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="detailFp" class="love-modal-overlay" @click.self="detailId = null">
        <div class="love-modal-content">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-display text-xl text-warm-800">{{ detailFp.destination }}</h2>
            <div class="flex items-center gap-2">
              <button class="text-xs text-warm-400 hover:text-sunshine-500 px-1" @click="openEdit(detailFp); detailId = null">✏️</button>
              <button class="text-xs text-warm-400 hover:text-red-400 px-1" @click="deleteFootprint(detailFp.id)">🗑️</button>
              <button class="text-warm-400 hover:text-warm-600 text-lg px-1" @click="detailId = null">✕</button>
            </div>
          </div>

          <p class="text-sm text-warm-500 mb-4">
            {{ formatDateFull(detailFp.dateRange[0]) }}
            <template v-if="detailFp.dateRange[1] !== detailFp.dateRange[0]"> — {{ formatDateFull(detailFp.dateRange[1]) }}</template>
          </p>

          <div v-if="detailFp.photos.length" class="grid grid-cols-3 gap-2 mb-4">
            <img v-for="(img, i) in detailFp.photos" :key="i" :src="img"
              class="aspect-square rounded-lg object-cover border border-warm-100" />
          </div>

          <video v-if="detailFp.vlog" :src="detailFp.vlog" controls class="w-full rounded-lg mb-4" />
          <p v-if="detailFp.notes" class="font-hand text-lg text-warm-600 leading-relaxed">{{ detailFp.notes }}</p>

          <DiaryButton variant="secondary" class="w-full mt-4" @click="detailId = null">关闭</DiaryButton>
        </div>
      </div>
    </Teleport>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="love-modal-overlay" @click.self="toggleForm">
        <div class="love-modal-content">
          <h2 class="font-display text-lg text-warm-800 mb-4">{{ editId ? '编辑足迹' : '记录旅行' }} 🗺️</h2>

          <div class="space-y-4">
            <DiaryInput v-model="formDest" placeholder="目的地名称..." :maxlength="30" />

            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-warm-400 mb-1">开始日期</p>
                <input v-model="formStartDate" type="date"
                  class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
              </div>
              <div>
                <p class="text-xs text-warm-400 mb-1">结束日期</p>
                <input v-model="formEndDate" type="date"
                  class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
              </div>
            </div>

            <div>
              <p class="text-xs text-warm-400 mb-2">照片</p>
              <ImageUploader v-model:images="formPhotos" :max="9" />
            </div>

            <DiaryInput v-model="formNotes" type="textarea" placeholder="旅行备注..." :maxlength="300" />
          </div>

          <div class="mt-6 flex gap-3">
            <DiaryButton variant="secondary" class="flex-1" @click="toggleForm">取消</DiaryButton>
            <DiaryButton variant="primary" class="flex-1" :disabled="!formDest.trim() || !formStartDate" @click="submit">
              {{ editId ? '保存' : '保存 💾' }}
            </DiaryButton>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDialog
      :show="confirmDeleteId !== null"
      title="删除足迹"
      message="确定要删除这条旅行记录吗？"
      confirm-text="删除"
      cancel-text="保留"
      @confirm="confirmDelete"
      @cancel="confirmDeleteId = null"
    />
  </div>
</template>
