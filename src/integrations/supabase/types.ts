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
      card_copy_limits: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          max_copies: number
          rarity: Database["public"]["Enums"]["card_rarity"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_copies: number
          rarity: Database["public"]["Enums"]["card_rarity"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_copies?: number
          rarity?: Database["public"]["Enums"]["card_rarity"]
          updated_at?: string | null
        }
        Relationships: []
      }
      card_purchases: {
        Row: {
          card_id: string | null
          currency_type: string
          discount_percentage: number | null
          event_id: string | null
          id: string
          player_id: string | null
          price_coins: number | null
          price_gems: number | null
          purchased_at: string | null
        }
        Insert: {
          card_id?: string | null
          currency_type?: string
          discount_percentage?: number | null
          event_id?: string | null
          id?: string
          player_id?: string | null
          price_coins?: number | null
          price_gems?: number | null
          purchased_at?: string | null
        }
        Update: {
          card_id?: string | null
          currency_type?: string
          discount_percentage?: number | null
          event_id?: string | null
          id?: string
          player_id?: string | null
          price_coins?: number | null
          price_gems?: number | null
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_purchases_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "shop_events"
            referencedColumns: ["id"]
          },
        ]
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
          is_starter: boolean | null
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
          is_starter?: boolean | null
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
          is_starter?: boolean | null
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
      catastrophes: {
        Row: {
          created_at: string | null
          description: string
          effect_data: Json
          effect_type: string
          id: string
          is_active: boolean | null
          name: string
          rarity: string
          trigger_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          effect_data: Json
          effect_type: string
          id?: string
          is_active?: boolean | null
          name: string
          rarity: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          effect_data?: Json
          effect_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_rotation_cards: {
        Row: {
          card_id: string | null
          created_at: string | null
          currency_type: string
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          price_coins: number | null
          price_gems: number | null
          rotation_date: string
          slot_type: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string | null
          currency_type?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          price_coins?: number | null
          price_gems?: number | null
          rotation_date: string
          slot_type?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string | null
          currency_type?: string
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          price_coins?: number | null
          price_gems?: number | null
          rotation_date?: string
          slot_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_rotation_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_rotation_templates: {
        Row: {
          common_card_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          landmark_card_id: string | null
          legendary_card_id: string | null
          magic_card_id: string | null
          rare_card_id: string | null
          rotation_date: string
          updated_at: string | null
        }
        Insert: {
          common_card_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landmark_card_id?: string | null
          legendary_card_id?: string | null
          magic_card_id?: string | null
          rare_card_id?: string | null
          rotation_date: string
          updated_at?: string | null
        }
        Update: {
          common_card_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landmark_card_id?: string | null
          legendary_card_id?: string | null
          magic_card_id?: string | null
          rare_card_id?: string | null
          rotation_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_rotation_templates_common_card_id_fkey"
            columns: ["common_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rotation_templates_landmark_card_id_fkey"
            columns: ["landmark_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rotation_templates_legendary_card_id_fkey"
            columns: ["legendary_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rotation_templates_magic_card_id_fkey"
            columns: ["magic_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_rotation_templates_rare_card_id_fkey"
            columns: ["rare_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      game_catastrophes: {
        Row: {
          catastrophe_id: string | null
          created_at: string | null
          effect_applied: Json
          game_id: string | null
          id: string
          resolved: boolean | null
          resolved_at: string | null
          turn_triggered: number
        }
        Insert: {
          catastrophe_id?: string | null
          created_at?: string | null
          effect_applied: Json
          game_id?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          turn_triggered: number
        }
        Update: {
          catastrophe_id?: string | null
          created_at?: string | null
          effect_applied?: Json
          game_id?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          turn_triggered?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_catastrophes_catastrophe_id_fkey"
            columns: ["catastrophe_id"]
            isOneToOne: false
            referencedRelation: "catastrophes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_catastrophes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
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
      missions: {
        Row: {
          created_at: string | null
          description: string
          difficulty: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          mission_type: string
          name: string
          requirements: Json
          rewards: Json
        }
        Insert: {
          created_at?: string | null
          description: string
          difficulty: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          mission_type: string
          name: string
          requirements: Json
          rewards: Json
        }
        Update: {
          created_at?: string | null
          description?: string
          difficulty?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          mission_type?: string
          name?: string
          requirements?: Json
          rewards?: Json
        }
        Relationships: []
      }
      pack_purchase_tracking: {
        Row: {
          created_at: string | null
          first_purchase_at: string | null
          id: string
          last_purchase_at: string | null
          pack_id: string
          purchase_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_purchase_at?: string | null
          id?: string
          last_purchase_at?: string | null
          pack_id: string
          purchase_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_purchase_at?: string | null
          id?: string
          last_purchase_at?: string | null
          pack_id?: string
          purchase_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_purchase_tracking_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
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
      player_currency: {
        Row: {
          coins: number | null
          created_at: string | null
          experience_points: number | null
          gems: number | null
          id: string
          level: number | null
          player_id: string
          updated_at: string | null
        }
        Insert: {
          coins?: number | null
          created_at?: string | null
          experience_points?: number | null
          gems?: number | null
          id?: string
          level?: number | null
          player_id: string
          updated_at?: string | null
        }
        Update: {
          coins?: number | null
          created_at?: string | null
          experience_points?: number | null
          gems?: number | null
          id?: string
          level?: number | null
          player_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      player_decks: {
        Row: {
          card_ids: string[]
          created_at: string
          id: string
          is_active: boolean
          is_starter_deck: boolean | null
          name: string
          player_id: string
          updated_at: string
        }
        Insert: {
          card_ids?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          is_starter_deck?: boolean | null
          name: string
          player_id: string
          updated_at?: string
        }
        Update: {
          card_ids?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          is_starter_deck?: boolean | null
          name?: string
          player_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_missions: {
        Row: {
          claimed_rewards: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          mission_id: string
          player_id: string
          progress: number | null
          updated_at: string | null
        }
        Insert: {
          claimed_rewards?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          mission_id: string
          player_id: string
          progress?: number | null
          updated_at?: string | null
        }
        Update: {
          claimed_rewards?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          mission_id?: string
          player_id?: string
          progress?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
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
      shop_events: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          card_ids: string[] | null
          cards_per_pack: number | null
          created_at: string | null
          currency_type: string
          description: string | null
          discount_percentage: number | null
          event_id: string | null
          guaranteed_cards: Json | null
          id: string
          is_active: boolean | null
          is_daily_rotation: boolean | null
          is_limited: boolean | null
          item_type: string
          max_purchases_per_user: number | null
          name: string
          pack_conditions: Json | null
          pack_type: string | null
          price_coins: number | null
          price_gems: number | null
          price_dollars: number | null
          purchase_time_limit: unknown | null
          rarity: string | null
          rotation_date: string | null
          sold_quantity: number | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          card_ids?: string[] | null
          cards_per_pack?: number | null
          created_at?: string | null
          currency_type?: string
          description?: string | null
          discount_percentage?: number | null
          event_id?: string | null
          guaranteed_cards?: Json | null
          id?: string
          is_active?: boolean | null
          is_daily_rotation?: boolean | null
          is_limited?: boolean | null
          item_type: string
          max_purchases_per_user?: number | null
          name: string
          pack_conditions?: Json | null
          pack_type?: string | null
          price_coins?: number | null
          price_gems?: number | null
          purchase_time_limit?: unknown | null
          rarity?: string | null
          rotation_date?: string | null
          sold_quantity?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          card_ids?: string[] | null
          cards_per_pack?: number | null
          created_at?: string | null
          currency_type?: string
          description?: string | null
          discount_percentage?: number | null
          event_id?: string | null
          guaranteed_cards?: Json | null
          id?: string
          is_active?: boolean | null
          is_daily_rotation?: boolean | null
          is_limited?: boolean | null
          item_type?: string
          max_purchases_per_user?: number | null
          name?: string
          pack_conditions?: Json | null
          pack_type?: string | null
          price_coins?: number | null
          price_gems?: number | null
          purchase_time_limit?: unknown | null
          rarity?: string | null
          rotation_date?: string | null
          sold_quantity?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_purchases: {
        Row: {
          event_id: string | null
          id: string
          item_id: string | null
          item_type: string
          items_received: Json | null
          player_id: string | null
          purchased_at: string | null
          quantity: number | null
          total_price_coins: number | null
          total_price_gems: number | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          item_id?: string | null
          item_type: string
          items_received?: Json | null
          player_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          total_price_coins?: number | null
          total_price_gems?: number | null
        }
        Update: {
          event_id?: string | null
          id?: string
          item_id?: string | null
          item_type?: string
          items_received?: Json | null
          player_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          total_price_coins?: number | null
          total_price_gems?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_purchases_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "shop_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      special_events: {
        Row: {
          bonuses: Json | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          name: string
          special_items: string[] | null
          start_date: string
        }
        Insert: {
          bonuses?: Json | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          name: string
          special_items?: string[] | null
          start_date: string
        }
        Update: {
          bonuses?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          special_items?: string[] | null
          start_date?: string
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
      battlefield_customizations: {
        Row: {
          created_at: string | null
          currency_type: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          is_special: boolean | null
          name: string
          price_coins: number | null
          price_gems: number | null
          rarity: string | null
        }
        Insert: {
          created_at?: string | null
          currency_type?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          is_special?: boolean | null
          name: string
          price_coins?: number | null
          price_gems?: number | null
          rarity?: string | null
        }
        Update: {
          created_at?: string | null
          currency_type?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          is_special?: boolean | null
          name?: string
          price_coins?: number | null
          price_gems?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_save_enabled: boolean | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          language: string | null
          music_enabled: boolean | null
          notifications_enabled: boolean | null
          sound_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          auto_save_enabled?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          language?: string | null
          music_enabled?: boolean | null
          notifications_enabled?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          auto_save_enabled?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          language?: string | null
          music_enabled?: boolean | null
          notifications_enabled?: boolean | null
          sound_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_customizations: {
        Row: {
          customization_id: string | null
          id: string
          is_equipped: boolean | null
          purchased_at: string | null
          user_id: string | null
        }
        Insert: {
          customization_id?: string | null
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Update: {
          customization_id?: string | null
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_customizations_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "battlefield_customizations"
            referencedColumns: ["id"]
          }
        ]
      }
      container_customizations: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          container_type: string
          rarity: string | null
          price_coins: number | null
          price_gems: number | null
          currency_type: string | null
          is_active: boolean | null
          is_special: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          container_type: string
          rarity?: string | null
          price_coins?: number | null
          price_gems?: number | null
          currency_type?: string | null
          is_active?: boolean | null
          is_special?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          container_type?: string
          rarity?: string | null
          price_coins?: number | null
          price_gems?: number | null
          currency_type?: string | null
          is_active?: boolean | null
          is_special?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_container_customizations: {
        Row: {
          id: string
          user_id: string | null
          customization_id: string | null
          container_type: string
          is_equipped: boolean | null
          purchased_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          customization_id?: string | null
          container_type: string
          is_equipped?: boolean | null
          purchased_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          customization_id?: string | null
          container_type?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_container_customizations_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "container_customizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_player_deck: {
        Args: { deck_id: string }
        Returns: undefined
      }
      add_cards_to_collection: {
        Args: { p_user_id: string; p_card_ids: string[] }
        Returns: undefined
      }
      check_is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_active_shop_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          event_type: string
          discount_percentage: number
        }[]
      }
      get_daily_rotation_cards: {
        Args: { p_date?: string }
        Returns: {
          card_id: string
          card_name: string
          card_type: string
          card_rarity: string
          price_coins: number
          price_gems: number
          currency_type: string
          discount_percentage: number
        }[]
      }
      get_starter_card_id: {
        Args: { card_slug: string }
        Returns: string
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
      open_pack: {
        Args: { pack_id: string }
        Returns: Json
      }
      purchase_pack: {
        Args: { pack_id: string }
        Returns: Json
      }
      test_card_copy_limits: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test_open_pack: {
        Args: { pack_id: string }
        Returns: Json
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
        | "landmark"
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
        "landmark",
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
