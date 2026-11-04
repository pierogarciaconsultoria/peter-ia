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
      assistant_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          module_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          module_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          module_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_plans: {
        Row: {
          audited_areas: string
          company_id: string
          created_at: string
          end_date: string
          id: string
          observations: string | null
          responsible: string
          responsible_id: string | null
          start_date: string
          status: string
          summary: string | null
          team: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audited_areas?: string
          company_id?: string
          created_at?: string
          end_date: string
          id?: string
          observations?: string | null
          responsible?: string
          responsible_id?: string | null
          start_date: string
          status?: string
          summary?: string | null
          team?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audited_areas?: string
          company_id?: string
          created_at?: string
          end_date?: string
          id?: string
          observations?: string | null
          responsible?: string
          responsible_id?: string | null
          start_date?: string
          status?: string
          summary?: string | null
          team?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_plans_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
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
      candidate_assessment_links: {
        Row: {
          assessment_id: string
          candidate_email: string
          candidate_name: string
          company_id: string
          created_at: string
          expires_at: string
          id: string
          recruitment_process_id: string | null
          token: string
          used: boolean
        }
        Insert: {
          assessment_id: string
          candidate_email: string
          candidate_name: string
          company_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          recruitment_process_id?: string | null
          token?: string
          used?: boolean
        }
        Update: {
          assessment_id?: string
          candidate_email?: string
          candidate_name?: string
          company_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          recruitment_process_id?: string | null
          token?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "candidate_assessment_links_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "candidate_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_assessment_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_assessment_responses: {
        Row: {
          answers: Json
          assessment_id: string
          candidate_email: string
          candidate_name: string
          company_id: string
          id: string
          link_id: string | null
          score: number | null
          submitted_at: string
        }
        Insert: {
          answers?: Json
          assessment_id: string
          candidate_email: string
          candidate_name: string
          company_id?: string
          id?: string
          link_id?: string | null
          score?: number | null
          submitted_at?: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          candidate_email?: string
          candidate_name?: string
          company_id?: string
          id?: string
          link_id?: string | null
          score?: number | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "candidate_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_assessment_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_assessment_responses_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "candidate_assessment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_assessments: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          description: string | null
          id: string
          questions: Json
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          questions?: Json
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          questions?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      climate_survey_questions: {
        Row: {
          category: string
          company_id: string
          created_at: string
          id: string
          options: Json | null
          order_number: number
          question: string
          question_type: string
          required: boolean
          survey_id: string
        }
        Insert: {
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          options?: Json | null
          order_number?: number
          question: string
          question_type?: string
          required?: boolean
          survey_id: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          id?: string
          options?: Json | null
          order_number?: number
          question?: string
          question_type?: string
          required?: boolean
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "climate_survey_questions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "climate_survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "climate_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      climate_survey_responses: {
        Row: {
          company_id: string
          employee_id: string | null
          id: string
          is_anonymous: boolean
          responses: Json
          submitted_at: string
          survey_id: string
        }
        Insert: {
          company_id?: string
          employee_id?: string | null
          id?: string
          is_anonymous?: boolean
          responses?: Json
          submitted_at?: string
          survey_id: string
        }
        Update: {
          company_id?: string
          employee_id?: string | null
          id?: string
          is_anonymous?: boolean
          responses?: Json
          submitted_at?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "climate_survey_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "climate_survey_responses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "climate_survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "climate_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      climate_surveys: {
        Row: {
          company_id: string
          created_at: string
          description: string
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          description?: string
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "climate_surveys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          active: boolean
          active_modules: string[]
          address: string | null
          business_objectives: string | null
          cnpj: string | null
          company_description: string | null
          company_sector: string | null
          company_size: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          operational_problems: string | null
          phone: string | null
          plan: string
          potency: string | null
          responsible: string | null
          settings: Json
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          active_modules?: string[]
          address?: string | null
          business_objectives?: string | null
          cnpj?: string | null
          company_description?: string | null
          company_sector?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          operational_problems?: string | null
          phone?: string | null
          plan?: string
          potency?: string | null
          responsible?: string | null
          settings?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          active_modules?: string[]
          address?: string | null
          business_objectives?: string | null
          cnpj?: string | null
          company_description?: string | null
          company_sector?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          operational_problems?: string | null
          phone?: string | null
          plan?: string
          potency?: string | null
          responsible?: string | null
          settings?: Json
          slug?: string
          updated_at?: string
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
      critical_analysis: {
        Row: {
          analysis_date: string
          attachments: Json | null
          company_id: string
          created_at: string
          created_by: string
          id: string
          inputs: Json | null
          participants: string[]
          results: Json | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          analysis_date?: string
          attachments?: Json | null
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          inputs?: Json | null
          participants?: string[]
          results?: Json | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          analysis_date?: string
          attachments?: Json | null
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          inputs?: Json | null
          participants?: string[]
          results?: Json | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "critical_analysis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_complaints: {
        Row: {
          action_schedule_id: string | null
          assigned_to: string | null
          assigned_to_id: string | null
          closed_at: string | null
          company_id: string
          complaint_date: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          customer_name: string
          description: string
          detailed_status: string
          id: string
          identification_code: string | null
          invoice_number: string | null
          priority: string
          product: string | null
          resolution: string | null
          return_deadline: string | null
          status: string
          treatment_option: string | null
          updated_at: string
        }
        Insert: {
          action_schedule_id?: string | null
          assigned_to?: string | null
          assigned_to_id?: string | null
          closed_at?: string | null
          company_id?: string
          complaint_date?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_name: string
          description?: string
          detailed_status?: string
          id?: string
          identification_code?: string | null
          invoice_number?: string | null
          priority?: string
          product?: string | null
          resolution?: string | null
          return_deadline?: string | null
          status?: string
          treatment_option?: string | null
          updated_at?: string
        }
        Update: {
          action_schedule_id?: string | null
          assigned_to?: string | null
          assigned_to_id?: string | null
          closed_at?: string | null
          company_id?: string
          complaint_date?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_name?: string
          description?: string
          detailed_status?: string
          id?: string
          identification_code?: string | null
          invoice_number?: string | null
          priority?: string
          product?: string | null
          resolution?: string | null
          return_deadline?: string | null
          status?: string
          treatment_option?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_complaints_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_satisfaction_surveys: {
        Row: {
          company_id: string
          created_at: string
          customer_name: string
          delivery_satisfaction: number | null
          id: string
          overall_satisfaction: number | null
          product_quality: number | null
          service_quality: number | null
          status: string
          suggestions: string | null
          survey_date: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          customer_name: string
          delivery_satisfaction?: number | null
          id?: string
          overall_satisfaction?: number | null
          product_quality?: number | null
          service_quality?: number | null
          status?: string
          suggestions?: string | null
          survey_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_name?: string
          delivery_satisfaction?: number | null
          id?: string
          overall_satisfaction?: number | null
          product_quality?: number | null
          service_quality?: number | null
          status?: string
          suggestions?: string | null
          survey_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_satisfaction_surveys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      departments: {
        Row: {
          approved_headcount: number
          company_id: string
          created_at: string
          current_headcount: number
          description: string | null
          id: string
          name: string
          responsible_employee_id: string | null
          sector: string | null
          updated_at: string
        }
        Insert: {
          approved_headcount?: number
          company_id?: string
          created_at?: string
          current_headcount?: number
          description?: string | null
          id?: string
          name: string
          responsible_employee_id?: string | null
          sector?: string | null
          updated_at?: string
        }
        Update: {
          approved_headcount?: number
          company_id?: string
          created_at?: string
          current_headcount?: number
          description?: string | null
          id?: string
          name?: string
          responsible_employee_id?: string | null
          sector?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_responsible_employee_id_fkey"
            columns: ["responsible_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      development_plans: {
        Row: {
          action_items: Json
          career_goal: string | null
          company_id: string
          created_at: string
          creator_id: string | null
          development_areas: Json
          employee_id: string
          end_date: string
          id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          action_items?: Json
          career_goal?: string | null
          company_id?: string
          created_at?: string
          creator_id?: string | null
          development_areas?: Json
          employee_id: string
          end_date: string
          id?: string
          progress?: number
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_items?: Json
          career_goal?: string | null
          company_id?: string
          created_at?: string
          creator_id?: string | null
          development_areas?: Json
          employee_id?: string
          end_date?: string
          id?: string
          progress?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "development_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_plans_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      disc_assessments: {
        Row: {
          company_id: string
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
          company_id?: string
          created_at?: string
          date?: string
          email?: string
          id?: string
          invited_by?: string | null
          name: string
          primary_type?: string
          scores?: Json
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          email?: string
          id?: string
          invited_by?: string | null
          name?: string
          primary_type?: string
          scores?: Json
        }
        Relationships: [
          {
            foreignKeyName: "disc_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      disc_evaluation_links: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          email: string
          entity_id: string | null
          entity_type: string
          expires_at: string
          id: string
          is_used: boolean
          name: string
          token: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          email: string
          entity_id?: string | null
          entity_type?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          name: string
          token?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          entity_id?: string | null
          entity_type?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          name?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "disc_evaluation_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          archiving_time: string | null
          category: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          disposal_method: string | null
          distribution_location: string | null
          document_code: string | null
          document_type: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          internal_external: string
          mime_type: string | null
          process: string | null
          protection: string | null
          recovery_method: string | null
          retention_time: string | null
          review_date: string | null
          revision: string | null
          standard_items: string[] | null
          status: string
          storage_location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          archiving_time?: string | null
          category?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disposal_method?: string | null
          distribution_location?: string | null
          document_code?: string | null
          document_type?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          internal_external?: string
          mime_type?: string | null
          process?: string | null
          protection?: string | null
          recovery_method?: string | null
          retention_time?: string | null
          review_date?: string | null
          revision?: string | null
          standard_items?: string[] | null
          status?: string
          storage_location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          archiving_time?: string | null
          category?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          disposal_method?: string | null
          distribution_location?: string | null
          document_code?: string | null
          document_type?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          internal_external?: string
          mime_type?: string | null
          process?: string | null
          protection?: string | null
          recovery_method?: string | null
          retention_time?: string | null
          review_date?: string | null
          revision?: string | null
          standard_items?: string[] | null
          status?: string
          storage_location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_trainings: {
        Row: {
          company_id: string
          completion_date: string | null
          created_at: string
          employee_id: string
          id: string
          score: number | null
          status: string
          training_id: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          completion_date?: string | null
          created_at?: string
          employee_id: string
          id?: string
          score?: number | null
          status?: string
          training_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          completion_date?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          score?: number | null
          status?: string
          training_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_trainings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_trainings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_trainings_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string
          department: string
          department_id: string | null
          email: string
          hire_date: string
          id: string
          immediate_supervisor_id: string | null
          job_position_id: string | null
          name: string
          phone: string | null
          position: string
          salary: number | null
          sector: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          department?: string
          department_id?: string | null
          email?: string
          hire_date?: string
          id?: string
          immediate_supervisor_id?: string | null
          job_position_id?: string | null
          name: string
          phone?: string | null
          position?: string
          salary?: number | null
          sector?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          department?: string
          department_id?: string | null
          email?: string
          hire_date?: string
          id?: string
          immediate_supervisor_id?: string | null
          job_position_id?: string | null
          name?: string
          phone?: string | null
          position?: string
          salary?: number | null
          sector?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_immediate_supervisor_id_fkey"
            columns: ["immediate_supervisor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_calibrations: {
        Row: {
          calibration_date: string
          calibration_entity: string
          certificate_number: string | null
          company_id: string
          created_at: string
          equipment_id: string
          equipment_name: string
          id: string
          next_calibration_date: string
          observations: string | null
          responsible: string
          status: string
          updated_at: string
        }
        Insert: {
          calibration_date: string
          calibration_entity?: string
          certificate_number?: string | null
          company_id?: string
          created_at?: string
          equipment_id?: string
          equipment_name: string
          id?: string
          next_calibration_date: string
          observations?: string | null
          responsible?: string
          status?: string
          updated_at?: string
        }
        Update: {
          calibration_date?: string
          calibration_entity?: string
          certificate_number?: string | null
          company_id?: string
          created_at?: string
          equipment_id?: string
          equipment_name?: string
          id?: string
          next_calibration_date?: string
          observations?: string | null
          responsible?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_calibrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      external_audits: {
        Row: {
          audit_date: string
          auditor_company: string | null
          company_id: string
          completion_date: string | null
          created_at: string
          description: string | null
          external_auditor: string
          findings: string | null
          id: string
          report_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          audit_date: string
          auditor_company?: string | null
          company_id?: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          external_auditor?: string
          findings?: string | null
          id?: string
          report_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          audit_date?: string
          auditor_company?: string | null
          company_id?: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          external_auditor?: string
          findings?: string | null
          id?: string
          report_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_audits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_approved_positions: {
        Row: {
          approved_count: number
          company_id: string
          created_at: string
          department_id: string
          filled_count: number
          id: string
          is_active: boolean
          job_position_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          approved_count?: number
          company_id?: string
          created_at?: string
          department_id: string
          filled_count?: number
          id?: string
          is_active?: boolean
          job_position_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          approved_count?: number
          company_id?: string
          created_at?: string
          department_id?: string
          filled_count?: number
          id?: string
          is_active?: boolean
          job_position_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_approved_positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_approved_positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_approved_positions_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_exit_interviews: {
        Row: {
          additional_comments: string | null
          company_id: string
          compensation_rating: number | null
          completed_at: string | null
          created_at: string
          employee_id: string
          employee_name: string
          employee_phone: string | null
          growth_opportunities_rating: number | null
          id: string
          interview_date: string | null
          link_expires_at: string
          management_rating: number | null
          overall_satisfaction: number | null
          reason_for_leaving: string | null
          status: string
          suggestions_for_improvement: string | null
          termination_date: string
          termination_reason: string | null
          token: string
          updated_at: string
          what_liked_least: string | null
          what_liked_most: string | null
          whatsapp_message_id: string | null
          whatsapp_sent_at: string | null
          work_environment_rating: number | null
          would_consider_returning: boolean | null
          would_recommend_company: boolean | null
        }
        Insert: {
          additional_comments?: string | null
          company_id?: string
          compensation_rating?: number | null
          completed_at?: string | null
          created_at?: string
          employee_id: string
          employee_name: string
          employee_phone?: string | null
          growth_opportunities_rating?: number | null
          id?: string
          interview_date?: string | null
          link_expires_at?: string
          management_rating?: number | null
          overall_satisfaction?: number | null
          reason_for_leaving?: string | null
          status?: string
          suggestions_for_improvement?: string | null
          termination_date: string
          termination_reason?: string | null
          token?: string
          updated_at?: string
          what_liked_least?: string | null
          what_liked_most?: string | null
          whatsapp_message_id?: string | null
          whatsapp_sent_at?: string | null
          work_environment_rating?: number | null
          would_consider_returning?: boolean | null
          would_recommend_company?: boolean | null
        }
        Update: {
          additional_comments?: string | null
          company_id?: string
          compensation_rating?: number | null
          completed_at?: string | null
          created_at?: string
          employee_id?: string
          employee_name?: string
          employee_phone?: string | null
          growth_opportunities_rating?: number | null
          id?: string
          interview_date?: string | null
          link_expires_at?: string
          management_rating?: number | null
          overall_satisfaction?: number | null
          reason_for_leaving?: string | null
          status?: string
          suggestions_for_improvement?: string | null
          termination_date?: string
          termination_reason?: string | null
          token?: string
          updated_at?: string
          what_liked_least?: string | null
          what_liked_most?: string | null
          whatsapp_message_id?: string | null
          whatsapp_sent_at?: string | null
          work_environment_rating?: number | null
          would_consider_returning?: boolean | null
          would_recommend_company?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_exit_interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_exit_interviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_trainings: {
        Row: {
          company_id: string
          created_at: string
          department: string | null
          description: string | null
          duration: number | null
          end_date: string | null
          evaluation_method: string | null
          id: string
          instructor: string | null
          participants: Json
          procedure_id: string | null
          provider: string | null
          start_date: string | null
          status: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          evaluation_method?: string | null
          id?: string
          instructor?: string | null
          participants?: Json
          procedure_id?: string | null
          provider?: string | null
          start_date?: string | null
          status?: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          evaluation_method?: string | null
          id?: string
          instructor?: string | null
          participants?: Json
          procedure_id?: string | null
          provider?: string | null
          start_date?: string | null
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_trainings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      job_positions: {
        Row: {
          approval_date: string | null
          approver: string | null
          cbo_code: string | null
          code: string | null
          company_id: string
          created_at: string
          department: string
          department_id: string | null
          description: string
          education_requirements: string | null
          experience_requirements: string | null
          external_training: string | null
          external_training_junior: string | null
          external_training_mid: string | null
          external_training_senior: string | null
          id: string
          immediate_supervisor_position: string | null
          is_department_head: boolean
          is_supervisor: boolean
          main_responsibilities: string | null
          norm: string | null
          required_ppe: string[]
          required_procedures: string[]
          required_resources: string[]
          requirements: string | null
          responsibilities: string | null
          responsibilities_junior: string | null
          responsibilities_mid: string | null
          responsibilities_senior: string | null
          revision: string | null
          salary_junior: string | null
          salary_max: number | null
          salary_mid: string | null
          salary_min: number | null
          salary_senior: string | null
          skill_requirements: string | null
          skills_junior: string | null
          skills_mid: string | null
          skills_senior: string | null
          status: string
          superior_position_id: string | null
          title: string
          training_junior: string | null
          training_mid: string | null
          training_requirements: string | null
          training_senior: string | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approver?: string | null
          cbo_code?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          department?: string
          department_id?: string | null
          description?: string
          education_requirements?: string | null
          experience_requirements?: string | null
          external_training?: string | null
          external_training_junior?: string | null
          external_training_mid?: string | null
          external_training_senior?: string | null
          id?: string
          immediate_supervisor_position?: string | null
          is_department_head?: boolean
          is_supervisor?: boolean
          main_responsibilities?: string | null
          norm?: string | null
          required_ppe?: string[]
          required_procedures?: string[]
          required_resources?: string[]
          requirements?: string | null
          responsibilities?: string | null
          responsibilities_junior?: string | null
          responsibilities_mid?: string | null
          responsibilities_senior?: string | null
          revision?: string | null
          salary_junior?: string | null
          salary_max?: number | null
          salary_mid?: string | null
          salary_min?: number | null
          salary_senior?: string | null
          skill_requirements?: string | null
          skills_junior?: string | null
          skills_mid?: string | null
          skills_senior?: string | null
          status?: string
          superior_position_id?: string | null
          title: string
          training_junior?: string | null
          training_mid?: string | null
          training_requirements?: string | null
          training_senior?: string | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approver?: string | null
          cbo_code?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          department?: string
          department_id?: string | null
          description?: string
          education_requirements?: string | null
          experience_requirements?: string | null
          external_training?: string | null
          external_training_junior?: string | null
          external_training_mid?: string | null
          external_training_senior?: string | null
          id?: string
          immediate_supervisor_position?: string | null
          is_department_head?: boolean
          is_supervisor?: boolean
          main_responsibilities?: string | null
          norm?: string | null
          required_ppe?: string[]
          required_procedures?: string[]
          required_resources?: string[]
          requirements?: string | null
          responsibilities?: string | null
          responsibilities_junior?: string | null
          responsibilities_mid?: string | null
          responsibilities_senior?: string | null
          revision?: string | null
          salary_junior?: string | null
          salary_max?: number | null
          salary_mid?: string | null
          salary_min?: number | null
          salary_senior?: string | null
          skill_requirements?: string | null
          skills_junior?: string | null
          skills_mid?: string | null
          skills_senior?: string | null
          status?: string
          superior_position_id?: string | null
          title?: string
          training_junior?: string | null
          training_mid?: string | null
          training_requirements?: string | null
          training_senior?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_positions_department_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_positions_superior_position_id_fkey"
            columns: ["superior_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_certificates: {
        Row: {
          cid: string | null
          company_id: string
          created_at: string
          created_by: string | null
          days: number | null
          description: string | null
          doctor: string
          document_url: string | null
          employee_id: string
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          cid?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          days?: number | null
          description?: string | null
          doctor?: string
          document_url?: string | null
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          cid?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          days?: number | null
          description?: string | null
          doctor?: string
          document_url?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_certificates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_certificates_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      module_assistants: {
        Row: {
          capabilities: string | null
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          label: string
          limitations: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          capabilities?: string | null
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          label: string
          limitations?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          capabilities?: string | null
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          label?: string
          limitations?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      modulos: {
        Row: {
          ativo: boolean
          chave: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      non_conforming_products: {
        Row: {
          approval_status: string
          company_id: string
          created_at: string
          customer: string | null
          department: string
          description: string
          id: string
          immediate_action: string
          non_conformity_type: string
          product_name: string
          requirement_id: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          company_id?: string
          created_at?: string
          customer?: string | null
          department?: string
          description?: string
          id?: string
          immediate_action?: string
          non_conformity_type?: string
          product_name: string
          requirement_id?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          company_id?: string
          created_at?: string
          customer?: string | null
          department?: string
          description?: string
          id?: string
          immediate_action?: string
          non_conformity_type?: string
          product_name?: string
          requirement_id?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_conforming_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      non_conformities: {
        Row: {
          closed_at: string | null
          company_id: string
          created_at: string
          department: string
          description: string
          id: string
          requirement_id: string
          responsible: string
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          company_id?: string
          created_at?: string
          department?: string
          description?: string
          id?: string
          requirement_id?: string
          responsible?: string
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          company_id?: string
          created_at?: string
          department?: string
          description?: string
          id?: string
          requirement_id?: string
          responsible?: string
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_conformities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrences: {
        Row: {
          company_id: string
          created_at: string
          date: string
          description: string
          employee_id: string
          id: string
          reported_by: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          date?: string
          description?: string
          employee_id: string
          id?: string
          reported_by?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          description?: string
          employee_id?: string
          id?: string
          reported_by?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occurrences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_context: {
        Row: {
          analysis: string | null
          company_id: string
          context_type: string
          created_at: string
          created_by: string
          description: string
          id: string
          swot_category: string | null
          update_date: string
          updated_at: string
        }
        Insert: {
          analysis?: string | null
          company_id?: string
          context_type: string
          created_at?: string
          created_by?: string
          description: string
          id?: string
          swot_category?: string | null
          update_date?: string
          updated_at?: string
        }
        Update: {
          analysis?: string | null
          company_id?: string
          context_type?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          swot_category?: string | null
          update_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_context_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      permissoes_empresa: {
        Row: {
          company_id: string
          created_at: string
          id: string
          modulo_id: string
          pode_criar: boolean
          pode_editar: boolean
          pode_excluir: boolean
          pode_visualizar: boolean
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          modulo_id: string
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          pode_visualizar?: boolean
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          modulo_id?: string
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          pode_visualizar?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_empresa_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_empresa_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes_usuario: {
        Row: {
          created_at: string
          id: string
          modulo_id: string
          pode_criar: boolean
          pode_editar: boolean
          pode_excluir: boolean
          pode_visualizar: boolean
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          modulo_id: string
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          pode_visualizar?: boolean
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          modulo_id?: string
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          pode_visualizar?: boolean
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_usuario_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      quality_criteria: {
        Row: {
          category: string
          company_id: string
          company_segment: string
          created_at: string
          description: string
          expected_value: string
          id: string
          is_active: boolean
          measurement_unit: string | null
          name: string
          tolerance: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          company_id?: string
          company_segment?: string
          created_at?: string
          description?: string
          expected_value?: string
          id?: string
          is_active?: boolean
          measurement_unit?: string | null
          name: string
          tolerance?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          company_segment?: string
          created_at?: string
          description?: string
          expected_value?: string
          id?: string
          is_active?: boolean
          measurement_unit?: string | null
          name?: string
          tolerance?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_criteria_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_inspections: {
        Row: {
          batch_number: string
          company_id: string
          created_at: string
          criteria_results: Json
          id: string
          inspection_date: string
          inspection_type: string
          inspector: string
          observations: string | null
          process_name: string | null
          product_name: string
          status: string
          updated_at: string
        }
        Insert: {
          batch_number?: string
          company_id?: string
          created_at?: string
          criteria_results?: Json
          id?: string
          inspection_date?: string
          inspection_type?: string
          inspector?: string
          observations?: string | null
          process_name?: string | null
          product_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          company_id?: string
          created_at?: string
          criteria_results?: Json
          id?: string
          inspection_date?: string
          inspection_type?: string
          inspector?: string
          observations?: string | null
          process_name?: string | null
          product_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_inspections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_objectives: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          frequency: string | null
          id: string
          name: string
          status: string
          target: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name: string
          status?: string
          target?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name?: string
          status?: string
          target?: number | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_objectives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_policy: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          policy_text: string
          related_action_plans: string[]
          related_indicators: string[]
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          policy_text: string
          related_action_plans?: string[]
          related_indicators?: string[]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          policy_text?: string
          related_action_plans?: string[]
          related_indicators?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_policy_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_material_inspections: {
        Row: {
          batch_number: string
          company_id: string
          created_at: string
          id: string
          inspection_date: string
          inspection_result: string
          inspector: string
          material_name: string
          observations: string | null
          parameters: Json | null
          quantity: number
          supplier: string
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number?: string
          company_id?: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspection_result?: string
          inspector?: string
          material_name: string
          observations?: string | null
          parameters?: Json | null
          quantity?: number
          supplier?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          company_id?: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspection_result?: string
          inspector?: string
          material_name?: string
          observations?: string | null
          parameters?: Json | null
          quantity?: number
          supplier?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_material_inspections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analyses: {
        Row: {
          analysis: string
          candidate_id: string
          company_id: string
          compatibility_score: number
          created_at: string
          created_by: string | null
          id: string
          job_opening_id: string | null
          recommendation: string
          strengths: string[]
          weaknesses: string[]
        }
        Insert: {
          analysis?: string
          candidate_id: string
          company_id?: string
          compatibility_score?: number
          created_at?: string
          created_by?: string | null
          id?: string
          job_opening_id?: string | null
          recommendation?: string
          strengths?: string[]
          weaknesses?: string[]
        }
        Update: {
          analysis?: string
          candidate_id?: string
          company_id?: string
          compatibility_score?: number
          created_at?: string
          created_by?: string | null
          id?: string
          job_opening_id?: string | null
          recommendation?: string
          strengths?: string[]
          weaknesses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes: {
        Row: {
          company_id: string
          created_at: string
          criado_por: string | null
          data: string
          descricao: string | null
          id: string
          local: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          criado_por?: string | null
          data?: string
          descricao?: string | null
          id?: string
          local?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          criado_por?: string | null
          data?: string
          descricao?: string | null
          id?: string
          local?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunioes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes_acoes: {
        Row: {
          company_id: string
          created_at: string
          descricao: string | null
          id: string
          prazo: string | null
          responsavel_id: string | null
          reuniao_id: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          reuniao_id: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          reuniao_id?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunioes_acoes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_acoes_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_acoes_reuniao_id_fkey"
            columns: ["reuniao_id"]
            isOneToOne: false
            referencedRelation: "reunioes"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes_participantes: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string | null
          id: string
          presente: boolean
          reuniao_id: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          presente?: boolean
          reuniao_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          presente?: boolean
          reuniao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunioes_participantes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_participantes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_participantes_reuniao_id_fkey"
            columns: ["reuniao_id"]
            isOneToOne: false
            referencedRelation: "reunioes"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes_registros: {
        Row: {
          company_id: string
          created_at: string
          dificuldades: string | null
          employee_id: string
          id: string
          o_que_fiz: string | null
          o_que_vou_fazer: string | null
          reuniao_id: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          dificuldades?: string | null
          employee_id: string
          id?: string
          o_que_fiz?: string | null
          o_que_vou_fazer?: string | null
          reuniao_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          dificuldades?: string | null
          employee_id?: string
          id?: string
          o_que_fiz?: string | null
          o_que_vou_fazer?: string | null
          reuniao_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunioes_registros_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_registros_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_registros_reuniao_id_fkey"
            columns: ["reuniao_id"]
            isOneToOne: false
            referencedRelation: "reunioes"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string
          id: string
          impact: number
          mitigation_plan: string | null
          probability: number
          process: string
          responsible: string
          risk_level: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          impact?: number
          mitigation_plan?: string | null
          probability?: number
          process?: string
          responsible?: string
          risk_level?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          impact?: number
          mitigation_plan?: string | null
          probability?: number
          process?: string
          responsible?: string
          risk_level?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          details: Json
          id: string
          ip_address: string | null
          status: string
          target_resource: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          status?: string
          target_resource?: string | null
          timestamp?: string
          user_id?: string
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          ip_address?: string | null
          status?: string
          target_resource?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      stakeholders: {
        Row: {
          category: string
          communication_method: string | null
          company_id: string
          contact_info: string | null
          created_at: string
          expectations: string | null
          id: string
          influence_level: string
          interest_level: string
          name: string
          notes: string | null
          type: string
          updated_at: string
        }
        Insert: {
          category?: string
          communication_method?: string | null
          company_id?: string
          contact_info?: string | null
          created_at?: string
          expectations?: string | null
          id?: string
          influence_level?: string
          interest_level?: string
          name: string
          notes?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          category?: string
          communication_method?: string | null
          company_id?: string
          contact_info?: string | null
          created_at?: string
          expectations?: string | null
          id?: string
          influence_level?: string
          interest_level?: string
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stakeholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      supplier_evaluations: {
        Row: {
          category: string
          comments: string | null
          company_id: string
          created_at: string
          delivery_score: number | null
          evaluation_date: string
          evaluator: string
          id: string
          price_score: number | null
          quality_score: number | null
          status: string
          supplier_name: string
          support_score: number | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          comments?: string | null
          company_id?: string
          created_at?: string
          delivery_score?: number | null
          evaluation_date: string
          evaluator?: string
          id?: string
          price_score?: number | null
          quality_score?: number | null
          status?: string
          supplier_name: string
          support_score?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          comments?: string | null
          company_id?: string
          created_at?: string
          delivery_score?: number | null
          evaluation_date?: string
          evaluator?: string
          id?: string
          price_score?: number | null
          quality_score?: number | null
          status?: string
          supplier_name?: string
          support_score?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      tasks: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          employee_id: string | null
          id: string
          module: string | null
          personnel_request_id: string | null
          requester_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          id?: string
          module?: string | null
          personnel_request_id?: string | null
          requester_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          id?: string
          module?: string | null
          personnel_request_id?: string | null
          requester_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          duration: number | null
          empresa_id: string
          evaluation_method: string | null
          id: string
          status: string
          title: string
          trainer: string | null
          training_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          empresa_id?: string
          evaluation_method?: string | null
          id?: string
          status?: string
          title: string
          trainer?: string | null
          training_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          empresa_id?: string
          evaluation_method?: string | null
          id?: string
          status?: string
          title?: string
          trainer?: string | null
          training_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainings_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_evaluation_configs: {
        Row: {
          company_id: string
          created_at: string
          evaluation_criteria: Json
          evaluation_periods: Json
          id: string
          scale_max: number
          scale_min: number
          updated_at: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          evaluation_criteria?: Json
          evaluation_periods?: Json
          id?: string
          scale_max?: number
          scale_min?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          evaluation_criteria?: Json
          evaluation_periods?: Json
          id?: string
          scale_max?: number
          scale_min?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_evaluation_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_period_evaluations: {
        Row: {
          adaptation_score: number | null
          approved: boolean | null
          behavior_score: number | null
          comments: string | null
          company_id: string
          created_at: string
          decision_justification: string | null
          employee_id: string
          employee_signature_date: string | null
          evaluation_criteria_scores: Json
          evaluation_date: string
          evaluation_period_number: number
          evaluation_type: string
          evaluator_id: string | null
          final_decision: string | null
          hr_approved: boolean | null
          hr_approved_at: string | null
          hr_approver_id: string | null
          hr_signature_date: string | null
          id: string
          immediate_supervisor_id: string | null
          immediate_supervisor_name: string | null
          notification_sent: boolean
          performance_score: number | null
          sector: string | null
          supervisor_signature_date: string | null
          total_evaluation_periods: number
          updated_at: string
        }
        Insert: {
          adaptation_score?: number | null
          approved?: boolean | null
          behavior_score?: number | null
          comments?: string | null
          company_id?: string
          created_at?: string
          decision_justification?: string | null
          employee_id: string
          employee_signature_date?: string | null
          evaluation_criteria_scores?: Json
          evaluation_date: string
          evaluation_period_number?: number
          evaluation_type?: string
          evaluator_id?: string | null
          final_decision?: string | null
          hr_approved?: boolean | null
          hr_approved_at?: string | null
          hr_approver_id?: string | null
          hr_signature_date?: string | null
          id?: string
          immediate_supervisor_id?: string | null
          immediate_supervisor_name?: string | null
          notification_sent?: boolean
          performance_score?: number | null
          sector?: string | null
          supervisor_signature_date?: string | null
          total_evaluation_periods?: number
          updated_at?: string
        }
        Update: {
          adaptation_score?: number | null
          approved?: boolean | null
          behavior_score?: number | null
          comments?: string | null
          company_id?: string
          created_at?: string
          decision_justification?: string | null
          employee_id?: string
          employee_signature_date?: string | null
          evaluation_criteria_scores?: Json
          evaluation_date?: string
          evaluation_period_number?: number
          evaluation_type?: string
          evaluator_id?: string | null
          final_decision?: string | null
          hr_approved?: boolean | null
          hr_approved_at?: string | null
          hr_approver_id?: string | null
          hr_signature_date?: string | null
          id?: string
          immediate_supervisor_id?: string | null
          immediate_supervisor_name?: string | null
          notification_sent?: boolean
          performance_score?: number | null
          sector?: string | null
          supervisor_signature_date?: string | null
          total_evaluation_periods?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_period_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_period_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_period_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_period_evaluations_immediate_supervisor_id_fkey"
            columns: ["immediate_supervisor_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          allowed_modules: string[]
          ativo: boolean
          company_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          is_company_admin: boolean
          is_super_admin: boolean
          last_login: string | null
          last_name: string
          lgpd_consent: boolean
          lgpd_consent_date: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          allowed_modules?: string[]
          ativo?: boolean
          company_id?: string | null
          created_at?: string
          email: string
          first_name?: string
          id: string
          is_active?: boolean
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string
          lgpd_consent?: boolean
          lgpd_consent_date?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          allowed_modules?: string[]
          ativo?: boolean
          company_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string
          lgpd_consent?: boolean
          lgpd_consent_date?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          days_requested: number
          employee_id: string
          end_date: string
          id: string
          justification: string | null
          rejection_reason: string | null
          start_date: string
          status: string
          updated_at: string
          vacation_period_end: string | null
          vacation_period_start: string | null
          vacation_type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          days_requested?: number
          employee_id: string
          end_date: string
          id?: string
          justification?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
          vacation_period_end?: string | null
          vacation_period_start?: string | null
          vacation_type?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          days_requested?: number
          employee_id?: string
          end_date?: string
          id?: string
          justification?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          vacation_period_end?: string | null
          vacation_period_start?: string | null
          vacation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacation_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacation_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_company_rls: {
        Args: { p_column?: string; p_table: string }
        Returns: undefined
      }
      check_table_exists: { Args: { table_name: string }; Returns: boolean }
      ensure_default_cycle: { Args: { p_company: string }; Returns: string }
      generate_trial_evaluations_br: {
        Args: { employee_id: string; hire_date: string }
        Returns: number
      }
      get_company_by_id: {
        Args: { company_uuid: string }
        Returns: {
          cnpj: string
          id: string
          name: string
        }[]
      }
      get_disc_link_by_token: {
        Args: { p_token: string }
        Returns: {
          email: string
          entity_type: string
          expires_at: string
          name: string
        }[]
      }
      get_exit_interview_by_token: {
        Args: { p_token: string }
        Returns: {
          additional_comments: string | null
          company_id: string
          compensation_rating: number | null
          completed_at: string | null
          created_at: string
          employee_id: string
          employee_name: string
          employee_phone: string | null
          growth_opportunities_rating: number | null
          id: string
          interview_date: string | null
          link_expires_at: string
          management_rating: number | null
          overall_satisfaction: number | null
          reason_for_leaving: string | null
          status: string
          suggestions_for_improvement: string | null
          termination_date: string
          termination_reason: string | null
          token: string
          updated_at: string
          what_liked_least: string | null
          what_liked_most: string | null
          whatsapp_message_id: string | null
          whatsapp_sent_at: string | null
          work_environment_rating: number | null
          would_consider_returning: boolean | null
          would_recommend_company: boolean | null
        }[]
        SetofOptions: {
          from: "*"
          to: "hr_exit_interviews"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_security_logs_paginated: {
        Args: {
          action_filter?: string
          from_date?: string
          page_number?: number
          page_size?: number
          status_filter?: string
          to_date?: string
          user_id_filter?: string
        }
        Returns: {
          action: string
          details: Json
          event_timestamp: string
          id: string
          ip_address: string
          status: string
          target_resource: string
          total_count: number
          user_id: string
        }[]
      }
      get_user_company_safe: { Args: never; Returns: string }
      is_company_admin_safe: { Args: never; Returns: boolean }
      is_super_admin_safe: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          action_text: string
          details_json?: Json
          ip_address_text?: string
          status_text?: string
          target_resource_text?: string
          user_id_text?: string
        }
        Returns: string
      }
      submit_disc_assessment: {
        Args: { p_primary_type: string; p_scores: Json; p_token: string }
        Returns: string
      }
      submit_exit_interview: {
        Args: { p_answers: Json; p_token: string }
        Returns: boolean
      }
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
