const STORAGE_LIMIT = 5 * 1024 * 1024 // 5MB warning threshold

export function getStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('love-diary:')) {
      total += (localStorage.getItem(key) || '').length * 2 // UTF-16 ~2 bytes per char
    }
  }
  return total
}

export function isStorageNearLimit(): boolean {
  return getStorageUsage() > STORAGE_LIMIT
}

export function getStorageUsagePercent(): number {
  // Estimate: 5MB typical limit
  return Math.round((getStorageUsage() / (5 * 1024 * 1024)) * 100)
}
