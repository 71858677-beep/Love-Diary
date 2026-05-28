import { supabase, ensureAuth } from '@/supabase'

export const DB_TABLES = {
  fragments: 'fragments',
  habits: 'habits',
  footprints: 'footprints',
  bucketItems: 'bucket_items',
  loveLetters: 'love_letters',
  careRecords: 'care_records',
  dashboardSettings: 'dashboard_settings',
} as const

export async function loadTable<T>(table: string): Promise<T[]> {
  await ensureAuth()
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('loadTable error:', table, error); return [] }
  return (data || []).map((r: { author: string; data: unknown }) => ({
    ...(r.data as object),
    author: r.author,
  })) as T[]
}

export async function insertRow(table: string, id: string, author: string, data: unknown) {
  await ensureAuth()
  const { error } = await supabase
    .from(table)
    .insert({ id, author, data, created_at: new Date().toISOString() })
  if (error) console.error('insertRow error:', table, error)
}

export async function upsertRow(table: string, id: string, author: string, data: unknown) {
  await ensureAuth()
  const { error } = await supabase
    .from(table)
    .upsert({ id, author, data, created_at: new Date().toISOString() })
  if (error) console.error('upsertRow error:', table, error)
}

export async function deleteRow(table: string, id: string) {
  await ensureAuth()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) console.error('deleteRow error:', table, error)
}
