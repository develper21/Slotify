import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export const createClient = () => {
    return createServerComponentClient<Database>({ cookies })
}

export const createActionClient = () => {
    return createServerActionClient<Database>({ cookies })
}
