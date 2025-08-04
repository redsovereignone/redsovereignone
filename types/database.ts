export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      scenarios: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          initial_mrr: number
          mrr_growth_rate: number
          project_revenue: number
          project_growth_rate: number
          churn_rate: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          initial_mrr?: number
          mrr_growth_rate?: number
          project_revenue?: number
          project_growth_rate?: number
          churn_rate?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          initial_mrr?: number
          mrr_growth_rate?: number
          project_revenue?: number
          project_growth_rate?: number
          churn_rate?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      actuals: {
        Row: {
          id: string
          scenario_id: string
          month: number
          mrr_actual: number | null
          project_actual: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          scenario_id: string
          month: number
          mrr_actual?: number | null
          project_actual?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          scenario_id?: string
          month?: number
          mrr_actual?: number | null
          project_actual?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Scenario = Database['public']['Tables']['scenarios']['Row']
export type Actual = Database['public']['Tables']['actuals']['Row']

export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewScenario = Database['public']['Tables']['scenarios']['Insert']
export type NewActual = Database['public']['Tables']['actuals']['Insert']

export type UpdateUser = Database['public']['Tables']['users']['Update']
export type UpdateScenario = Database['public']['Tables']['scenarios']['Update']
export type UpdateActual = Database['public']['Tables']['actuals']['Update']