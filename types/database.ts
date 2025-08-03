export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          created_at?: string
        }
      }
      scenarios: {
        Row: {
          id: string
          user_id: string
          name: string
          initial_mrr: number
          mrr_growth_rate: number
          project_revenue: number
          project_growth_rate: number
          churn_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          initial_mrr: number
          mrr_growth_rate: number
          project_revenue: number
          project_growth_rate: number
          churn_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          initial_mrr?: number
          mrr_growth_rate?: number
          project_revenue?: number
          project_growth_rate?: number
          churn_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      actuals: {
        Row: {
          id: string
          scenario_id: string
          month: number
          mrr_actual: number
          project_actual: number
          created_at: string
        }
        Insert: {
          id?: string
          scenario_id: string
          month: number
          mrr_actual: number
          project_actual: number
          created_at?: string
        }
        Update: {
          id?: string
          scenario_id?: string
          month?: number
          mrr_actual?: number
          project_actual?: number
          created_at?: string
        }
      }
    }
  }
}