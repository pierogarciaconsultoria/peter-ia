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
      companies: {
        Row: {
          active_modules: string[]
          created_at: string
          id: string
          name: string
          plan: string
          settings: Json
          slug: string
        }
        Insert: {
          active_modules?: string[]
          created_at?: string
          id?: string
          name: string
          plan?: string
          settings?: Json
          slug: string
        }
        Update: {
          active_modules?: string[]
          created_at?: string
          id?: string
          name?: string
          plan?: string
          settings?: Json
          slug?: string
        }
        Relationships: []
      }
      disc_assessments: {
        Row: {
          created_at: string
          date: string
          email: string
          id: string
          invited_by: string | null
          name: string
          primary_type: string
          scores: Json
        }
        Insert: {
          created_at?: string
          date?: string
          email: string
          id?: string
          invited_by?: string | null
          name: string
          primary_type: string
          scores: Json
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          id?: string
          invited_by?: string | null
          name?: string
          primary_type?: string
          scores?: Json
        }
        Relationships: []
      }
      document_revisions: {
        Row: {
          approved_by: string | null
          changes: string | null
          content: string
          document_id: string | null
          id: string
          revision_date: string
          version: string
        }
        Insert: {
          approved_by?: string | null
          changes?: string | null
          content: string
          document_id?: string | null
          id?: string
          revision_date?: string
          version: string
        }
        Update: {
          approved_by?: string | null
          changes?: string | null
          content?: string
          document_id?: string | null
          id?: string
          revision_date?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_revisions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "iso_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      iso_documents: {
        Row: {
          associated_requirement: string
          content: string | null
          created_at: string
          description: string | null
          document_type: string
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          associated_requirement: string
          content?: string | null
          created_at?: string
          description?: string | null
          document_type: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          associated_requirement?: string
          content?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      iso_records: {
        Row: {
          created_at: string
          created_by: string | null
          data: Json | null
          document_id: string | null
          id: string
          record_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data?: Json | null
          document_id?: string | null
          id?: string
          record_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data?: Json | null
          document_id?: string | null
          id?: string
          record_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iso_records_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "iso_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          description: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          price: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          price?: number
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      "Morada do Sol": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          description: string | null
          id: string
          module_id: string | null
        }
        Insert: {
          action: string
          description?: string | null
          id?: string
          module_id?: string | null
        }
        Update: {
          action?: string
          description?: string | null
          id?: string
          module_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted: boolean
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          granted?: boolean
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          granted?: boolean
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_default: boolean
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_company_admin: boolean
          is_super_admin: boolean
          last_login: string | null
          last_name: string | null
          role_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string | null
          role_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profiles_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_profiles_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
