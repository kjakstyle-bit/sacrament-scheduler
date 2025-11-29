import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
    const cookieStore = cookies()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        // Build time check: if these are missing during build, we might want to return a dummy client or throw
        // But throwing is better to catch config errors.
        // However, for static generation, we might need to be careful.
        // Since we are forcing dynamic, this should only run at runtime.
        if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
            console.error('Supabase env vars missing!')
        }
    }

    // Fallback for build time or missing env vars
    // Ensure we have a valid URL string, handling undefined or empty string
    const isValidUrl = (u: string | undefined) => u && u.startsWith('http')
    const supabaseUrl = isValidUrl(url) ? url! : 'https://example.com'
    const supabaseKey = (key && key.length > 0) ? key : 'dummy-key'

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
