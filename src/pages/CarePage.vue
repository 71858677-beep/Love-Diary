<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCareStore } from '@/stores/care'
import DiaryButton from '@/components/ui/DiaryButton.vue'

const careStore = useCareStore()

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const daysInMonth = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(viewYear.value, viewMonth.value, 1).getDay()
})

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function isToday(day: number): boolean {
  return (
    day === today.getDate() &&
    viewMonth.value === today.getMonth() &&
    viewYear.value === today.getFullYear()
  )
}

function isCycleDay(day: number): boolean {
  const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return careStore.cycleRecords.includes(dateStr)
}

function toggleDay(day: number) {
  const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  careStore.toggleCycleDay(dateStr)
}

// ── Month Picker ──
const showMonthPicker = ref(false)
const pickerYear = ref(viewYear.value)
const pickerMonth = ref(viewMonth.value)

const yearOptions = computed(() => {
  const yr = new Date().getFullYear()
  return Array.from({ length: yr - 2014 }, (_, i) => 2015 + i)
})
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

function openMonthPicker() {
  pickerYear.value = viewYear.value
  pickerMonth.value = viewMonth.value
  showMonthPicker.value = true
  requestAnimationFrame(() => {
    const cols = document.querySelectorAll('.month-picker-column')
    cols.forEach((col) => {
      const selected = col.querySelector('.month-picker-item--selected')
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    })
  })
}

function confirmMonth() {
  viewYear.value = pickerYear.value
  viewMonth.value = pickerMonth.value - 1
  showMonthPicker.value = false
}

function onMonthPickerScroll(col: string, event: Event) {
  const el = event.target as HTMLElement
  const items = el.querySelectorAll('.month-picker-item')
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
  }
}

function onMonthPickerWheel(_col: string, event: WheelEvent) {
  event.preventDefault()
  const el = event.currentTarget as HTMLElement
  const items = Array.from(el.querySelectorAll('.month-picker-item'))
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
</script>

<template>
  <div class="px-5 pt-8 pb-4">
    <h1 class="font-display text-2xl text-warm-800 mb-6">呵护日历 🌸</h1>

    <!-- Calendar -->
    <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-warm-100">
      <!-- Month Header -->
      <div class="flex items-center justify-center gap-3 mb-4">
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-warm-400 hover:bg-warm-100 hover:text-warm-600 transition-colors text-lg"
          @click="prevMonth"
        >
          ‹
        </button>
        <button
          class="font-display text-lg text-warm-700 hover:text-sunshine-500 transition-colors px-2"
          @click="openMonthPicker"
        >
          {{ viewYear }} 年 {{ viewMonth + 1 }} 月
        </button>
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-warm-400 hover:bg-warm-100 hover:text-warm-600 transition-colors text-lg"
          @click="nextMonth"
        >
          ›
        </button>
      </div>

      <!-- Weekday Labels -->
      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
          :key="day"
          class="text-center text-[11px] text-warm-400 font-medium py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-1">
        <!-- Empty cells before first day -->
        <div
          v-for="i in firstDayOfWeek"
          :key="'empty-' + i"
          class="aspect-square"
        />

        <button
          v-for="day in daysInMonth"
          :key="day"
          class="aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all active:scale-90 relative"
          :class="[
            isToday(day)
              ? 'bg-sunshine-400 text-warm-800 font-bold shadow-sm'
              : '',
            isCycleDay(day) && !isToday(day)
              ? 'bg-rose-100 text-rose-400'
              : '',
            !isToday(day) && !isCycleDay(day)
              ? 'text-warm-600 hover:bg-sunshine-100'
              : '',
          ]"
          @click="toggleDay(day)"
        >
          {{ day }}
          <!-- Cycle dot -->
          <span
            v-if="isCycleDay(day)"
            class="absolute bottom-0.5 w-1 h-1 rounded-full"
            :class="isToday(day) ? 'bg-white' : 'bg-rose-300'"
          />
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mt-4 text-xs text-warm-400 justify-center">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-rose-100 border border-rose-200" />
        经期日
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-sunshine-400" />
        今天
      </div>
    </div>

    <!-- Prediction -->
    <div
      v-if="careStore.predictedNext"
      class="mt-4 bg-rose-50 rounded-xl p-4 border border-rose-100 text-center"
    >
      <p class="text-sm text-warm-600">
        预测下次：<span class="font-semibold text-rose-400">{{ careStore.predictedNext }}</span>
      </p>
      <p class="text-xs text-warm-400 mt-1">
        平均周期 {{ careStore.avgCycleDays }} 天
      </p>
    </div>

    <!-- ========== Month Picker Modal ========== -->
    <Teleport to="body">
      <div v-if="showMonthPicker" class="love-modal-overlay" @click.self="showMonthPicker = false">
        <div class="love-modal-content">
          <h2 class="font-display text-lg text-warm-800 mb-4 text-center">选择月份 📅</h2>

          <div class="flex justify-center gap-3 mb-4">
            <!-- Year Column -->
            <div class="month-picker-column-wrapper">
              <p class="text-[10px] text-warm-400 text-center mb-1">年</p>
              <div
                class="month-picker-column"
                @scroll="onMonthPickerScroll('year', $event)"
                @wheel.prevent="onMonthPickerWheel('year', $event)"
              >
                <div class="month-picker-spacer" />
                <div
                  v-for="y in yearOptions"
                  :key="y"
                  class="month-picker-item"
                  :class="{ 'month-picker-item--selected': y === pickerYear }"
                  :data-val="y"
                  @click="pickerYear = y"
                >
                  {{ y }}
                </div>
                <div class="month-picker-spacer" />
              </div>
            </div>

            <!-- Month Column -->
            <div class="month-picker-column-wrapper">
              <p class="text-[10px] text-warm-400 text-center mb-1">月</p>
              <div
                class="month-picker-column"
                @scroll="onMonthPickerScroll('month', $event)"
                @wheel.prevent="onMonthPickerWheel('month', $event)"
              >
                <div class="month-picker-spacer" />
                <div
                  v-for="m in monthOptions"
                  :key="m"
                  class="month-picker-item"
                  :class="{ 'month-picker-item--selected': m === pickerMonth }"
                  :data-val="m"
                  @click="pickerMonth = m"
                >
                  {{ m }}月
                </div>
                <div class="month-picker-spacer" />
              </div>
            </div>
          </div>

          <p class="text-center text-sm text-warm-600 mb-4 font-semibold">
            {{ pickerYear }}年{{ pickerMonth }}月
          </p>

          <div class="flex gap-3">
            <DiaryButton variant="secondary" class="flex-1" @click="showMonthPicker = false">取消</DiaryButton>
            <DiaryButton variant="primary" class="flex-1" @click="confirmMonth">确定 💕</DiaryButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Care Tips -->
    <div class="grid grid-cols-2 gap-3 mt-4">
      <!-- 小白需要注意 -->
      <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-rose-100">
        <h3 class="font-display text-sm text-rose-400 mb-3 text-center">小白需要注意 🌸</h3>
        <ol class="space-y-2 text-xs text-warm-700 leading-relaxed">
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">1.</span>
            <span>早睡早起，保证充足睡眠</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">2.</span>
            <span>保持心情愉快，别生闷气</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">3.</span>
            <span>适当休息，避免剧烈运动</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">4.</span>
            <span>注意腹部保暖，别着凉</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">5.</span>
            <span>少吃生冷辛辣，多喝温水</span>
          </li>
        </ol>
      </div>

      <!-- 小鸡毛可以做到 -->
      <div class="bg-white rounded-xl p-4 shadow-diary-sm border border-sunshine-100">
        <h3 class="font-display text-sm text-sunshine-400 mb-3 text-center">小鸡毛可以做到 💪</h3>
        <ol class="space-y-2 text-xs text-warm-700 leading-relaxed">
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">1.</span>
            <span>多抱抱小白，心情最重要</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">2.</span>
            <span>准备好红糖姜茶或热牛奶</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">3.</span>
            <span>帮小白揉揉肚子、暖暖手</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">4.</span>
            <span>帮小白提包拿快递，减轻负担</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold flex-shrink-0">5.</span>
            <span>陪小白看一部温馨的电影</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style>
.month-picker-column-wrapper {
  width: 80px;
}
.month-picker-column {
  height: 180px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  background: #FFF9E6;
  border-radius: 12px;
  border: 1px solid #f0e8d8;
  scrollbar-width: none;
}
.month-picker-column::-webkit-scrollbar {
  display: none;
}
.month-picker-spacer {
  height: 60px;
  scroll-snap-align: none;
}
.month-picker-item {
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
.month-picker-item--selected {
  color: #5c4a3a;
  font-weight: 700;
  font-size: 17px;
  background: #fef3c7;
}
</style>
