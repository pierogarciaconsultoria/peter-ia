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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bsc_measures: {
        Row: {
          company_id: string
          created_at: string
          current_value: number | null
          id: string
          indicator_id: string | null
          name: string
          objective_id: string
          owner_id: string | null
          progress: number | null
          start_value: number
          target: number
          unit: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          current_value?: number | null
          id?: string
          indicator_id?: string | null
          name: string
          objective_id: string
          owner_id?: string | null
          progress?: number | null
          start_value?: number
          target?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_value?: number | null
          id?: string
          indicator_id?: string | null
          name?: string
          objective_id?: string
          owner_id?: string | null
          progress?: number | null
          start_value?: number
          target?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bsc_measures_indicator_fk"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "performance_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bsc_measures_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "bsc_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      bsc_objectives: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          cycle_id: string | null
          description: string
          id: string
          learnings: string
          owner_id: string | null
          parent_objective_id: string | null
          perspective: string | null
          pillar_id: string | null
          score: number | null
          sort_order: number
          source: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          cycle_id?: string | null
          description?: string
          id?: string
          learnings?: string
          owner_id?: string | null
          parent_objective_id?: string | null
          perspective?: string | null
          pillar_id?: string | null
          score?: number | null
          sort_order?: number
          source?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          cycle_id?: string | null
          description?: string
          id?: string
          learnings?: string
          owner_id?: string | null
          parent_objective_id?: string | null
          perspective?: string | null
          pillar_id?: string | null
          score?: number | null
          sort_order?: number
          source?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bsc_objectives_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bsc_objectives_parent_objective_id_fkey"
            columns: ["parent_objective_id"]
            isOneToOne: false
            referencedRelation: "bsc_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bsc_objectives_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "strategy_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      business_model_canvas: {
        Row: {
          channels: string
          company_id: string
          cost_structure: string
          created_at: string
          customer_relationships: string
          customer_segments: string
          id: string
          key_activities: string
          key_partners: string
          key_resources: string
          revenue_streams: string
          source: string
          updated_at: string
          value_propositions: string
        }
        Insert: {
          channels?: string
          company_id?: string
          cost_structure?: string
          created_at?: string
          customer_relationships?: string
          customer_segments?: string
          id?: string
          key_activities?: string
          key_partners?: string
          key_resources?: string
          revenue_streams?: string
          source?: string
          updated_at?: string
          value_propositions?: string
        }
        Update: {
          channels?: string
          company_id?: string
          cost_structure?: string
          created_at?: string
          customer_relationships?: string
          customer_segments?: string
          id?: string
          key_activities?: string
          key_partners?: string
          key_resources?: string
          revenue_streams?: string
          source?: string
          updated_at?: string
          value_propositions?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          comment: string
          company_id: string
          confidence: string
          created_at: string
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          value: number
        }
        Insert: {
          comment?: string
          company_id?: string
          confidence: string
          created_at?: string
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          value: number
        }
        Update: {
          comment?: string
          company_id?: string
          confidence?: string
          created_at?: string
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          value?: number
        }
        Relationships: []
      }
      company_analysis: {
        Row: {
          ai_suggestions: Json
          analysis_type: string
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          input_data: Json
          status: string
          updated_at: string
        }
        Insert: {
          ai_suggestions?: Json
          analysis_type?: string
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          input_data?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          ai_suggestions?: Json
          analysis_type?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          input_data?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cycles: {
        Row: {
          check_in_frequency_days: number
          company_id: string
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          check_in_frequency_days?: number
          company_id?: string
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          check_in_frequency_days?: number
          company_id?: string
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      indicator_measurements: {
        Row: {
          company_id: string
          created_at: string
          id: string
          indicator_id: string
          month: number
          notes: string | null
          target: number | null
          updated_at: string
          value: number
          year: number
        }
        Insert: {
          company_id?: string
          created_at?: string
          id?: string
          indicator_id: string
          month: number
          notes?: string | null
          target?: number | null
          updated_at?: string
          value: number
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          indicator_id?: string
          month?: number
          notes?: string | null
          target?: number | null
          updated_at?: string
          value?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicator_measurements_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "performance_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_indicators: {
        Row: {
          calculation_type: string
          company_id: string
          created_at: string
          description: string | null
          goal_type: string
          goal_value: number
          id: string
          name: string
          owner_id: string | null
          process: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          calculation_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          goal_type?: string
          goal_value?: number
          id?: string
          name: string
          owner_id?: string | null
          process?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          calculation_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          goal_type?: string
          goal_value?: number
          id?: string
          name?: string
          owner_id?: string | null
          process?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quality_actions: {
        Row: {
          comments: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          currency: string | null
          due_date: string
          how: string
          how_much: number
          id: string
          involved_people: string | null
          key_result_id: string | null
          priority: string
          process_area: string
          responsible: string
          responsible_id: string | null
          source: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
          what: string
          where: string
          why: string
        }
        Insert: {
          comments?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          due_date: string
          how?: string
          how_much?: number
          id?: string
          involved_people?: string | null
          key_result_id?: string | null
          priority?: string
          process_area?: string
          responsible?: string
          responsible_id?: string | null
          source?: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          what?: string
          where?: string
          why?: string
        }
        Update: {
          comments?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string
          how?: string
          how_much?: number
          id?: string
          involved_people?: string | null
          key_result_id?: string | null
          priority?: string
          process_area?: string
          responsible?: string
          responsible_id?: string | null
          source?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          what?: string
          where?: string
          why?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_actions_key_result_id_fkey"
            columns: ["key_result_id"]
            isOneToOne: false
            referencedRelation: "bsc_measures"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_identities: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          horizon_date: string | null
          id: string
          mission: string
          source: string
          ultimate_goal: string
          updated_at: string
          values: string[]
          vision: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          horizon_date?: string | null
          id?: string
          mission?: string
          source?: string
          ultimate_goal?: string
          updated_at?: string
          values?: string[]
          vision?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          horizon_date?: string | null
          id?: string
          mission?: string
          source?: string
          ultimate_goal?: string
          updated_at?: string
          values?: string[]
          vision?: string
        }
        Relationships: []
      }
      strategy_pillars: {
        Row: {
          bsc_perspective: string | null
          company_id: string
          created_at: string
          description: string
          id: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          bsc_perspective?: string | null
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          bsc_perspective?: string | null
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      swot_items: {
        Row: {
          category: string
          company_id: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          impact_level: number
          source: string
          updated_at: string
        }
        Insert: {
          category: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          impact_level?: number
          source?: string
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          impact_level?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_default_cycle: { Args: { p_company: string }; Returns: string }
      get_user_company_safe: { Args: never; Returns: string }
      is_company_admin_safe: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
