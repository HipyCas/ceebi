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
      attendance: {
        Row: {
          attendant_id: string
          created_by: string
          date: string | null
          event: string | null
          id: number
          session: string
        }
        Insert: {
          attendant_id: string
          created_by: string
          date?: string | null
          event?: string | null
          id?: number
          session: string
        }
        Update: {
          attendant_id?: string
          created_by?: string
          date?: string | null
          event?: string | null
          id?: number
          session?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_attendant_id_fkey"
            columns: ["attendant_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          allow_admins: boolean | null
          allow_attendance: boolean | null
          allow_notifications: boolean | null
          allow_schedule: boolean | null
          allow_users: boolean | null
          created_at: string | null
          email: string | null
          id: string
          is_admin: boolean | null
        }
        Insert: {
          allow_admins?: boolean | null
          allow_attendance?: boolean | null
          allow_notifications?: boolean | null
          allow_schedule?: boolean | null
          allow_users?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
        }
        Update: {
          allow_admins?: boolean | null
          allow_attendance?: boolean | null
          allow_notifications?: boolean | null
          allow_schedule?: boolean | null
          allow_users?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
