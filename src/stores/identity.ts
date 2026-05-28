import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'love-diary:identity'

export type Identity = '小鸡毛' | '小白'

function loadIdentity(): Identity {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === '小鸡毛' || saved === '小白') return saved
  return '小鸡毛'
}

export const useIdentityStore = defineStore('identity', () => {
  const current = ref<Identity>(loadIdentity())

  function setIdentity(id: Identity) {
    current.value = id
    localStorage.setItem(STORAGE_KEY, id)
  }

  function isMe(id: string): boolean {
    return current.value === id
  }

  return { current, setIdentity, isMe }
})
