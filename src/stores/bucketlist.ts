import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BucketItem } from '@/types'
import { loadTable, insertRow, upsertRow, deleteRow, DB_TABLES } from '@/utils/db'

export const useBucketListStore = defineStore('bucketlist', () => {
  const items = ref<BucketItem[]>([])
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    items.value = await loadTable<BucketItem>(DB_TABLES.bucketItems)
    loaded.value = true
  }

  function addItem(item: BucketItem, author: string) {
    items.value.unshift(item)
    insertRow(DB_TABLES.bucketItems, item.id, author, item)
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    deleteRow(DB_TABLES.bucketItems, id)
  }

  function updateItem(id: string, updates: Partial<Pick<BucketItem, 'title' | 'note'>>, author: string) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      Object.assign(item, updates)
      upsertRow(DB_TABLES.bucketItems, id, author, { ...item, author: undefined })
    }
  }

  function completeItem(id: string, author: string, extra?: { photos?: string[]; note?: string }) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.completed = true
      item.completedAt = new Date().toISOString()
      if (extra?.photos) item.photos = extra.photos
      if (extra?.note !== undefined) item.note = extra.note
      upsertRow(DB_TABLES.bucketItems, id, author, { ...item, author: undefined })
    }
  }

  function uncompleteItem(id: string, author: string) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.completed = false
      item.completedAt = undefined
      item.photos = []
      item.note = undefined
      upsertRow(DB_TABLES.bucketItems, id, author, { ...item, author: undefined })
    }
  }

  return { items, loaded, init, addItem, removeItem, updateItem, completeItem, uncompleteItem }
})
