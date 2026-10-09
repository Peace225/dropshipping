"use client";

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

type GlobalWithSupabase = typeof globalThis & {
  __eclosia_supabase?: SupabaseClient
}

// ✅ Ajout des "!" pour certifier à TypeScript que les variables ne sont pas undefined
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!url || !key) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY manquants dans .env.local")
}

export function getSupabase(): SupabaseClient {
  // Client : singleton dans globalThis
  if (typeof window !== 'undefined') {
    const g = globalThis as GlobalWithSupabase
    if (!g.__eclosia_supabase) {
      g.__eclosia_supabase = createBrowserClient(url, key)
    }
    return g.__eclosia_supabase
  }
  // Fallback serveur (ne devrait pas arriver avec "use client")
  return createBrowserClient(url, key)
}