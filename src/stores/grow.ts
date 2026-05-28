import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Habit } from '@/types'
import { loadTable, insertRow, upsertRow, deleteRow, DB_TABLES } from '@/utils/db'

export const useGrowStore = defineStore('grow', () => {
  const habits = ref<Habit[]>([])
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    habits.value = await loadTable<Habit>(DB_TABLES.habits)
    loaded.value = true
  }

  function addHabit(habit: Habit, author: string) {
    habits.value.push(habit)
    insertRow(DB_TABLES.habits, habit.id, author, habit)
  }

  function checkInMe(habitId: string, author: string) {
    const habit = habits.value.find((h) => h.id === habitId)
    if (!habit) return
    const today = new Date().toISOString().slice(0, 10)
    if (!habit.history[today]) {
      habit.history[today] = { me: false, her: false }
    }
    if (!habit.history[today].me) {
      habit.history[today].me = true
      habit.streakMe += 1
      upsertRow(DB_TABLES.habits, habitId, author, { ...habit, author: undefined })
    }
  }

  function checkInHer(habitId: string, author: string) {
    const habit = habits.value.find((h) => h.id === habitId)
    if (!habit) return
    const today = new Date().toISOString().slice(0, 10)
    if (!habit.history[today]) {
      habit.history[today] = { me: false, her: false }
    }
    if (!habit.history[today].her) {
      habit.history[today].her = true
      habit.streakHer += 1
      upsertRow(DB_TABLES.habits, habitId, author, { ...habit, author: undefined })
    }
  }

  function updateHabit(id: string, updates: Partial<Pick<Habit, 'name' | 'icon'>>, author: string) {
    const habit = habits.value.find((h) => h.id === id)
    if (habit) {
      Object.assign(habit, updates)
      upsertRow(DB_TABLES.habits, id, author, { ...habit, author: undefined })
    }
  }

  function removeHabit(id: string) {
    habits.value = habits.value.filter((h) => h.id !== id)
    deleteRow(DB_TABLES.habits, id)
  }

  function recalculateStreaks() {
    const today = new Date().toISOString().slice(0, 10)
    for (const habit of habits.value) {
      if (!habit.history[today]) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        if (!habit.history[yesterday]) {
          // Reset streaks if no record yesterday or today
        }
      }
    }
  }

  return { habits, loaded, init, addHabit, checkInMe, checkInHer, recalculateStreaks, updateHabit, removeHabit }
})
