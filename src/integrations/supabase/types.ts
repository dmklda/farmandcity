export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievement_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          max_progress: number | null
          progress_type: string | null
          rarity: string
          requirement_value: number
          reward_coins: number | null
          reward_gems: number | null
          title: string
          type: string
          unlock_condition: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          max_progress?: number | null
          progress_type?: string | null
          rarity?: string
          requirement_value: number
          reward_coins?: number | null
          reward_gems?: number | null
          title: string
          type: string
          unlock_condition?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          max_progress?: number | null
          progress_type?: string | null
          rarity?: string
          requirement_value?: number
          reward_coins?: number | null
          reward_gems?: number | null
          title?: string
          type?: string
          unlock_condition?: Json | null
        }
        Relationships: []
      }
      active_daily_missions: {
        Row: {
          created_at: string | null
          day_date: string
          id: string
          is_active: boolean | null
          mission_id: string
        }
        Insert: {
          created_at?: string | null
          day_date: string
          id?: string
          is_active?: boolean | null
          mission_id: string
        }
        Update: {
          created_at?: string | null
          day_date?: string
          id?: string
          is_active?: boolean | null
          mission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_daily_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      active_weekly_missions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          mission_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mission_id: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mission_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_weekly_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      background_purchases: {
        Row: {
          amount_paid: number
          background_id: string | null
          created_at: string | null
          currency_used: string
          id: string
          purchase_type: string | null
          purchased_at: string | null
          real_money_amount: number | null
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          background_id?: string | null
          created_at?: string | null
          currency_used: string
          id?: string
          purchase_type?: string | null
          purchased_at?: string | null
          real_money_amount?: number | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          background_id?: string | null
          created_at?: string | null
          currency_used?: string
          id?: string
          purchase_type?: string | null
          purchased_at?: string | null
          real_money_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "background_purchases_background_id_fkey"
            columns: ["background_id"]
            isOneToOne: false
            referencedRelation: "battlefield_customizations"
            referencedColumns: ["id"]
          },
        ]
      }
      battlefield_customizations: {
        Row: {
          created_at: string | null
          currency_type: string | null
          description: string | null
          id: string
          image_url: string | null
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
          image_url?: string | null
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
          image_url?: string | null
          is_active?: boolean | null
          is_special?: boolean | null
          name?: string
          price_coins?: number | null
          price_gems?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          likes_count: number | null
          published_at: string | null
          read_time_minutes: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          likes_count?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      blog_views: {
        Row: {
          id: string
          ip_address: unknown
          post_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown
          post_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown
          post_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
      community_likes: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      community_rankings: {
        Row: {
          contributions_count: number | null
          id: string
          last_updated: string | null
          level: number | null
          ranking_type: string
          score: number | null
          user_id: string
        }
        Insert: {
          contributions_count?: number | null
          id?: string
          last_updated?: string | null
          level?: number | null
          ranking_type: string
          score?: number | null
          user_id: string
        }
        Update: {
          contributions_count?: number | null
          id?: string
          last_updated?: string | null
          level?: number | null
          ranking_type?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          likes_count: number | null
          parent_reply_id: string | null
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          parent_reply_id?: string | null
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          likes_count?: number | null
          parent_reply_id?: string | null
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          replies_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      community_views: {
        Row: {
          id: string
          ip_address: unknown
          topic_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown
          topic_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown
          topic_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_views_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      container_customizations: {
        Row: {
          container_type: string | null
          created_at: string | null
          currency_type: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_special: boolean | null
          name: string
          price_coins: number | null
          price_gems: number | null
          rarity: string | null
        }
        Insert: {
          container_type?: string | null
          created_at?: string | null
          currency_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_special?: boolean | null
          name: string
          price_coins?: number | null
          price_gems?: number | null
          rarity?: string | null
        }
        Update: {
          container_type?: string | null
          created_at?: string | null
          currency_type?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_special?: boolean | null
          name?: string
          price_coins?: number | null
          price_gems?: number | null
          rarity?: string | null
        }
        Relationships: []
      }
      currency_purchases: {
        Row: {
          amount_coins: number | null
          amount_gems: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          item_id: string
          item_name: string
          player_id: string
          price_dollars: number
          purchased_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_coins?: number | null
          amount_gems?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_name: string
          player_id: string
          price_dollars: number
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_coins?: number | null
          amount_gems?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_name?: string
          player_id?: string
          price_dollars?: number
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "currency_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_card_purchases: {
        Row: {
          card_id: string
          id: string
          player_id: string
          purchased_at: string | null
          rotation_date: string
        }
        Insert: {
          card_id: string
          id?: string
          player_id: string
          purchased_at?: string | null
          rotation_date: string
        }
        Update: {
          card_id?: string
          id?: string
          player_id?: string
          purchased_at?: string | null
          rotation_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_card_purchases_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_missions: {
        Row: {
          created_at: string | null
          day_date: string
          id: string
          is_active: boolean
          mission_id: string
        }
        Insert: {
          created_at?: string | null
          day_date: string
          id?: string
          is_active?: boolean
          mission_id: string
        }
        Update: {
          created_at?: string | null
          day_date?: string
          id?: string
          is_active?: boolean
          mission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
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
      event_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          event_id: string
          id: string
          total_participants: number | null
          total_rewards_distributed: Json | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          total_participants?: number | null
          total_rewards_distributed?: Json | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          total_participants?: number | null
          total_rewards_distributed?: Json | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "game_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          event_id: string | null
          id: string
          joined_at: string | null
          player_id: string | null
          rewards_claimed: boolean | null
          score: number | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          joined_at?: string | null
          player_id?: string | null
          rewards_claimed?: boolean | null
          score?: number | null
        }
        Update: {
          event_id?: string | null
          id?: string
          joined_at?: string | null
          player_id?: string | null
          rewards_claimed?: boolean | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "game_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rankings: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          event_id: string
          id: string
          player_id: string
          rank: number | null
          rewards_claimed: boolean | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          event_id: string
          id?: string
          player_id: string
          rank?: number | null
          rewards_claimed?: boolean | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          event_id?: string
          id?: string
          player_id?: string
          rank?: number | null
          rewards_claimed?: boolean | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rankings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "game_events"
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
      game_events: {
        Row: {
          auto_rewards: boolean | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string
          entry_fee_coins: number | null
          entry_fee_gems: number | null
          id: string
          leaderboard_type: string | null
          max_level: number | null
          max_participants: number | null
          min_level: number | null
          registration_deadline: string | null
          requirements: Json | null
          rewards: Json | null
          rules: string | null
          start_date: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          auto_rewards?: boolean | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date: string
          entry_fee_coins?: number | null
          entry_fee_gems?: number | null
          id?: string
          leaderboard_type?: string | null
          max_level?: number | null
          max_participants?: number | null
          min_level?: number | null
          registration_deadline?: string | null
          requirements?: Json | null
          rewards?: Json | null
          rules?: string | null
          start_date: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          auto_rewards?: boolean | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string
          entry_fee_coins?: number | null
          entry_fee_gems?: number | null
          id?: string
          leaderboard_type?: string | null
          max_level?: number | null
          max_participants?: number | null
          min_level?: number | null
          registration_deadline?: string | null
          requirements?: Json | null
          rewards?: Json | null
          rules?: string | null
          start_date?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
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
      game_modes: {
        Row: {
          category: string
          color: string
          created_at: string | null
          created_by: string | null
          description: string
          detailed_description: string | null
          difficulty: string
          icon: string
          id: string
          is_active: boolean
          is_test_mode: boolean
          name: string
          requirements: Json | null
          tips: Json | null
          updated_at: string | null
          updated_by: string | null
          victory_mode: string
          victory_value: number
        }
        Insert: {
          category?: string
          color: string
          created_at?: string | null
          created_by?: string | null
          description: string
          detailed_description?: string | null
          difficulty?: string
          icon: string
          id: string
          is_active?: boolean
          is_test_mode?: boolean
          name: string
          requirements?: Json | null
          tips?: Json | null
          updated_at?: string | null
          updated_by?: string | null
          victory_mode: string
          victory_value?: number
        }
        Update: {
          category?: string
          color?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          detailed_description?: string | null
          difficulty?: string
          icon?: string
          id?: string
          is_active?: boolean
          is_test_mode?: boolean
          name?: string
          requirements?: Json | null
          tips?: Json | null
          updated_at?: string | null
          updated_by?: string | null
          victory_mode?: string
          victory_value?: number
        }
        Relationships: []
      }
      game_news: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_published: boolean | null
          priority: string
          published_at: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string
          published_at?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string
          published_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
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
          game_mode: string | null
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
          game_mode?: string | null
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
          game_mode?: string | null
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
      global_announcements: {
        Row: {
          color: string | null
          created_at: string | null
          dismissible: boolean | null
          end_date: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          show_in_game: boolean | null
          show_on_homepage: boolean | null
          start_date: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          dismissible?: boolean | null
          end_date?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          show_in_game?: boolean | null
          show_on_homepage?: boolean | null
          start_date?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          dismissible?: boolean | null
          end_date?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          show_in_game?: boolean | null
          show_on_homepage?: boolean | null
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mission_completion_history: {
        Row: {
          completion_date: string
          created_at: string | null
          id: string
          mission_id: string
          player_id: string
          progress_achieved: number
          rewards_received: Json | null
        }
        Insert: {
          completion_date: string
          created_at?: string | null
          id?: string
          mission_id: string
          player_id: string
          progress_achieved: number
          rewards_received?: Json | null
        }
        Update: {
          completion_date?: string
          created_at?: string | null
          id?: string
          mission_id?: string
          player_id?: string
          progress_achieved?: number
          rewards_received?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_completion_history_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          audience_criteria: Json | null
          auto_reset: boolean | null
          category: string | null
          created_at: string | null
          description: string
          difficulty: string
          end_date: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_repeatable: boolean | null
          max_completions: number | null
          max_daily_completions: number | null
          mission_type: string
          name: string
          requirement_type: string | null
          requirement_value: number | null
          requirements: Json
          reset_interval: unknown
          reward_cards: Json | null
          reward_coins: number | null
          reward_gems: number | null
          rewards: Json
          start_date: string | null
          target_audience: string | null
          title: string | null
        }
        Insert: {
          audience_criteria?: Json | null
          auto_reset?: boolean | null
          category?: string | null
          created_at?: string | null
          description: string
          difficulty: string
          end_date?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_completions?: number | null
          max_daily_completions?: number | null
          mission_type: string
          name: string
          requirement_type?: string | null
          requirement_value?: number | null
          requirements: Json
          reset_interval?: unknown
          reward_cards?: Json | null
          reward_coins?: number | null
          reward_gems?: number | null
          rewards: Json
          start_date?: string | null
          target_audience?: string | null
          title?: string | null
        }
        Update: {
          audience_criteria?: Json | null
          auto_reset?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          end_date?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_repeatable?: boolean | null
          max_completions?: number | null
          max_daily_completions?: number | null
          mission_type?: string
          name?: string
          requirement_type?: string | null
          requirement_value?: number | null
          requirements?: Json
          reset_interval?: unknown
          reward_cards?: Json | null
          reward_coins?: number | null
          reward_gems?: number | null
          rewards?: Json
          start_date?: string | null
          target_audience?: string | null
          title?: string | null
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
      player_achievement_progress: {
        Row: {
          achievement_id: string
          completed_at: string | null
          current_progress: number | null
          id: string
          is_completed: boolean | null
          last_updated: string | null
          player_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          player_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_achievement_progress_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      player_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          is_completed: boolean | null
          player_id: string | null
          progress: number | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          is_completed?: boolean | null
          player_id?: string | null
          progress?: number | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          is_completed?: boolean | null
          player_id?: string | null
          progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
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
      player_mission_progress: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          current_progress: number | null
          daily_completions: number | null
          id: string
          is_completed: boolean | null
          last_completion_date: string | null
          last_updated: string | null
          mission_id: string
          player_id: string
          rewards_claimed: boolean | null
          total_completions: number | null
          weekly_completions: number | null
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          current_progress?: number | null
          daily_completions?: number | null
          id?: string
          is_completed?: boolean | null
          last_completion_date?: string | null
          last_updated?: string | null
          mission_id: string
          player_id: string
          rewards_claimed?: boolean | null
          total_completions?: number | null
          weekly_completions?: number | null
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          current_progress?: number | null
          daily_completions?: number | null
          id?: string
          is_completed?: boolean | null
          last_completion_date?: string | null
          last_updated?: string | null
          mission_id?: string
          player_id?: string
          rewards_claimed?: boolean | null
          total_completions?: number | null
          weekly_completions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      player_missions: {
        Row: {
          claimed_rewards: boolean | null
          completed_at: string | null
          completions_count: number | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_progress_update: string | null
          mission_id: string
          player_id: string
          progress: number | null
          updated_at: string | null
        }
        Insert: {
          claimed_rewards?: boolean | null
          completed_at?: string | null
          completions_count?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_progress_update?: string | null
          mission_id: string
          player_id: string
          progress?: number | null
          updated_at?: string | null
        }
        Update: {
          claimed_rewards?: boolean | null
          completed_at?: string | null
          completions_count?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_progress_update?: string | null
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
      player_pack_purchases: {
        Row: {
          id: string
          pack_id: string
          player_id: string
          purchased_at: string | null
        }
        Insert: {
          id?: string
          pack_id: string
          player_id: string
          purchased_at?: string | null
        }
        Update: {
          id?: string
          pack_id?: string
          player_id?: string
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_pack_purchases_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "special_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          achievements_earned: number | null
          cards_collected: number | null
          created_at: string | null
          decks_created: number | null
          experience_points: number | null
          games_played: number | null
          games_won: number | null
          id: string
          last_activity: string | null
          level: number | null
          player_id: string | null
          total_playtime_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          achievements_earned?: number | null
          cards_collected?: number | null
          created_at?: string | null
          decks_created?: number | null
          experience_points?: number | null
          games_played?: number | null
          games_won?: number | null
          id?: string
          last_activity?: string | null
          level?: number | null
          player_id?: string | null
          total_playtime_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          achievements_earned?: number | null
          cards_collected?: number | null
          created_at?: string | null
          decks_created?: number | null
          experience_points?: number | null
          games_played?: number | null
          games_won?: number | null
          id?: string
          last_activity?: string | null
          level?: number | null
          player_id?: string | null
          total_playtime_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          allow_friend_requests: boolean | null
          allow_messages: boolean | null
          allow_search_by_email: boolean | null
          allow_search_by_phone: boolean | null
          created_at: string | null
          data_sharing_preferences: Json | null
          id: string
          profile_visibility: string | null
          show_achievements: boolean | null
          show_birth_date: boolean | null
          show_email: boolean | null
          show_friends_list: boolean | null
          show_game_stats: boolean | null
          show_last_login: boolean | null
          show_location: boolean | null
          show_online_status: boolean | null
          show_phone: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allow_friend_requests?: boolean | null
          allow_messages?: boolean | null
          allow_search_by_email?: boolean | null
          allow_search_by_phone?: boolean | null
          created_at?: string | null
          data_sharing_preferences?: Json | null
          id?: string
          profile_visibility?: string | null
          show_achievements?: boolean | null
          show_birth_date?: boolean | null
          show_email?: boolean | null
          show_friends_list?: boolean | null
          show_game_stats?: boolean | null
          show_last_login?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          show_phone?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allow_friend_requests?: boolean | null
          allow_messages?: boolean | null
          allow_search_by_email?: boolean | null
          allow_search_by_phone?: boolean | null
          created_at?: string | null
          data_sharing_preferences?: Json | null
          id?: string
          profile_visibility?: string | null
          show_achievements?: boolean | null
          show_birth_date?: boolean | null
          show_email?: boolean | null
          show_friends_list?: boolean | null
          show_game_stats?: boolean | null
          show_last_login?: boolean | null
          show_location?: boolean | null
          show_online_status?: boolean | null
          show_phone?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          field_name: string
          id: string
          ip_address: unknown
          new_value: string | null
          old_value: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          field_name: string
          id?: string
          ip_address?: unknown
          new_value?: string | null
          old_value?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          field_name?: string
          id?: string
          ip_address?: unknown
          new_value?: string | null
          old_value?: string | null
          user_agent?: string | null
          user_id?: string | null
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shop_announcements: {
        Row: {
          color: string | null
          created_at: string | null
          end_date: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          start_date: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          end_date?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          start_date?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          end_date?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
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
          bundle_contents: Json | null
          bundle_type: string | null
          card_ids: string[] | null
          cards_per_pack: number | null
          created_at: string | null
          currency_amount_coins: number | null
          currency_amount_gems: number | null
          currency_type: string
          description: string | null
          discount_percentage: number | null
          event_id: string | null
          guaranteed_cards: Json | null
          id: string
          included_cards_count: number | null
          included_customizations: Json | null
          is_active: boolean | null
          is_daily_rotation: boolean | null
          is_limited: boolean | null
          is_special: boolean | null
          item_type: string
          max_purchases_per_user: number | null
          name: string
          pack_conditions: Json | null
          pack_type: string | null
          price_coins: number | null
          price_dollars: number | null
          price_gems: number | null
          purchase_time_limit: unknown
          rarity: string | null
          real_discount_percentage: number | null
          rotation_date: string | null
          sold_quantity: number | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          bundle_contents?: Json | null
          bundle_type?: string | null
          card_ids?: string[] | null
          cards_per_pack?: number | null
          created_at?: string | null
          currency_amount_coins?: number | null
          currency_amount_gems?: number | null
          currency_type?: string
          description?: string | null
          discount_percentage?: number | null
          event_id?: string | null
          guaranteed_cards?: Json | null
          id?: string
          included_cards_count?: number | null
          included_customizations?: Json | null
          is_active?: boolean | null
          is_daily_rotation?: boolean | null
          is_limited?: boolean | null
          is_special?: boolean | null
          item_type: string
          max_purchases_per_user?: number | null
          name: string
          pack_conditions?: Json | null
          pack_type?: string | null
          price_coins?: number | null
          price_dollars?: number | null
          price_gems?: number | null
          purchase_time_limit?: unknown
          rarity?: string | null
          real_discount_percentage?: number | null
          rotation_date?: string | null
          sold_quantity?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          bundle_contents?: Json | null
          bundle_type?: string | null
          card_ids?: string[] | null
          cards_per_pack?: number | null
          created_at?: string | null
          currency_amount_coins?: number | null
          currency_amount_gems?: number | null
          currency_type?: string
          description?: string | null
          discount_percentage?: number | null
          event_id?: string | null
          guaranteed_cards?: Json | null
          id?: string
          included_cards_count?: number | null
          included_customizations?: Json | null
          is_active?: boolean | null
          is_daily_rotation?: boolean | null
          is_limited?: boolean | null
          is_special?: boolean | null
          item_type?: string
          max_purchases_per_user?: number | null
          name?: string
          pack_conditions?: Json | null
          pack_type?: string | null
          price_coins?: number | null
          price_dollars?: number | null
          price_gems?: number | null
          purchase_time_limit?: unknown
          rarity?: string | null
          real_discount_percentage?: number | null
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
      special_pack_items: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          pack_id: string
          quantity: number
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          pack_id: string
          quantity?: number
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          pack_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "special_pack_items_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "special_pack_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "special_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      special_packs: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          is_starter_pack: boolean | null
          max_purchases_per_player: number | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          is_starter_pack?: boolean | null
          max_purchases_per_player?: number | null
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          is_starter_pack?: boolean | null
          max_purchases_per_player?: number | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      starter_pack_cards: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          pack_name: string
          quantity: number
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          pack_name: string
          quantity?: number
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          pack_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "starter_pack_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      starter_pack_config: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          event_description: string
          event_type: string
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievement_progress_detailed: {
        Row: {
          achievement_id: string
          claimed_at: string | null
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          is_completed: boolean | null
          last_updated: string | null
          max_progress: number
          progress_history: Json | null
          progress_percentage: number | null
          rewards_claimed: boolean | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          max_progress: number
          progress_history?: Json | null
          progress_percentage?: number | null
          rewards_claimed?: boolean | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          max_progress?: number
          progress_history?: Json | null
          progress_percentage?: number | null
          rewards_claimed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_progress_detailed_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_announcement_views: {
        Row: {
          announcement_id: string | null
          dismissed: boolean | null
          dismissed_at: string | null
          id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          announcement_id?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          announcement_id?: string | null
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_announcement_views_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "global_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_container_customizations: {
        Row: {
          container_type: string | null
          customization_id: string | null
          id: string
          is_equipped: boolean | null
          purchased_at: string | null
          user_id: string | null
        }
        Insert: {
          container_type?: string | null
          customization_id?: string | null
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Update: {
          container_type?: string | null
          customization_id?: string | null
          id?: string
          is_equipped?: boolean | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_container_customizations_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "container_customizations"
            referencedColumns: ["id"]
          },
        ]
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
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          dismissed_at: string | null
          expires_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          priority: number | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: number | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: number | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          accessibility_settings: Json | null
          account_status: string | null
          auto_save_enabled: boolean | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          date_format: string | null
          display_name: string | null
          email: string | null
          email_notifications: Json | null
          email_verified: boolean | null
          game_preferences: Json | null
          gender: string | null
          id: string
          language: string | null
          last_login: string | null
          last_password_change: string | null
          location: string | null
          login_count: number | null
          music_enabled: boolean | null
          notifications_enabled: boolean | null
          password_change_count: number | null
          phone_number: string | null
          phone_verified: boolean | null
          preferred_currency: string | null
          preferred_language: string | null
          privacy_level: string | null
          profile_completion_percentage: number | null
          push_notifications: Json | null
          social_media: Json | null
          sound_enabled: boolean | null
          theme: string | null
          time_format: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          accessibility_settings?: Json | null
          account_status?: string | null
          auto_save_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          date_format?: string | null
          display_name?: string | null
          email?: string | null
          email_notifications?: Json | null
          email_verified?: boolean | null
          game_preferences?: Json | null
          gender?: string | null
          id?: string
          language?: string | null
          last_login?: string | null
          last_password_change?: string | null
          location?: string | null
          login_count?: number | null
          music_enabled?: boolean | null
          notifications_enabled?: boolean | null
          password_change_count?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          privacy_level?: string | null
          profile_completion_percentage?: number | null
          push_notifications?: Json | null
          social_media?: Json | null
          sound_enabled?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          accessibility_settings?: Json | null
          account_status?: string | null
          auto_save_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          date_format?: string | null
          display_name?: string | null
          email?: string | null
          email_notifications?: Json | null
          email_verified?: boolean | null
          game_preferences?: Json | null
          gender?: string | null
          id?: string
          language?: string | null
          last_login?: string | null
          last_password_change?: string | null
          location?: string | null
          login_count?: number | null
          music_enabled?: boolean | null
          notifications_enabled?: boolean | null
          password_change_count?: number | null
          phone_number?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          privacy_level?: string | null
          profile_completion_percentage?: number | null
          push_notifications?: Json | null
          social_media?: Json | null
          sound_enabled?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_player_deck: { Args: { deck_id: string }; Returns: undefined }
      add_cards_to_collection: {
        Args: { p_card_ids: string[]; p_user_id: string }
        Returns: undefined
      }
      add_player_currency: {
        Args: { coins_to_add?: number; gems_to_add?: number; player_id: string }
        Returns: undefined
      }
      calculate_profile_completion: {
        Args: {
          user_settings_row: Database["public"]["Tables"]["user_settings"]["Row"]
        }
        Returns: number
      }
      can_purchase_starter_pack: { Args: never; Returns: boolean }
      change_user_password: {
        Args: {
          current_password: string
          new_password: string
          user_uuid: string
        }
        Returns: Json
      }
      check_achievements: { Args: { player_id: string }; Returns: undefined }
      check_is_super_admin: { Args: never; Returns: boolean }
      cleanup_old_daily_purchases: { Args: never; Returns: undefined }
      create_player_stats: {
        Args: {
          experience_param?: number
          games_played_param?: number
          games_won_param?: number
          last_activity_param?: string
          player_id_param: string
          total_playtime_param?: number
        }
        Returns: undefined
      }
      decrement_post_likes: { Args: { post_id: string }; Returns: undefined }
      generate_daily_missions: { Args: never; Returns: undefined }
      get_active_shop_events: {
        Args: never
        Returns: {
          description: string
          discount_percentage: number
          event_type: string
          id: string
          name: string
        }[]
      }
      get_complete_user_stats: { Args: { user_uuid: string }; Returns: Json }
      get_daily_rotation_cards: {
        Args: { p_date?: string }
        Returns: {
          card_id: string
          card_name: string
          card_rarity: string
          card_type: string
          currency_type: string
          discount_percentage: number
          price_coins: number
          price_gems: number
        }[]
      }
      get_password_change_history: {
        Args: { user_uuid: string }
        Returns: {
          changed_at: string
          ip_address: unknown
          user_agent: string
        }[]
      }
      get_player_stats: {
        Args: { player_id_param: string }
        Returns: {
          achievements_earned: number
          cards_collected: number
          created_at: string
          decks_created: number
          experience_points: number
          games_played: number
          games_won: number
          id: string
          last_activity: string
          level: number
          player_id: string
          total_playtime_minutes: number
          updated_at: string
        }[]
      }
      get_starter_card_id: { Args: { card_slug: string }; Returns: string }
      get_starter_pack_info: { Args: never; Returns: Json }
      get_user_privacy_settings: { Args: { user_uuid: string }; Returns: Json }
      get_user_profile_stats: { Args: { user_uuid: string }; Returns: Json }
      increment_password_change_count: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      increment_post_likes: { Args: { post_id: string }; Returns: undefined }
      increment_post_views: { Args: { post_id: string }; Returns: undefined }
      log_system_event: {
        Args: {
          p_description: string
          p_event_type: string
          p_metadata?: Json
          p_severity?: string
          p_user_id?: string
        }
        Returns: string
      }
      open_pack: { Args: { pack_id: string }; Returns: Json }
      purchase_pack: { Args: { pack_id: string }; Returns: Json }
      purchase_starter_pack: { Args: never; Returns: Json }
      redeem_starter_pack: { Args: { user_email: string }; Returns: string }
      reset_daily_missions: { Args: never; Returns: undefined }
      select_balanced_starter_cards: {
        Args: never
        Returns: {
          card_effect: string
          card_id: string
          card_name: string
          card_rarity: string
          card_type: string
          quantity: number
        }[]
      }
      sync_profile_data: { Args: { user_uuid: string }; Returns: Json }
      test_card_copy_limits: { Args: never; Returns: string }
      test_initial_currency: { Args: { user_id: string }; Returns: undefined }
      test_open_pack: { Args: { pack_id: string }; Returns: Json }
      update_community_ranking: { Args: never; Returns: undefined }
      update_player_stats: {
        Args: {
          experience_param: number
          games_played_param: number
          games_won_param: number
          last_activity_param?: string
          player_id_param: string
          total_playtime_param: number
        }
        Returns: undefined
      }
      update_user_login: { Args: { user_uuid: string }; Returns: undefined }
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
