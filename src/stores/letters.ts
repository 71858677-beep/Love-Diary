import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoveLetter } from '@/types'
import { loadTable, insertRow, upsertRow, deleteRow, DB_TABLES } from '@/utils/db'

export const useLettersStore = defineStore('letters', () => {
  const letters = ref<LoveLetter[]>([])
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    letters.value = await loadTable<LoveLetter>(DB_TABLES.loveLetters)
    loaded.value = true
  }

  function addLetter(letter: LoveLetter, author: string) {
    letters.value.unshift(letter)
    insertRow(DB_TABLES.loveLetters, letter.id, author, letter)
  }

  function markRead(id: string, author: string) {
    const letter = letters.value.find((l) => l.id === id)
    if (letter) {
      letter.isRead = true
      upsertRow(DB_TABLES.loveLetters, id, author, { ...letter, author: undefined })
    }
  }

  function removeLetter(id: string) {
    letters.value = letters.value.filter((l) => l.id !== id)
    deleteRow(DB_TABLES.loveLetters, id)
  }

  return { letters, loaded, init, addLetter, markRead, removeLetter }
})
