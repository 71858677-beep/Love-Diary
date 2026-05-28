import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StatusOption } from '@/types'
import { supabase, ensureAuth } from '@/supabase'

const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { value: 'studying', label: '学习中', emoji: '📚' },
  { value: 'eating', label: '干饭中', emoji: '🍜' },
  { value: 'sleeping', label: '睡觉中', emoji: '💤' },
  { value: 'working', label: '搬砖中', emoji: '💼' },
  { value: 'missing', label: '想你中', emoji: '💕' },
]

function defaultLabel(status: string): string {
  return DEFAULT_STATUS_OPTIONS.find((o) => o.value === status)?.label || '想你中 💕'
}

export const useDashboardStore = defineStore('dashboard', () => {
  const anniversaryDate = ref<string>('')
  const userStatus = ref<string>('missing')
  const partnerStatus = ref<string>('missing')
  const statusOptions = ref<StatusOption[]>(DEFAULT_STATUS_OPTIONS)
  const userAvatar = ref<string>('')
  const partnerAvatar = ref<string>('')
  const partnerStatusLabel = ref<string>('想你中 💕')
  const loaded = ref(false)

  async function init() {
    if (loaded.value) return
    await ensureAuth()
    const { data } = await supabase.from('dashboard_settings').select('*')
    if (data) {
      for (const row of data as Array<{ key: string; value: string }>) {
        switch (row.key) {
          case 'anniversary': anniversaryDate.value = row.value; break
          case 'userStatus': userStatus.value = row.value; break
          case 'partnerStatus':
            partnerStatus.value = row.value
            partnerStatusLabel.value = defaultLabel(row.value)
            break
          case 'userAvatar': userAvatar.value = row.value; break
          case 'partnerAvatar': partnerAvatar.value = row.value; break
        }
      }
    }
    loaded.value = true
  }

  async function setSetting(key: string, value: string) {
    await ensureAuth()
    await supabase.from('dashboard_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    })
  }

  function setAnniversary(date: string) {
    anniversaryDate.value = date
    setSetting('anniversary', date)
  }

  function updateUserStatus(status: string) {
    userStatus.value = status
    setSetting('userStatus', status)
  }

  function updatePartnerStatus(status: string) {
    partnerStatus.value = status
    partnerStatusLabel.value = defaultLabel(status)
    setSetting('partnerStatus', status)
  }

  function setUserAvatar(base64: string) {
    userAvatar.value = base64
    setSetting('userAvatar', base64)
  }

  function setPartnerAvatar(base64: string) {
    partnerAvatar.value = base64
    setSetting('partnerAvatar', base64)
  }

  return {
    anniversaryDate, userStatus, partnerStatus, statusOptions,
    partnerStatusLabel, userAvatar, partnerAvatar, loaded,
    init, setAnniversary, updateUserStatus, updatePartnerStatus,
    setUserAvatar, setPartnerAvatar,
  }
})
