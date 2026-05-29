<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useCareStore } from '@/stores/care'
import { useLettersStore } from '@/stores/letters'
import { useIdentityStore } from '@/stores/identity'
import { useImageUpload } from '@/composables/useImageUpload'
import { useHaptic } from '@/composables/useHaptic'
import { generateId, formatDateFull } from '@/utils/date'
import HeartBurst from '@/components/features/HeartBurst.vue'
import EmptyState from '@/components/features/EmptyState.vue'
import DiaryButton from '@/components/ui/DiaryButton.vue'
import DiaryInput from '@/components/ui/DiaryInput.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import LoadingDots from '@/components/ui/LoadingDots.vue'
import type { LoveLetter } from '@/types'

const dashboardStore = useDashboardStore()
const careStore = useCareStore()
const lettersStore = useLettersStore()
const identity = useIdentityStore()
const { lightTap } = useHaptic()
const { compressImage, openFilePicker } = useImageUpload()

const heartBurst = ref<InstanceType<typeof HeartBurst> | null>(null)

// Auto-refresh day counter
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 60000) })
onUnmounted(() => { clearInterval(timer) })

const daysTogether = computed(() => {
  if (!dashboardStore.anniversaryDate) return null
  const start = new Date(dashboardStore.anniversaryDate)
  return Math.floor((now.value.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const showCareReminder = computed(() => careStore.isNearPredictedCycle())

// ── Anniversary Date Picker ──
const showDatePicker = ref(false)
const pickerYear = ref(2024)
const pickerMonth = ref(1)
const pickerDay = ref(1)

const yearOptions = computed(() => {
  const yr = new Date().getFullYear()
  return Array.from({ length: yr - 2014 }, (_, i) => 2015 + i)
})

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

const dayOptions = computed(() => {
  const days = new Date(pickerYear.value, pickerMonth.value, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

function openDatePicker(mode: 'set' | 'edit') {
  if (mode === 'edit' && dashboardStore.anniversaryDate) {
    const parts = dashboardStore.anniversaryDate.split('-')
    pickerYear.value = parseInt(parts[0])
    pickerMonth.value = parseInt(parts[1])
    pickerDay.value = parseInt(parts[2])
  } else {
    pickerYear.value = 2024
    pickerMonth.value = 1
    pickerDay.value = 1
  }
  showDatePicker.value = true
  scrollToSelected()
}

function scrollToSelected() {
  requestAnimationFrame(() => {
    const cols = document.querySelectorAll('.date-picker-column')
    cols.forEach((col) => {
      const selected = col.querySelector('.date-picker-item--selected')
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    })
  })
}

function confirmDate() {
  const y = pickerYear.value
  const m = String(pickerMonth.value).padStart(2, '0')
  const d = String(pickerDay.value).padStart(2, '0')
  dashboardStore.setAnniversary(`${y}-${m}-${d}`)
  showDatePicker.value = false
}

function onPickerScroll(col: string, event: Event) {
  const el = event.target as HTMLElement
  const items = el.querySelectorAll('.date-picker-item')
  const centerY = el.scrollTop + el.offsetHeight / 2
  let closest: Element | null = null
  let minDist = Infinity
  items.forEach((item) => {
    const rect = item.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const itemCenter = rect.top + rect.height / 2 - elRect.top + el.scrollTop
    const dist = Math.abs(itemCenter - centerY)
    if (dist < minDist) {
      minDist = dist
      closest = item
    }
  })
  if (closest) {
    const val = parseInt((closest as HTMLElement).dataset.val || '0')
    if (col === 'year') pickerYear.value = val
    else if (col === 'month') pickerMonth.value = val
    else if (col === 'day') pickerDay.value = val
  }
}

function onPickerWheel(_col: string, event: WheelEvent) {
  event.preventDefault()
  const el = event.currentTarget as HTMLElement
  const items = Array.from(el.querySelectorAll('.date-picker-item'))
  if (items.length === 0) return
  const centerY = el.scrollTop + el.offsetHeight / 2
  let currentIdx = 0
  let minDist = Infinity
  items.forEach((item, i) => {
    const rect = item.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const itemCenter = rect.top + rect.height / 2 - elRect.top + el.scrollTop
    const dist = Math.abs(itemCenter - centerY)
    if (dist < minDist) {
      minDist = dist
      currentIdx = i
    }
  })
  const nextIdx = event.deltaY > 0
    ? Math.min(currentIdx + 1, items.length - 1)
    : Math.max(currentIdx - 1, 0)
  if (nextIdx !== currentIdx) {
    items[nextIdx].scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

function updateMyStatus(status: string) {
  if (identity.current !== '小鸡毛') return
  dashboardStore.updateUserStatus(status)
  lightTap()
}

function updatePartnerStatus(status: string) {
  if (identity.current !== '小白') return
  dashboardStore.updatePartnerStatus(status)
  lightTap()
}

// ── Avatar upload ──
async function uploadUserAvatar() {
  if (identity.current !== '小鸡毛') return
  const file = await openFilePicker('image/*')
  if (!file) return
  const base64 = await compressImage(file, 400, 0.8)
  dashboardStore.setUserAvatar(base64)
}

async function uploadPartnerAvatar() {
  if (identity.current !== '小白') return
  const file = await openFilePicker('image/*')
  if (!file) return
  const base64 = await compressImage(file, 400, 0.8)
  dashboardStore.setPartnerAvatar(base64)
}

// ── Pat partner ──
function patHim(event: MouseEvent) {
  lightTap()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = rect.left + rect.width / 2
  heartBurst.value?.spawn(x, 5)
}

function patHer(event: MouseEvent) {
  lightTap()
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = rect.left + rect.width / 2
  heartBurst.value?.spawn(x, 5)
}

// ── Letters / Mailbox ──
const showLetterForm = ref(false)
const showLetterDetail = ref<LoveLetter | null>(null)
const confirmDeleteLetterId = ref<string | null>(null)
const letterFrom = ref<'小鸡毛' | '小白'>('小鸡毛')
const letterTitle = ref('')
const letterContent = ref('')
const letterUnlockDate = ref('')
const letterUnlockTime = ref('')

const unlockedLetters = computed(() =>
  lettersStore.letters.filter((l) => new Date(l.unlockAt) <= new Date())
)

const lockedLetters = computed(() =>
  lettersStore.letters.filter((l) => new Date(l.unlockAt) > new Date())
)

const unreadCount = computed(() =>
  unlockedLetters.value.filter((l) => !l.isRead).length
)

function openWriteLetter() {
  letterFrom.value = identity.current
  letterTitle.value = ''
  letterContent.value = ''
  letterUnlockDate.value = ''
  letterUnlockTime.value = ''
  showLetterForm.value = true
}

function submitLetter() {
  if (!letterTitle.value.trim() || !letterContent.value.trim() || !letterUnlockDate.value || !letterUnlockTime.value) return
  const unlockDateTime = `${letterUnlockDate.value}T${letterUnlockTime.value}:00`

  lettersStore.addLetter({
    id: generateId(),
    from: letterFrom.value,
    title: letterTitle.value.trim(),
    content: letterContent.value.trim(),
    createdAt: new Date().toISOString(),
    unlockAt: new Date(unlockDateTime).toISOString(),
    isRead: false,
  }, identity.current)
  showLetterForm.value = false
}

function openLetter(letter: LoveLetter) {
  if (new Date(letter.unlockAt) > new Date()) return
  if (!letter.isRead) {
    lettersStore.markRead(letter.id, identity.current)
  }
  showLetterDetail.value = letter
}

function deleteLetter(letter: LoveLetter) {
  if (letter.from !== identity.current) return
  confirmDeleteLetterId.value = letter.id
}

function confirmDeleteLetter() {
  if (confirmDeleteLetterId.value) {
    lettersStore.removeLetter(confirmDeleteLetterId.value)
    showLetterDetail.value = null
    confirmDeleteLetterId.value = null
  }
}

function formatUnlockTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  if (diff <= 0) return '已解锁'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} 天后解锁`
  if (hours > 0) return `${hours} 小时后解锁`
  const mins = Math.floor(diff / (1000 * 60))
  return `${mins} 分钟后解锁`
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}
</script>

<template>
  <div class="px-5 pt-8 pb-4 space-y-6">
    <!-- ========== App Title ========== -->
    <div class="text-center pb-2">
      <h1 class="font-display text-3xl font-bold text-warm-800 tracking-wide">恋爱日记</h1>
      <p class="text-xs text-warm-400 mt-1 font-hand text-lg">记录属于我们的每一天</p>
    </div>

    <!-- Identity Switcher -->
    <div class="flex items-center justify-center gap-3 py-1">
      <span class="text-xs text-warm-400">当前身份：</span>
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all"
        :class="identity.current === '小鸡毛'
          ? 'bg-sunshine-400 text-warm-800 shadow-sm'
          : 'bg-warm-100 text-warm-400 hover:bg-warm-200'"
        @click="identity.setIdentity('小鸡毛')"
      >
        🧑‍💻 小鸡毛
      </button>
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all"
        :class="identity.current === '小白'
          ? 'bg-sunshine-400 text-warm-800 shadow-sm'
          : 'bg-warm-100 text-warm-400 hover:bg-warm-200'"
        @click="identity.setIdentity('小白')"
      >
        💕 小白
      </button>
    </div>

    <template v-if="!dashboardStore.loaded">
      <LoadingDots />
    </template>

    <template v-else>
    <section class="text-center">
      <p class="text-sm text-warm-400 font-body">我们已经在一起</p>
      <div v-if="daysTogether !== null" class="mt-2 cursor-pointer" @click="openDatePicker('edit')">
        <span class="font-display text-5xl font-bold text-warm-800 animate-count-up">
          {{ daysTogether.toLocaleString() }}
        </span>
        <span class="font-body text-xl text-warm-600 ml-2">天</span>
      </div>
      <EmptyState
        v-else-if="dashboardStore.loaded"
        emoji="💝"
        title="设置我们的纪念日"
        description="记录属于我们的每一天"
      >
        <button
          class="mt-4 px-6 py-3 bg-sunshine-400 text-warm-800 font-semibold rounded-full shadow-diary-sm active:scale-95 transition-all"
          @click="openDatePicker('set')"
        >
          设置纪念日
        </button>
      </EmptyState>
      <p v-if="daysTogether !== null" class="text-sm text-rose-300 mt-2 font-hand text-lg">❤️</p>
    </section>

    <!-- ========== Care Reminder ========== -->
    <Transition name="reminder">
      <section
        v-if="showCareReminder"
        class="bg-rose-100 border border-rose-200 rounded-xl p-4 animate-soft-bounce-in"
      >
        <p class="text-sm text-warm-700 text-center leading-relaxed">
          🩰 小白这几天需要被特别照顾哦<br />准备红糖水和热牛奶吧！
        </p>
      </section>
    </Transition>

    <!-- ========== Dual Status Cards ========== -->
    <section class="grid grid-cols-2 gap-4">
      <!-- 小鸡毛 -->
      <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 text-center">
        <div class="relative inline-block">
          <button
            class="w-16 h-16 mx-auto rounded-full bg-sunshine-200 border-2 border-sunshine-300 flex items-center justify-center text-2xl overflow-hidden transition-all duration-150 hover:shadow-diary-md relative group cursor-pointer"
            title="点击更换头像"
            @click="uploadUserAvatar"
          >
            <img v-if="dashboardStore.userAvatar" :src="dashboardStore.userAvatar" class="w-full h-full object-cover" />
            <span v-else>🧑‍💻</span>
            <span class="absolute inset-0 bg-warm-800/40 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full">换头像</span>
          </button>
          <button
            class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-sunshine-300 border-2 border-white flex items-center justify-center text-xs transition-all duration-150 active:scale-90 hover:shadow-diary-md cursor-pointer"
            @click="patHim"
          >
            👋
          </button>
        </div>
        <p class="mt-2 font-semibold text-warm-800 text-sm">小鸡毛</p>
        <!-- Status: show all options when identity is 小鸡毛, else show only current -->
        <template v-if="identity.current === '小鸡毛'">
          <div class="mt-2 flex flex-wrap gap-1 justify-center">
            <button
              v-for="opt in dashboardStore.statusOptions"
              :key="opt.value"
              class="px-2.5 py-1 text-[11px] rounded-full border transition-all duration-150 active:scale-90"
              :class="dashboardStore.userStatus === opt.value
                ? 'bg-sunshine-200 border-sunshine-300 text-warm-700 font-medium'
                : 'bg-white border-warm-200 text-warm-400 hover:border-warm-300'"
              @click="updateMyStatus(opt.value)"
            >
              {{ opt.emoji }} {{ opt.label }}
            </button>
          </div>
        </template>
        <template v-else>
          <span class="inline-block mt-1 px-2.5 py-1 text-[11px] rounded-full bg-sunshine-100 text-warm-600 font-medium">
            {{ dashboardStore.statusOptions.find(o => o.value === dashboardStore.userStatus)?.emoji }} {{ dashboardStore.statusOptions.find(o => o.value === dashboardStore.userStatus)?.label }}
          </span>
        </template>
      </div>

      <!-- 小白 -->
      <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100 text-center">
        <div class="relative inline-block">
          <button
            class="w-16 h-16 mx-auto rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center text-2xl overflow-hidden transition-all duration-150 hover:shadow-diary-md relative group cursor-pointer"
            title="点击更换头像"
            @click="uploadPartnerAvatar"
          >
            <img v-if="dashboardStore.partnerAvatar" :src="dashboardStore.partnerAvatar" class="w-full h-full object-cover" />
            <span v-else>💕</span>
            <span class="absolute inset-0 bg-warm-800/40 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full">换头像</span>
          </button>
          <button
            class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-xs transition-all duration-150 active:scale-90 hover:shadow-diary-md cursor-pointer"
            @click="patHer"
          >
            👋
          </button>
        </div>
        <p class="mt-2 font-semibold text-warm-800 text-sm">小白</p>
        <!-- Status: show all options when identity is 小白, else show only current -->
        <template v-if="identity.current === '小白'">
          <div class="mt-2 flex flex-wrap gap-1 justify-center">
            <button
              v-for="opt in dashboardStore.statusOptions"
              :key="opt.value"
              class="px-2.5 py-1 text-[11px] rounded-full border transition-all duration-150 active:scale-90"
              :class="dashboardStore.partnerStatus === opt.value
                ? 'bg-sunshine-200 border-sunshine-300 text-warm-700 font-medium'
                : 'bg-white border-warm-200 text-warm-400 hover:border-warm-300'"
              @click="updatePartnerStatus(opt.value)"
            >
              {{ opt.emoji }} {{ opt.label }}
            </button>
          </div>
        </template>
        <template v-else>
          <span class="inline-block mt-1 px-2.5 py-1 text-[11px] rounded-full bg-rose-100 text-warm-600 font-medium">
            {{ dashboardStore.statusOptions.find(o => o.value === dashboardStore.partnerStatus)?.emoji }} {{ dashboardStore.statusOptions.find(o => o.value === dashboardStore.partnerStatus)?.label || '想你中 💕' }}
          </span>
        </template>
      </div>
    </section>



    <!-- ========== Mailbox ========== -->
    <section class="bg-white rounded-xl shadow-diary-sm border border-warm-100 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-warm-100">
        <div class="flex items-center gap-2">
          <span class="text-xl">📮</span>
          <h2 class="font-display text-base text-warm-800">甜蜜信箱</h2>
          <span v-if="unreadCount > 0"
            class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-400 text-white text-[10px] font-bold">
            {{ unreadCount }}
          </span>
        </div>
        <DiaryButton variant="ghost" @click="openWriteLetter">✉️ 写信</DiaryButton>
      </div>

      <EmptyState
        v-if="lettersStore.loaded && lettersStore.letters.length === 0"
        emoji="💌"
        title="信箱空空"
        description="给对方写一封信吧，设定好时间才能打开哦"
        class="py-6"
      />

      <div v-else class="divide-y divide-warm-100">
        <div
          v-for="letter in [...unlockedLetters, ...lockedLetters]"
          :key="letter.id"
          class="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-sunshine-50/50 transition-colors"
          :class="{ 'opacity-60': new Date(letter.unlockAt) > new Date() }"
          @click="openLetter(letter)"
        >
          <span class="text-xl flex-shrink-0">
            {{ letter.from === '小鸡毛' ? '🧑‍💻' : '💕' }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-sm text-warm-700 truncate">{{ letter.title }}</span>
              <span v-if="!letter.isRead && new Date(letter.unlockAt) <= new Date()"
                class="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            </div>
            <p class="text-xs text-warm-400 mt-0.5">
              {{ letter.from }} · {{ formatDateFull(letter.createdAt).slice(0, 10) }}
            </p>
          </div>
          <div class="flex-shrink-0 text-right">
            <span v-if="new Date(letter.unlockAt) > new Date()" class="text-xs text-rose-400 font-medium">
              🔒 {{ formatUnlockTime(letter.unlockAt) }}
            </span>
            <span v-else class="text-xs text-warm-400">📖 已解锁</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== Heart Burst ========== -->
    <HeartBurst ref="heartBurst" />

    <!-- ========== Write Letter Modal ========== -->
    <Teleport to="body">
      <div v-if="showLetterForm" class="love-modal-overlay" @click.self="showLetterForm = false">
        <div class="love-modal-content">
          <h2 class="font-display text-lg text-warm-800 mb-4">写信 💌</h2>

          <div class="space-y-4">
            <!-- From (locked to current identity) -->
            <div>
              <p class="text-xs text-warm-400 mb-2">发件人</p>
              <div class="py-2 px-3 rounded-xl border-2 border-sunshine-400 bg-sunshine-100 text-sm font-medium text-warm-700 text-center">
                {{ identity.current === '小鸡毛' ? '🧑‍💻 小鸡毛' : '💕 小白' }}
              </div>
            </div>

            <DiaryInput v-model="letterTitle" placeholder="信件标题..." />

            <DiaryInput v-model="letterContent" type="textarea" placeholder="想对你说的话..." />

            <div>
              <p class="text-xs text-warm-400 mb-2">对方可以在以下时间后打开</p>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-[10px] text-warm-400 mb-1">日期</p>
                  <input v-model="letterUnlockDate" type="date" :min="todayStr()"
                    class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
                </div>
                <div>
                  <p class="text-[10px] text-warm-400 mb-1">时间</p>
                  <input v-model="letterUnlockTime" type="time"
                    class="w-full bg-sunshine-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 outline-none focus:border-sunshine-400" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <DiaryButton variant="secondary" class="flex-1" @click="showLetterForm = false">取消</DiaryButton>
            <DiaryButton variant="primary" class="flex-1"
              :disabled="!letterTitle.trim() || !letterContent.trim() || !letterUnlockDate || !letterUnlockTime"
              @click="submitLetter">
              投递 💌
            </DiaryButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========== Read Letter Modal ========== -->
    <Teleport to="body">
      <div v-if="showLetterDetail" class="love-modal-overlay" @click.self="showLetterDetail = null">
        <div class="love-modal-content">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs text-warm-400">
              {{ showLetterDetail.from === '小鸡毛' ? '🧑‍💻' : '💕' }} {{ showLetterDetail.from }} 寄
            </span>
            <div class="flex items-center gap-2">
              <button class="text-xs text-warm-400 hover:text-red-400 px-1"
                @click="deleteLetter(showLetterDetail)">🗑️</button>
              <button class="text-warm-400 hover:text-warm-600 text-lg px-1"
                @click="showLetterDetail = null">✕</button>
            </div>
          </div>

          <h2 class="font-display text-xl text-warm-800 mb-1">{{ showLetterDetail.title }}</h2>
          <p class="text-xs text-warm-400 mb-4">
            {{ formatDateFull(showLetterDetail.createdAt) }}
            · {{ new Date(showLetterDetail.unlockAt) <= new Date() ? '已解锁' : '🔒 未解锁' }}
          </p>

          <div class="bg-sunshine-50 rounded-xl p-4 border border-warm-100">
            <p class="text-warm-700 leading-relaxed whitespace-pre-wrap">{{ showLetterDetail.content }}</p>
          </div>

          <DiaryButton variant="secondary" class="w-full mt-4" @click="showLetterDetail = null">关闭</DiaryButton>
        </div>
      </div>
    </Teleport>

    <!-- ========== Confirm Delete ========== -->
    <ConfirmDialog
      :show="confirmDeleteLetterId !== null"
      title="删除信件"
      message="确定要删除这封信吗？"
      confirm-text="删除"
      cancel-text="保留"
      @confirm="confirmDeleteLetter"
      @cancel="confirmDeleteLetterId = null"
    />

    <!-- ========== Date Picker Modal ========== -->
    <Teleport to="body">
      <div v-if="showDatePicker" class="love-modal-overlay" @click.self="showDatePicker = false">
        <div class="love-modal-content">
          <h2 class="font-display text-lg text-warm-800 mb-4 text-center">选择纪念日 📅</h2>

          <div class="flex justify-center gap-3 mb-4">
            <!-- Year Column -->
            <div class="date-picker-column-wrapper">
              <p class="text-[10px] text-warm-400 text-center mb-1">年</p>
              <div
                class="date-picker-column"
                @scroll="onPickerScroll('year', $event)"
                @wheel.prevent="onPickerWheel('year', $event)"
              >
                <div class="date-picker-spacer" />
                <div
                  v-for="y in yearOptions"
                  :key="y"
                  class="date-picker-item"
                  :class="{
                    'date-picker-item--selected': y === pickerYear
                  }"
                  :data-val="y"
                  @click="pickerYear = y; scrollToSelected()"
                >
                  {{ y }}
                </div>
                <div class="date-picker-spacer" />
              </div>
            </div>

            <!-- Month Column -->
            <div class="date-picker-column-wrapper">
              <p class="text-[10px] text-warm-400 text-center mb-1">月</p>
              <div
                class="date-picker-column"
                @scroll="onPickerScroll('month', $event)"
                @wheel.prevent="onPickerWheel('month', $event)"
              >
                <div class="date-picker-spacer" />
                <div
                  v-for="m in monthOptions"
                  :key="m"
                  class="date-picker-item"
                  :class="{
                    'date-picker-item--selected': m === pickerMonth
                  }"
                  :data-val="m"
                  @click="pickerMonth = m; scrollToSelected()"
                >
                  {{ m }}月
                </div>
                <div class="date-picker-spacer" />
              </div>
            </div>

            <!-- Day Column -->
            <div class="date-picker-column-wrapper">
              <p class="text-[10px] text-warm-400 text-center mb-1">日</p>
              <div
                class="date-picker-column"
                @scroll="onPickerScroll('day', $event)"
                @wheel.prevent="onPickerWheel('day', $event)"
              >
                <div class="date-picker-spacer" />
                <div
                  v-for="d in dayOptions"
                  :key="d"
                  class="date-picker-item"
                  :class="{
                    'date-picker-item--selected': d === pickerDay
                  }"
                  :data-val="d"
                  @click="pickerDay = d; scrollToSelected()"
                >
                  {{ d }}日
                </div>
                <div class="date-picker-spacer" />
              </div>
            </div>
          </div>

          <!-- Preview -->
          <p class="text-center text-sm text-warm-600 mb-4 font-semibold">
            {{ pickerYear }}年{{ pickerMonth }}月{{ pickerDay }}日
          </p>

          <div class="flex gap-3">
            <DiaryButton variant="secondary" class="flex-1" @click="showDatePicker = false">取消</DiaryButton>
            <DiaryButton variant="primary" class="flex-1" @click="confirmDate">确定 💕</DiaryButton>
          </div>
        </div>
      </div>
    </Teleport>
    </template>
  </div>
</template>

<style scoped>
.reminder-enter-active {
  animation: soft-bounce-in 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.reminder-leave-active {
  animation: fade-out 0.2s ease-in;
}
@keyframes fade-out {
  to { opacity: 0; transform: translateY(-8px); }
}
</style>

<style>
.date-picker-column-wrapper {
  width: 80px;
}
.date-picker-column {
  height: 180px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  background: #FFF9E6;
  border-radius: 12px;
  border: 1px solid #f0e8d8;
  scrollbar-width: none;
}
.date-picker-column::-webkit-scrollbar {
  display: none;
}
.date-picker-spacer {
  height: 60px;
  scroll-snap-align: none;
}
.date-picker-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #b0a89a;
  cursor: pointer;
  scroll-snap-align: center;
  transition: all 0.15s;
  border-radius: 8px;
  margin: 2px 6px;
  user-select: none;
}
.date-picker-item--selected {
  color: #5c4a3a;
  font-weight: 700;
  font-size: 17px;
  background: #fef3c7;
}
</style>
