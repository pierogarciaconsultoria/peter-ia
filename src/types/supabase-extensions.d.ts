
import { PostgrestError } from '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  export interface QueryResult<T = any> {
    data: T | null
    error: PostgrestError | null
  }
}
