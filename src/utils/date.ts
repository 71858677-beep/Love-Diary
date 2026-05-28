export function formatDate(iso: string): string {
  const date = new Date(iso)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

export function formatDateFull(iso: string): string {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  return Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
