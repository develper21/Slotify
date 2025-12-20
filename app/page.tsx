import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
    const supabase = createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: userData }: { data: { role?: string } | null } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (userData?.role === 'admin') {
        redirect('/admin')
    }

    if (userData?.role === 'organizer') {
        redirect('/dashboard')
    }

    redirect('/home')
}
