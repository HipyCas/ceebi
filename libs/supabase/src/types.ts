export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          attendant_id: string
          created_by: string
          date: string | null
          event: string
          id: number
          session: string
        }
        Insert: {
          attendant_id: string
          created_by: string
          date?: string | null
          event: string
          id?: number
          session: string
        }
        Update: {
          attendant_id?: string
          created_by?: string
          date?: string | null
          event?: string
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
      notifications: {
        Row: {
          body: string | null
          buttons: Json[] | null
          created_at: string | null
          icon: string | null
          id: number
          schedule: string | null
          shortname: string | null
          title: string | null
        }
        Insert: {
          body?: string | null
          buttons?: Json[] | null
          created_at?: string | null
          icon?: string | null
          id?: number
          schedule?: string | null
          shortname?: string | null
          title?: string | null
        }
        Update: {
          body?: string | null
          buttons?: Json[] | null
          created_at?: string | null
          icon?: string | null
          id?: number
          schedule?: string | null
          shortname?: string | null
          title?: string | null
        }
        Relationships: []
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
