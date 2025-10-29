import { createBrowserClient } from '@supabase/ssr'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          plan: 'free' | 'premium'
          created_at: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          merchant_canonical: string
          title: string
          periodicity: 'monthly' | 'yearly' | 'quarterly' | 'semiannual' | 'unknown'
          amount: number
          currency: string
          confidence: number
          first_seen: string
          last_seen: string
          status: 'active' | 'archived'
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          source_id: string
          occurred_at: string
          description: string
          merchant_canonical: string
          amount: number
          currency: string
        }
      }
    }
  }
}

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
