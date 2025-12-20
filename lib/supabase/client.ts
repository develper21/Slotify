import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

export const createClient = () => {
    return createClientComponentClient<Database>()
}
