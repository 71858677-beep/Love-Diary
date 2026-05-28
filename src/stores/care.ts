import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, ensureAuth } from '@/supabase'
import { DB_TABLES } from '@/utils/db'

const AVG_CYCLE_DAYS_DEFAULT = 28

export const useCareStore = defineStore('care', () => {
  const cycleRecords = ref<string[]>([])
  const avgCycleDays = ref<number>(AVG_CYCLE_DAYS_DEFAULT)
  const loaded = ref(false)

  const predictedNext = computed<string | null>(() => {
    if (cycleRecords.value.length < 2) return null
    const sorted = [...cycleRecords.value].sort()
    const lastDate = new Date(sorted[sorted.length - 1])
    const predicted = new Date(lastDate.getTime() + avgCycleDays.value * 86400000)
    return predicted.toISOString().slice(0, 10)
  })

  async function init() {
    if (loaded.value) return
    await ensureAuth()
    const { data } = await supabase
      .from(DB_TABLES.careRecords)
      .select('*')
    if (data) {
      cycleRecords.value = data.map((r: { data: { dates: string[]; avgCycleDays: number } }) => r.data.dates).flat()
      const meta = data.find((r: { id: string }) => r.id === 'meta')
      if (meta) {
        avgCycleDays.value = (meta.data as { avgCycleDays: number }).avgCycleDays || AVG_CYCLE_DAYS_DEFAULT
      }
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
