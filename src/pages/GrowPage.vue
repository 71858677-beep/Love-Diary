<script setup lang="ts">
import { ref } from 'vue'
import { useGrowStore } from '@/stores/grow'
import { useIdentityStore } from '@/stores/identity'
import { generateId } from '@/utils/date'
import DiaryCard from '@/components/ui/DiaryCard.vue'
import DiaryButton from '@/components/ui/DiaryButton.vue'
import DiaryInput from '@/components/ui/DiaryInput.vue'
import DiaryBadge from '@/components/ui/DiaryBadge.vue'
import EmptyState from '@/components/features/EmptyState.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const growStore = useGrowStore()
const identity = useIdentityStore()
const confirmDeleteId = ref<string | null>(null)

const showForm = ref(false)
const editId = ref<string | null>(null)
const formName = ref('')
const formIcon = ref('🌟')

const COMMON_ICONS = ['🌟', '💪', '📚', '🏃', '🎨', '🎵', '🧘', '💧', '🍎', '✍️', '🧹', '🌿']

const savingMe = ref<Record<string, boolean>>({})
const savingHer = ref<Record<string, boolean>>({})

function openCreate() {
  editId.value = null
  formName.value = ''
  formIcon.value = '🌟'
  showForm.value = true
}

function openEdit(habit: { id: string; name: string; icon: string }) {
  editId.value = habit.id
  formName.value = habit.name
  formIcon.value = habit.icon
  showForm.value = true
}

function submit() {
  if (!formName.value.trim()) return
  if (editId.value) {
    growStore.updateHabit(editId.value, { name: formName.value.trim(), icon: formIcon.value }, identity.current)
  } else {
    growStore.addHabit({
      id: generateId(),
      name: formName.value.trim(),
      icon: formIcon.value,
      streakMe: 0,
      streakHer: 0,
      history: {},
    }, identity.current)
  }
  showForm.value = false
}

function deleteHabit(id: string) {
  confirmDeleteId.value = id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    growStore.removeHabit(confirmDeleteId.value)
    confirmDeleteId.value = null
  }
}

async function checkInMe(habitId: string) {
  savingMe.value[habitId] = true
  growStore.checkInMe(habitId, identity.current)
  await new Promise((r) => setTimeout(r, 300))
  savingMe.value[habitId] = false
}

async function checkInHer(habitId: string) {
  savingHer.value[habitId] = true
  growStore.checkInHer(habitId, identity.current)
  await new Promise((r) => setTimeout(r, 300))
  savingHer.value[habitId] = false
}
</script>

<template>
  <div class="px-5 pt-8 pb-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl text-warm-800">自我提升 🌱</h1>
      <DiaryButton variant="ghost" @click="openCreate">+ 习惯</DiaryButton>
    </div>

    <!-- Add / Edit Form -->
    <div v-if="showForm" class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 mb-4 space-y-3"
      style="animation: card-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1)">
      <DiaryInput v-model="formName" placeholder="习惯名称..." :maxlength="20" />
      <div>
        <p class="text-xs text-warm-400 mb-2">选择图标</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="icon in COMMON_ICONS" :key="icon"
            class="w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-all"
            :class="formIcon === icon ? 'border-sunshine-400 bg-sunshine-100' : 'border-warm-200 hover:border-warm-300'"
            @click="formIcon = icon">
            {{ icon }}
          </button>
        </div>
      </div>
      <div class="flex gap-3">
        <DiaryButton variant="secondary" class="flex-1" @click="showForm = false">取消</DiaryButton>
        <DiaryButton variant="primary" class="flex-1" :disabled="!formName.trim()" @click="submit">
          {{ editId ? '保存' : '添加习惯' }}
        </DiaryButton>
      </div>
    </div>

    <EmptyState
      v-if="growStore.loaded && growStore.habits.length === 0 && !showForm"
      emoji="🌟" title="还没有习惯" description="一起养成好习惯吧！"
    />

    <!-- Habit Cards -->
    <div class="space-y-3">
      <DiaryCard v-for="habit in growStore.habits" :key="habit.id" class="animate-card-enter">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ habit.icon }}</span>
            <span class="font-semibold text-warm-700 text-sm">{{ habit.name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="text-xs text-warm-400 hover:text-sunshine-500 p-1" @click="openEdit(habit)">✏️</button>
            <button class="text-xs text-warm-400 hover:text-red-400 p-1" @click="deleteHabit(habit.id)">🗑️</button>
          </div>
        </div>

        <div class="flex gap-3 mb-4">
          <DiaryBadge variant="sunshine">小鸡毛：连续 {{ habit.streakMe }} 天 🔥</DiaryBadge>
          <DiaryBadge variant="rose">小白：连续 {{ habit.streakHer }} 天 🔥</DiaryBadge>
        </div>

        <div class="flex gap-3">
          <DiaryButton variant="primary" class="flex-1 text-xs" :loading="savingMe[habit.id]" @click="checkInMe(habit.id)">
            {{ savingMe[habit.id] ? '✅' : '小鸡毛打卡' }}
          </DiaryButton>
          <DiaryButton variant="secondary" class="flex-1 text-xs" :loading="savingHer[habit.id]" @click="checkInHer(habit.id)">
            {{ savingHer[habit.id] ? '✅' : '小白打卡' }}
          </DiaryButton>
        </div>
      </DiaryCard>
    </div>

    <ConfirmDialog
      :show="confirmDeleteId !== null"
      title="删除习惯"
      message="确定要删除这个习惯吗？打卡记录也会丢失。"
      confirm-text="删除"
      cancel-text="保留"
      @confirm="confirmDelete"
      @cancel="confirmDeleteId = null"
    />
  </div>
</template>
