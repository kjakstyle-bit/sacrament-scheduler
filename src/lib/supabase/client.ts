import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

    return createBrowserClient(url, key)
}
