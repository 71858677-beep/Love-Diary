import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Footprint } from '@/types'
import { loadTable, insertRow, upsertRow, deleteRow, DB_TABLES } from '@/utils/db'

export const useFootprintsStore = defineStore('footprints', () => {
  const items = ref<Footprint[]>([])
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    items.value = await loadTable<Footprint>(DB_TABLES.footprints)
    loaded.value = true
  }

  function addFootprint(fp: Footprint, author: string) {
    items.value.unshift(fp)
    insertRow(DB_TABLES.footprints, fp.id, author, fp)
  }

  function removeFootprint(id: string) {
    items.value = items.value.filter((f) => f.id !== id)
    deleteRow(DB_TABLES.footprints, id)
  }

  function updateFootprint(id: string, updates: Partial<Footprint>, author: string) {
    const fp = items.value.find((f) => f.id === id)
    if (fp) {
      Object.assign(fp, updates)
      upsertRow(DB_TABLES.footprints, id, author, { ...fp, author: undefined })
    }
  }

  return { items, loaded, init, addFootprint, removeFootprint, updateFootprint }
})
