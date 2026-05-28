import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Fragment } from '@/types'
import { loadTable, insertRow, upsertRow, deleteRow, DB_TABLES } from '@/utils/db'

export const useFragmentsStore = defineStore('fragments', () => {
  const items = ref<Fragment[]>([])
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    items.value = await loadTable<Fragment>(DB_TABLES.fragments)
    loaded.value = true
  }

  function addFragment(fragment: Fragment, author: string) {
    items.value.unshift(fragment)
    insertRow(DB_TABLES.fragments, fragment.id, author, fragment)
  }

  function removeFragment(id: string) {
    items.value = items.value.filter((f) => f.id !== id)
    deleteRow(DB_TABLES.fragments, id)
  }

  function updateFragment(id: string, updates: Partial<Fragment>, author: string) {
    const idx = items.value.findIndex((f) => f.id === id)
    if (idx !== -1) {
      Object.assign(items.value[idx], updates)
      upsertRow(DB_TABLES.fragments, id, author, { ...items.value[idx], author: undefined })
    }
  }

  function getFragment(id: string): Fragment | undefined {
    return items.value.find((f) => f.id === id)
  }

  return { items, loaded, init, addFragment, removeFragment, updateFragment, getFragment }
})
