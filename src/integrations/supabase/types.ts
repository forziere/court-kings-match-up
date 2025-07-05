export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          booking_date: string
          booking_time: string
          created_at: string | null
          facility_id: string | null
          id: string
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          booking_date: string
          booking_time: string
          created_at?: string | null
          facility_id?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          facility_id?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "sports_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          room_id: string | null
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          room_id?: string | null
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          room_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          match_date: string
          notes: string | null
          player1_id: string
          player1_score: number | null
          player2_id: string | null
          player2_score: number | null
          status: string | null
          winner_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          match_date: string
          notes?: string | null
          player1_id: string
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          match_date?: string
          notes?: string | null
          player1_id?: string
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          status?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_facilities: {
        Row: {
          available_hours: string[] | null
          city: string
          created_at: string | null
          features: string[] | null
          id: string
          image_url: string | null
          location: string
          name: string
          price_per_hour: number
          rating: number | null
          sport: string
          updated_at: string | null
        }
        Insert: {
          available_hours?: string[] | null
          city: string
          created_at?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          price_per_hour: number
          rating?: number | null
          sport: string
          updated_at?: string | null
        }
        Update: {
          available_hours?: string[] | null
          city?: string
          created_at?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          price_per_hour?: number
          rating?: number | null
          sport?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          achievements: string[] | null
          badges: string[] | null
          created_at: string | null
          draws: number | null
          games_played: number | null
          id: string
          level: number | null
          losses: number | null
          points: number | null
          updated_at: string | null
          user_id: string
          wins: number | null
        }
        Insert: {
          achievements?: string[] | null
          badges?: string[] | null
          created_at?: string | null
          draws?: number | null
          games_played?: number | null
          id?: string
          level?: number | null
          losses?: number | null
          points?: number | null
          updated_at?: string | null
          user_id: string
          wins?: number | null
        }
        Update: {
          achievements?: string[] | null
          badges?: string[] | null
          created_at?: string | null
          draws?: number | null
          games_played?: number | null
          id?: string
          level?: number | null
          losses?: number | null
          points?: number | null
          updated_at?: string | null
          user_id?: string
          wins?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          city: string | null
          created_at: string | null
          email: string
          id: string
          level: string
          name: string
          payment_status: string | null
          registration_fee_paid: boolean | null
          sport: string
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          level: string
          name: string
          payment_status?: string | null
          registration_fee_paid?: boolean | null
          sport: string
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          level?: string
          name?: string
          payment_status?: string | null
          registration_fee_paid?: boolean | null
          sport?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
