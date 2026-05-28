import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qxvpluaemiggknpyahvx.supabase.co'
const supabaseKey = 'sb_publishable_s-mM4TD0QRRqi6UmMPSADw_Pecq6SBP'

export const supabase = createClient(supabaseUrl, supabaseKey)

let _ready: Promise<void> | null = null

export function ensureAuth(): Promise<void> {
  if (!_ready) {
    _ready = supabase.auth.signInWithPassword({
      email: 'love@diary.app',
      password: import.meta.env.VITE_SUPABASE_PASSWORD,
    }).then(({ error }) => {
      if (error) console.error('Auth failed:', error.message)
    })
  }
  return _ready
}
