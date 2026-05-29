import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, ensureAuth } from '@/supabase'
import { DB_TABLES } from '@/utils/db'

const AVG_CYCLE_DAYS_DEFAULT = 28

function calcAverageCycle(dates: string[]): number {
  if (dates.length < 2) return AVG_CYCLE_DAYS_DEFAULT
  const sorted = [...dates].sort()
  let total = 0
  let count = 0
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000
    // Only count gaps between 21-40 days as valid cycles
    if (diff >= 21 && diff <= 40) {
      total += diff
      count++
    }
  }
  return count > 0 ? Math.round(total / count) : AVG_CYCLE_DAYS_DEFAULT
}

export const useCareStore = defineStore('care', () => {
  const cycleRecords = ref<string[]>([])
  const avgCycleDays = ref<number>(AVG_CYCLE_DAYS_DEFAULT)
  const loaded = ref(false)

  const predictedNext = computed<string | null>(() => {
    if (cycleRecords.value.length < 1) return null
    const sorted = [...cycleRecords.value].sort()
    const lastDate = new Date(sorted[sorted.length - 1])
    const predicted = new Date(lastDate.getTime() + avgCycleDays.value * 86400000)
    return predicted.toISOString().slice(0, 10)
  })

  function recalcAverage() {
    avgCycleDays.value = calcAverageCycle(cycleRecords.value)
  }

  async function init() {
    if (loaded.value) return
    await ensureAuth()
    const { data } = await supabase
      .from(DB_TABLES.careRecords)
      .select('*')
    if (data) {
      cycleRecords.value = data.map((r: { data: { dates: string[]; avgCycleDays: number } }) => r.data.dates).flat()
      recalcAverage()
    }
    loaded.value = true
  }

  async function toggleCycleDay(date: string) {
    const idx = cycleRecords.value.indexOf(date)
    if (idx === -1) {
      cycleRecords.value.push(date)
    } else {
      cycleRecords.value.splice(idx, 1)
    }
    recalcAverage()
    await ensureAuth()
    await supabase.from(DB_TABLES.careRecords).upsert({
      id: 'records',
      data: { dates: [...cycleRecords.value], avgCycleDays: avgCycleDays.value },
      created_at: new Date().toISOString(),
    })
  }

  function isNearPredictedCycle(): boolean {
    if (!predictedNext.value) return false
    const predicted = new Date(predictedNext.value)
    const now = new Date()
    const diff = Math.abs(now.getTime() - predicted.getTime()) / 86400000
    return diff <= 2
  }

  return { cycleRecords, avgCycleDays, predictedNext, loaded, init, toggleCycleDay, isNearPredictedCycle }
})
