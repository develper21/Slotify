export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointment_images: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_images_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_images_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_settings: {
        Row: {
          appointment_id: string
          auto_assignment: boolean
          auto_confirmation: boolean
          capacity_enabled: boolean
          confirmation_message: string | null
          created_at: string
          currency: string
          id: string
          introduction_message: string | null
          manual_confirmation: boolean
          max_capacity: number
          meeting_instructions: string | null
          meeting_type: string
          min_capacity: number
          paid_booking: boolean
          price: number
          updated_at: string
        }
        Insert: {
          appointment_id: string
          auto_assignment?: boolean
          auto_confirmation?: boolean
          capacity_enabled?: boolean
          confirmation_message?: string | null
          created_at?: string
          currency?: string
          id?: string
          introduction_message?: string | null
          manual_confirmation?: boolean
          max_capacity?: number
          meeting_instructions?: string | null
          meeting_type?: string
          min_capacity?: number
          paid_booking?: boolean
          price?: number
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          auto_assignment?: boolean
          auto_confirmation?: boolean
          capacity_enabled?: boolean
          confirmation_message?: string | null
          created_at?: string
          currency?: string
          id?: string
          introduction_message?: string | null
          manual_confirmation?: boolean
          max_capacity?: number
          meeting_instructions?: string | null
          meeting_type?: string
          min_capacity?: number
          paid_booking?: boolean
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_settings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_settings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          booking_enabled: boolean
          created_at: string
          description: string | null
          duration: unknown
          id: string
          images: Json | null
          location: string | null
          location_details: string | null
          location_type: Database["public"]["Enums"]["appointment_location_type"]
          organizer_id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          booking_enabled?: boolean
          created_at?: string
          description?: string | null
          duration?: unknown
          id?: string
          images?: Json | null
          location?: string | null
          location_details?: string | null
          location_type?: Database["public"]["Enums"]["appointment_location_type"]
          organizer_id: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          booking_enabled?: boolean
          created_at?: string
          description?: string | null
          duration?: unknown
          id?: string
          images?: Json | null
          location?: string | null
          location_details?: string | null
          location_type?: Database["public"]["Enums"]["appointment_location_type"]
          organizer_id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_answers: {
        Row: {
          answer_text: string
          booking_id: string
          created_at: string
          id: string
          question_id: string
        }
        Insert: {
          answer_text: string
          booking_id: string
          created_at?: string
          id?: string
          question_id: string
        }
        Update: {
          answer_text?: string
          booking_id?: string
          created_at?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_answers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "booking_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_questions: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          is_mandatory: boolean
          options: Json | null
          order_index: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          is_mandatory?: boolean
          options?: Json | null
          order_index?: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          is_mandatory?: boolean
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_questions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_questions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          appointment_id: string
          booking_date: string
          created_at: string
          customer_notes: string | null
          guest_count: number
          id: string
          slot_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          booking_date?: string
          created_at?: string
          customer_notes?: string | null
          guest_count?: number
          id?: string
          slot_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          booking_date?: string
          created_at?: string
          customer_notes?: string | null
          guest_count?: number
          id?: string
          slot_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      organizers: {
        Row: {
          approved: boolean
          business_name: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          approved?: boolean
          business_name: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          approved?: boolean
          business_name?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          purpose: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          otp: string
          purpose: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          purpose?: string
          verified?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          provider: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          provider?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          provider?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          appointment_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_working_day: boolean
          start_time: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_working_day?: boolean
          start_time: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_working_day?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          appointment_id: string
          available_capacity: number | null
          created_at: string
          current_bookings: number
          end_time: string
          id: string
          max_capacity: number
          slot_date: string
          start_time: string
        }
        Insert: {
          appointment_id: string
          available_capacity?: number | null
          created_at?: string
          current_bookings?: number
          end_time: string
          id?: string
          max_capacity?: number
          slot_date: string
          start_time: string
        }
        Update: {
          appointment_id?: string
          available_capacity?: number | null
          created_at?: string
          current_bookings?: number
          end_time?: string
          id?: string
          max_capacity?: number
          slot_date?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_slots_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      appointment_details_view: {
        Row: {
          booking_enabled: boolean | null
          business_name: string | null
          confirmation_message: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: unknown
          id: string | null
          images: Json | null
          introduction_message: string | null
          location: string | null
          location_details: string | null
          location_type:
            | Database["public"]["Enums"]["appointment_location_type"]
            | null
          meeting_instructions: string | null
          organizer_id: string | null
          organizer_logo: string | null
          price: number | null
          published: boolean | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      book_slot: {
        Args: { p_guest_count?: number; p_slot_id: string; p_user_id: string }
        Returns: string
      }
      decrement_slot_capacity: {
        Args: { p_amount?: number; p_slot_id: string }
        Returns: undefined
      }
      generate_slots: {
        Args: {
          p_appointment_id: string
          p_end_date: string
          p_start_date: string
        }
        Returns: number
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      appointment_location_type: "online" | "offline"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      question_type:
        | "single_line"
        | "multi_line"
        | "phone"
        | "radio"
        | "checkbox"
      user_role: "customer" | "organizer" | "admin"
      user_status: "active" | "inactive" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_location_type: ["online", "offline"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      question_type: [
        "single_line",
        "multi_line",
        "phone",
        "radio",
        "checkbox",
      ],
      user_role: ["customer", "organizer", "admin"],
      user_status: ["active", "inactive", "banned"],
    },
  },
} as const
