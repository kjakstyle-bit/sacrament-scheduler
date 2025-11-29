import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const isValidUrl = (u: string | undefined) => u && u.startsWith('http')
    const url = isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ? process.env.NEXT_PUBLIC_SUPABASE_URL! : 'https://example.com'
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0) ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'dummy-key'

    return createBrowserClient(url, key)
}
