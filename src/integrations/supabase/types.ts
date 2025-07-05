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
          cancelled_reason: string | null
          confirmed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          end_time: string
          extras_selected: Json | null
          facility_id: string | null
          id: string
          qr_code: string | null
          start_time: string
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          booking_date: string
          booking_time: string
          cancelled_reason?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string
          extras_selected?: Json | null
          facility_id?: string | null
          id?: string
          qr_code?: string | null
          start_time?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_time?: string
          cancelled_reason?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string
          extras_selected?: Json | null
          facility_id?: string | null
          id?: string
          qr_code?: string | null
          start_time?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number | null
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
      facility_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          facility_id: string | null
          id: string
          is_available: boolean | null
          price_multiplier: number | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          facility_id?: string | null
          id?: string
          is_available?: boolean | null
          price_multiplier?: number | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          facility_id?: string | null
          id?: string
          is_available?: boolean | null
          price_multiplier?: number | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_availability_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "sports_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_exceptions: {
        Row: {
          created_at: string | null
          end_time: string | null
          exception_date: string
          facility_id: string | null
          id: string
          is_available: boolean | null
          price_multiplier: number | null
          reason: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          exception_date: string
          facility_id?: string | null
          id?: string
          is_available?: boolean | null
          price_multiplier?: number | null
          reason?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          exception_date?: string
          facility_id?: string | null
          id?: string
          is_available?: boolean | null
          price_multiplier?: number | null
          reason?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_exceptions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "sports_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      match_participants: {
        Row: {
          confirmed_at: string | null
          id: string
          joined_at: string | null
          match_id: string | null
          qr_confirmed: boolean | null
          status: string | null
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          id?: string
          joined_at?: string | null
          match_id?: string | null
          qr_confirmed?: boolean | null
          status?: string | null
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          id?: string
          joined_at?: string | null
          match_id?: string | null
          qr_confirmed?: boolean | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          auto_match: boolean | null
          booking_id: string | null
          created_at: string | null
          current_players: number | null
          id: string
          is_public: boolean | null
          join_code: string | null
          location_notes: string | null
          match_date: string
          match_type: string | null
          max_players: number | null
          notes: string | null
          player1_id: string
          player1_score: number | null
          player2_id: string | null
          player2_score: number | null
          skill_level_required: string | null
          status: string | null
          winner_id: string | null
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          auto_match?: boolean | null
          booking_id?: string | null
          created_at?: string | null
          current_players?: number | null
          id?: string
          is_public?: boolean | null
          join_code?: string | null
          location_notes?: string | null
          match_date: string
          match_type?: string | null
          max_players?: number | null
          notes?: string | null
          player1_id: string
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          skill_level_required?: string | null
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          auto_match?: boolean | null
          booking_id?: string | null
          created_at?: string | null
          current_players?: number | null
          id?: string
          is_public?: boolean | null
          join_code?: string | null
          location_notes?: string | null
          match_date?: string
          match_type?: string | null
          max_players?: number | null
          notes?: string | null
          player1_id?: string
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          skill_level_required?: string | null
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
      sports_centers: {
        Row: {
          address: string
          city: string
          created_at: string | null
          email: string | null
          id: string
          manager_id: string | null
          name: string
          phone: string | null
          settings: Json | null
          subscription_type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          email?: string | null
          id?: string
          manager_id?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          subscription_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          email?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          subscription_type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_centers_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_facilities: {
        Row: {
          available_hours: string[] | null
          base_price_per_30min: number | null
          booking_rules: Json | null
          center_id: string | null
          city: string
          created_at: string | null
          extras: Json | null
          features: string[] | null
          id: string
          image_url: string | null
          location: string
          manager_id: string | null
          max_advance_days: number | null
          min_advance_hours: number | null
          name: string
          price_per_hour: number
          price_rules: Json | null
          rating: number | null
          sport: string
          time_slots: Json | null
          updated_at: string | null
        }
        Insert: {
          available_hours?: string[] | null
          base_price_per_30min?: number | null
          booking_rules?: Json | null
          center_id?: string | null
          city: string
          created_at?: string | null
          extras?: Json | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location: string
          manager_id?: string | null
          max_advance_days?: number | null
          min_advance_hours?: number | null
          name: string
          price_per_hour: number
          price_rules?: Json | null
          rating?: number | null
          sport: string
          time_slots?: Json | null
          updated_at?: string | null
        }
        Update: {
          available_hours?: string[] | null
          base_price_per_30min?: number | null
          booking_rules?: Json | null
          center_id?: string | null
          city?: string
          created_at?: string | null
          extras?: Json | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location?: string
          manager_id?: string | null
          max_advance_days?: number | null
          min_advance_hours?: number | null
          name?: string
          price_per_hour?: number
          price_rules?: Json | null
          rating?: number | null
          sport?: string
          time_slots?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_facilities_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "sports_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sports_facilities_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          achievements: string[] | null
          age: number | null
          availability_notes: string | null
          badges: string[] | null
          created_at: string | null
          draws: number | null
          elo_rating: number | null
          games_played: number | null
          id: string
          last_match_date: string | null
          level: number | null
          losses: number | null
          points: number | null
          preferred_times: string[] | null
          profile_photo_url: string | null
          skill_level: string | null
          skill_validated_by: string | null
          updated_at: string | null
          user_id: string
          wins: number | null
        }
        Insert: {
          achievements?: string[] | null
          age?: number | null
          availability_notes?: string | null
          badges?: string[] | null
          created_at?: string | null
          draws?: number | null
          elo_rating?: number | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          level?: number | null
          losses?: number | null
          points?: number | null
          preferred_times?: string[] | null
          profile_photo_url?: string | null
          skill_level?: string | null
          skill_validated_by?: string | null
          updated_at?: string | null
          user_id: string
          wins?: number | null
        }
        Update: {
          achievements?: string[] | null
          age?: number | null
          availability_notes?: string | null
          badges?: string[] | null
          created_at?: string | null
          draws?: number | null
          elo_rating?: number | null
          games_played?: number | null
          id?: string
          last_match_date?: string | null
          level?: number | null
          losses?: number | null
          points?: number | null
          preferred_times?: string[] | null
          profile_photo_url?: string | null
          skill_level?: string | null
          skill_validated_by?: string | null
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
