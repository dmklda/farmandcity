export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          permissions: Json
          role: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          permissions?: Json
          role?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          permissions?: Json
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      booster_packs: {
        Row: {
          cards_count: number | null
          created_at: string | null
          description: string | null
          guaranteed_rarity: Database["public"]["Enums"]["card_rarity"] | null
          id: string
          is_active: boolean | null
          name: string
          price_coins: number
        }
        Insert: {
          cards_count?: number | null
          created_at?: string | null
          description?: string | null
          guaranteed_rarity?: Database["public"]["Enums"]["card_rarity"] | null
          id?: string
          is_active?: boolean | null
          name: string
          price_coins: number
        }
        Update: {
          cards_count?: number | null
          created_at?: string | null
          description?: string | null
          guaranteed_rarity?: Database["public"]["Enums"]["card_rarity"] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_coins?: number
        }
        Relationships: []
      }
      cards: {
        Row: {
          art_url: string | null
          cost_coins: number | null
          cost_food: number | null
          cost_materials: number | null
          cost_population: number | null
          created_at: string | null
          created_by: string | null
          effect: string
          effect_logic: string | null
          frame_url: string | null
          id: string
          is_active: boolean | null
          is_reactive: boolean | null
          name: string
          phase: Database["public"]["Enums"]["game_phase"]
          rarity: Database["public"]["Enums"]["card_rarity"]
          slug: string
          tags: string[] | null
          type: Database["public"]["Enums"]["card_type"]
          updated_at: string | null
          use_per_turn: number | null
        }
        Insert: {
          art_url?: string | null
          cost_coins?: number | null
          cost_food?: number | null
          cost_materials?: number | null
          cost_population?: number | null
          created_at?: string | null
          created_by?: string | null
          effect: string
          effect_logic?: string | null
          frame_url?: string | null
          id?: string
          is_active?: boolean | null
          is_reactive?: boolean | null
          name: string
          phase: Database["public"]["Enums"]["game_phase"]
          rarity: Database["public"]["Enums"]["card_rarity"]
          slug: string
          tags?: string[] | null
          type: Database["public"]["Enums"]["card_type"]
          updated_at?: string | null
          use_per_turn?: number | null
        }
        Update: {
          art_url?: string | null
          cost_coins?: number | null
          cost_food?: number | null
          cost_materials?: number | null
          cost_population?: number | null
          created_at?: string | null
          created_by?: string | null
          effect?: string
          effect_logic?: string | null
          frame_url?: string | null
          id?: string
          is_active?: boolean | null
          is_reactive?: boolean | null
          name?: string
          phase?: Database["public"]["Enums"]["game_phase"]
          rarity?: Database["public"]["Enums"]["card_rarity"]
          slug?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["card_type"]
          updated_at?: string | null
          use_per_turn?: number | null
        }
        Relationships: []
      }
      game_history: {
        Row: {
          buildings_built: number
          completed_at: string
          final_score: number
          game_duration_minutes: number | null
          id: string
          landmarks_built: number
          player_id: string
          resources_final: Json
          turns_played: number
        }
        Insert: {
          buildings_built?: number
          completed_at?: string
          final_score: number
          game_duration_minutes?: number | null
          id?: string
          landmarks_built?: number
          player_id: string
          resources_final: Json
          turns_played: number
        }
        Update: {
          buildings_built?: number
          completed_at?: string
          final_score?: number
          game_duration_minutes?: number | null
          id?: string
          landmarks_built?: number
          player_id?: string
          resources_final?: Json
          turns_played?: number
        }
        Relationships: []
      }
      game_settings: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      game_stats: {
        Row: {
          card_id: string | null
          id: string
          last_used: string | null
          times_used: number | null
          user_id: string | null
          wins_with_card: number | null
        }
        Insert: {
          card_id?: string | null
          id?: string
          last_used?: string | null
          times_used?: number | null
          user_id?: string | null
          wins_with_card?: number | null
        }
        Update: {
          card_id?: string | null
          id?: string
          last_used?: string | null
          times_used?: number | null
          user_id?: string | null
          wins_with_card?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_stats_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          game_state: Json
          id: string
          is_finished: boolean
          phase: string
          player_id: string
          score: number
          turn: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_state: Json
          id?: string
          is_finished?: boolean
          phase?: string
          player_id: string
          score?: number
          turn?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_state?: Json
          id?: string
          is_finished?: boolean
          phase?: string
          player_id?: string
          score?: number
          turn?: number
          updated_at?: string
        }
        Relationships: []
      }
      pack_purchases: {
        Row: {
          cards_received: Json | null
          id: string
          pack_id: string | null
          purchased_at: string | null
          user_id: string | null
        }
        Insert: {
          cards_received?: Json | null
          id?: string
          pack_id?: string | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards_received?: Json | null
          id?: string
          pack_id?: string | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pack_purchases_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "booster_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      player_cards: {
        Row: {
          card_id: string
          id: string
          player_id: string
          quantity: number
          unlocked_at: string
        }
        Insert: {
          card_id: string
          id?: string
          player_id: string
          quantity?: number
          unlocked_at?: string
        }
        Update: {
          card_id?: string
          id?: string
          player_id?: string
          quantity?: number
          unlocked_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reports_generated: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_url: string | null
          generated_by: string | null
          id: string
          parameters: Json | null
          report_name: string
          report_type: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_name: string
          report_type: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json | null
          report_name?: string
          report_type?: string
          status?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          description: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          event_description: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_system_event: {
        Args: {
          p_event_type: string
          p_description: string
          p_user_id?: string
          p_metadata?: Json
          p_severity?: string
        }
        Returns: string
      }
    }
    Enums: {
      card_rarity:
        | "common"
        | "uncommon"
        | "rare"
        | "ultra"
        | "secret"
        | "legendary"
        | "crisis"
        | "booster"
      card_type:
        | "farm"
        | "city"
        | "action"
        | "magic"
        | "defense"
        | "trap"
        | "event"
        | "landmark"
      game_phase: "draw" | "action" | "reaction"
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
      card_rarity: [
        "common",
        "uncommon",
        "rare",
        "ultra",
        "secret",
        "legendary",
        "crisis",
        "booster",
      ],
      card_type: [
        "farm",
        "city",
        "action",
        "magic",
        "defense",
        "trap",
        "event",
        "landmark",
      ],
      game_phase: ["draw", "action", "reaction"],
    },
  },
} as const
