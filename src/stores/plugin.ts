import type { PiniaPluginContext } from 'pinia'

const STORE_VERSION = 1

export function localStoragePlugin({ store }: PiniaPluginContext) {
  const key = `love-diary:${store.$id}`

  // Load from localStorage on init
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data._version === STORE_VERSION) {
        store.$patch(data)
      } else {
        // Migration placeholder for future versions
        migrate(store.$id, data, STORE_VERSION)
      }
    } catch {
      console.warn(`[Love Diary] Failed to load store "${store.$id}"`)
    }
  }

  // Persist on every mutation
  store.$subscribe(() => {
    const state = { ...store.$state, _version: STORE_VERSION }
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn(
          `[Love Diary] Storage full! Could not save "${store.$id}". Please clean up old data.`
        )
      }
    }
  })
}

function migrate(storeId: string, data: Record<string, unknown>, targetVersion: number) {
  const currentVersion = (data._version as number) || 0
  if (currentVersion < targetVersion) {
    console.log(`[Love Diary] Migrating "${storeId}" from v${currentVersion} → v${targetVersion}`)
    // Migration logic will be added as schema evolves
  }
}
