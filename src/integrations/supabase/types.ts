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
      access_tokens: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          expires_at: string
          id: string
          token: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          expires_at: string
          id?: string
          token: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_tokens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      action_items: {
        Row: {
          action_plan_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          responsible: string | null
          status: string
          title: string
        }
        Insert: {
          action_plan_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          responsible?: string | null
          status?: string
          title: string
        }
        Update: {
          action_plan_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          responsible?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_action_plan_id_fkey"
            columns: ["action_plan_id"]
            isOneToOne: false
            referencedRelation: "action_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      action_plans: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          progress: number | null
          sector: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          sector?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          sector?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_master: boolean
          password: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_master?: boolean
          password: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_master?: boolean
          password?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_damage_reports: {
        Row: {
          assigned_to: string | null
          auto_generated: boolean
          company_id: string
          created_at: string
          description: string
          detected_issues: Json
          id: string
          inspection_id: string | null
          recommended_actions: Json | null
          report_type: string
          severity: string
          status: string
          updated_at: string
          verification_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          auto_generated?: boolean
          company_id: string
          created_at?: string
          description: string
          detected_issues: Json
          id?: string
          inspection_id?: string | null
          recommended_actions?: Json | null
          report_type: string
          severity?: string
          status?: string
          updated_at?: string
          verification_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          auto_generated?: boolean
          company_id?: string
          created_at?: string
          description?: string
          detected_issues?: Json
          id?: string
          inspection_id?: string | null
          recommended_actions?: Json | null
          report_type?: string
          severity?: string
          status?: string
          updated_at?: string
          verification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_damage_reports_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_damage_reports_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "ai_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_verifications: {
        Row: {
          ai_response: Json | null
          company_id: string
          confidence_score: number | null
          created_at: string
          discrepancies: Json | null
          error_message: string | null
          id: string
          inspection_id: string | null
          processed_at: string | null
          processing_time: number | null
          status: string
          verification_stage: string
        }
        Insert: {
          ai_response?: Json | null
          company_id: string
          confidence_score?: number | null
          created_at?: string
          discrepancies?: Json | null
          error_message?: string | null
          id?: string
          inspection_id?: string | null
          processed_at?: string | null
          processing_time?: number | null
          status?: string
          verification_stage: string
        }
        Update: {
          ai_response?: Json | null
          company_id?: string
          confidence_score?: number | null
          created_at?: string
          discrepancies?: Json | null
          error_message?: string | null
          id?: string
          inspection_id?: string | null
          processed_at?: string | null
          processing_time?: number | null
          status?: string
          verification_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_verifications_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string
          company_id: string
          content: string
          created_at: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          publish_date: string
          target_audience: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          company_id: string
          content: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          publish_date?: string
          target_audience?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          company_id?: string
          content?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          publish_date?: string
          target_audience?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_conversations: {
        Row: {
          content: string
          id: string
          module: string
          role: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          id?: string
          module: string
          role: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          id?: string
          module?: string
          role?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          created_at: string | null
          id: string
          is_exempt: boolean | null
          justification: string | null
          meeting_id: string
          member_id: string
          name: string
          spouse_name: string | null
          spouse_present: boolean | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_exempt?: boolean | null
          justification?: string | null
          meeting_id: string
          member_id: string
          name: string
          spouse_name?: string | null
          spouse_present?: boolean | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_exempt?: boolean | null
          justification?: string | null
          meeting_id?: string
          member_id?: string
          name?: string
          spouse_name?: string | null
          spouse_present?: boolean | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          area: string
          audit_date: string
          completion_date: string | null
          created_at: string
          description: string | null
          findings: string | null
          id: string
          responsible: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          area: string
          audit_date: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          findings?: string | null
          id?: string
          responsible: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          area?: string
          audit_date?: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          findings?: string | null
          id?: string
          responsible?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_assessment_links: {
        Row: {
          assessment_id: string
          candidate_email: string
          candidate_name: string
          created_at: string
          created_by: string | null
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
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          recruitment_process_id?: string | null
          token: string
          used?: boolean
        }
        Update: {
          assessment_id?: string
          candidate_email?: string
          candidate_name?: string
          created_at?: string
          created_by?: string | null
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
            foreignKeyName: "candidate_assessment_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_assessment_links_recruitment_process_id_fkey"
            columns: ["recruitment_process_id"]
            isOneToOne: false
            referencedRelation: "recruitment_processes"
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
          id: string
          link_id: string
          score: number | null
          submitted_at: string
        }
        Insert: {
          answers: Json
          assessment_id: string
          candidate_email: string
          candidate_name: string
          id?: string
          link_id: string
          score?: number | null
          submitted_at?: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          candidate_email?: string
          candidate_name?: string
          id?: string
          link_id?: string
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
          company_id: string
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
        Relationships: []
      }
      candidate_disc_evaluations: {
        Row: {
          candidate_id: string
          company_id: string
          compliance_score: number
          created_at: string
          dominance_score: number
          employee_id: string | null
          evaluation_date: string
          id: string
          influence_score: number
          primary_type: string
          report_url: string | null
          secondary_type: string | null
          steadiness_score: number
          updated_at: string
        }
        Insert: {
          candidate_id: string
          company_id: string
          compliance_score: number
          created_at?: string
          dominance_score: number
          employee_id?: string | null
          evaluation_date: string
          id?: string
          influence_score: number
          primary_type: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score: number
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string
          compliance_score?: number
          created_at?: string
          dominance_score?: number
          employee_id?: string | null
          evaluation_date?: string
          id?: string
          influence_score?: number
          primary_type?: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_disc_evaluations_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "hr_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_disc_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_disc_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          company_id: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          recruitment_process_id: string
          resume_url: string | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          recruitment_process_id: string
          resume_url?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          recruitment_process_id?: string
          resume_url?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_recruitment_process_id_fkey"
            columns: ["recruitment_process_id"]
            isOneToOne: false
            referencedRelation: "recruitment_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          address: string | null
          cnpj: string
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          rating: number | null
          specialties: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          cnpj: string
          company_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          cnpj?: string
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carriers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clickup_integrations: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      climate_survey_questions: {
        Row: {
          category: string
          company_id: string
          created_at: string | null
          id: string
          options: Json | null
          order_number: number
          question: string
          question_type: string
          required: boolean
          survey_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number: number
          question: string
          question_type?: string
          required?: boolean
          survey_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string | null
          id?: string
          options?: Json | null
          order_number?: number
          question?: string
          question_type?: string
          required?: boolean
          survey_id?: string
          updated_at?: string | null
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
          created_at: string | null
          employee_id: string | null
          id: string
          is_anonymous: boolean
          responses: Json
          submitted_at: string
          survey_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_anonymous?: boolean
          responses: Json
          submitted_at?: string
          survey_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
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
          created_at: string | null
          description: string
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
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
      colaboradores: {
        Row: {
          cargo: string
          company_id: string | null
          created_at: string
          departamento: string
          email_corporativo: string
          id: string
          nome: string
          status: string
          updated_at: string
        }
        Insert: {
          cargo: string
          company_id?: string | null
          created_at?: string
          departamento: string
          email_corporativo: string
          id?: string
          nome: string
          status?: string
          updated_at?: string
        }
        Update: {
          cargo?: string
          company_id?: string | null
          created_at?: string
          departamento?: string
          email_corporativo?: string
          id?: string
          nome?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_company_id_fkey"
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
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          plan: string
          potency: string | null
          responsible: string | null
          settings: Json
          slug: string
        }
        Insert: {
          active?: boolean
          active_modules?: string[]
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          plan?: string
          potency?: string | null
          responsible?: string | null
          settings?: Json
          slug: string
        }
        Update: {
          active?: boolean
          active_modules?: string[]
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string
          potency?: string | null
          responsible?: string | null
          settings?: Json
          slug?: string
        }
        Relationships: []
      }
      connection_test: {
        Row: {
          connection_time: string | null
          id: string
          message: string
        }
        Insert: {
          connection_time?: string | null
          id?: string
          message: string
        }
        Update: {
          connection_time?: string | null
          id?: string
          message?: string
        }
        Relationships: []
      }
      critical_analysis: {
        Row: {
          analysis_date: string
          attachments: Json | null
          created_at: string
          created_by: string
          empresa_id: string | null
          id: string
          inputs: Json | null
          participants: string[]
          results: Json | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          analysis_date: string
          attachments?: Json | null
          created_at?: string
          created_by: string
          empresa_id?: string | null
          id?: string
          inputs?: Json | null
          participants: string[]
          results?: Json | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          analysis_date?: string
          attachments?: Json | null
          created_at?: string
          created_by?: string
          empresa_id?: string | null
          id?: string
          inputs?: Json | null
          participants?: string[]
          results?: Json | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_complaints: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          complaint_date: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          customer_name: string
          description: string
          empresa_id: string | null
          id: string
          priority: string
          resolution: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          complaint_date: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_name: string
          description: string
          empresa_id?: string | null
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          complaint_date?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          customer_name?: string
          description?: string
          empresa_id?: string | null
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_satisfaction_surveys: {
        Row: {
          created_at: string
          customer_name: string
          delivery_satisfaction: number | null
          empresa_id: string | null
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
          created_at?: string
          customer_name: string
          delivery_satisfaction?: number | null
          empresa_id?: string | null
          id?: string
          overall_satisfaction?: number | null
          product_quality?: number | null
          service_quality?: number | null
          status?: string
          suggestions?: string | null
          survey_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          delivery_satisfaction?: number | null
          empresa_id?: string | null
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
        Relationships: []
      }
      departments: {
        Row: {
          approved_headcount: number | null
          company_id: string | null
          created_at: string | null
          current_headcount: number | null
          description: string | null
          id: string
          name: string
          responsible_employee_id: string | null
          sector: string | null
          updated_at: string | null
        }
        Insert: {
          approved_headcount?: number | null
          company_id?: string | null
          created_at?: string | null
          current_headcount?: number | null
          description?: string | null
          id?: string
          name: string
          responsible_employee_id?: string | null
          sector?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_headcount?: number | null
          company_id?: string | null
          created_at?: string | null
          current_headcount?: number | null
          description?: string | null
          id?: string
          name?: string
          responsible_employee_id?: string | null
          sector?: string | null
          updated_at?: string | null
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
          created_at: string | null
          creator_id: string
          development_areas: Json
          employee_id: string
          end_date: string
          id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          action_items: Json
          career_goal?: string | null
          company_id: string
          created_at?: string | null
          creator_id: string
          development_areas: Json
          employee_id: string
          end_date: string
          id?: string
          progress?: number
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          action_items?: Json
          career_goal?: string | null
          company_id?: string
          created_at?: string | null
          creator_id?: string
          development_areas?: Json
          employee_id?: string
          end_date?: string
          id?: string
          progress?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "development_plans_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
      diagnostic_submissions: {
        Row: {
          analysis: Json
          company_segment: string
          created_at: string
          email: string
          employee_count: string
          full_name: string
          id: string
          phone: string
          results: Json
          submission_id: string
          timestamp: string
        }
        Insert: {
          analysis: Json
          company_segment: string
          created_at?: string
          email: string
          employee_count: string
          full_name: string
          id?: string
          phone: string
          results: Json
          submission_id: string
          timestamp: string
        }
        Update: {
          analysis?: Json
          company_segment?: string
          created_at?: string
          email?: string
          employee_count?: string
          full_name?: string
          id?: string
          phone?: string
          results?: Json
          submission_id?: string
          timestamp?: string
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
      disc_evaluation_links: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          email: string
          entity_id: string
          entity_type: string
          expires_at: string
          id: string
          is_used: boolean
          name: string
          token: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          email: string
          entity_id: string
          entity_type: string
          expires_at?: string
          id?: string
          is_used?: boolean
          name: string
          token: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          entity_id?: string
          entity_type?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          name?: string
          token?: string
        }
        Relationships: []
      }
      disc_evaluation_templates: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          questions: Json
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          questions: Json
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          questions?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      disc_evaluations: {
        Row: {
          company_id: string
          compliance_score: number
          created_at: string | null
          dominance_score: number
          employee_id: string
          evaluation_date: string
          id: string
          influence_score: number
          primary_type: string
          report_url: string | null
          secondary_type: string | null
          steadiness_score: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          compliance_score: number
          created_at?: string | null
          dominance_score: number
          employee_id: string
          evaluation_date: string
          id?: string
          influence_score: number
          primary_type: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          compliance_score?: number
          created_at?: string | null
          dominance_score?: number
          employee_id?: string
          evaluation_date?: string
          id?: string
          influence_score?: number
          primary_type?: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disc_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disc_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      disc_responses: {
        Row: {
          c_score: number
          company_id: string
          created_at: string
          created_by: string | null
          d_score: number
          entity_id: string
          entity_type: string
          i_score: number
          id: string
          primary_type: string
          report_url: string | null
          responses: Json
          s_score: number
          secondary_type: string | null
          updated_at: string
        }
        Insert: {
          c_score: number
          company_id: string
          created_at?: string
          created_by?: string | null
          d_score: number
          entity_id: string
          entity_type: string
          i_score: number
          id?: string
          primary_type: string
          report_url?: string | null
          responses: Json
          s_score: number
          secondary_type?: string | null
          updated_at?: string
        }
        Update: {
          c_score?: number
          company_id?: string
          created_at?: string
          created_by?: string | null
          d_score?: number
          entity_id?: string
          entity_type?: string
          i_score?: number
          id?: string
          primary_type?: string
          report_url?: string | null
          responses?: Json
          s_score?: number
          secondary_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_revisions: {
        Row: {
          approved_by: string | null
          changes: string | null
          content: string
          document_id: string | null
          empresa_id: string | null
          id: string
          revision_date: string
          version: string
        }
        Insert: {
          approved_by?: string | null
          changes?: string | null
          content: string
          document_id?: string | null
          empresa_id?: string | null
          id?: string
          revision_date?: string
          version: string
        }
        Update: {
          approved_by?: string | null
          changes?: string | null
          content?: string
          document_id?: string | null
          empresa_id?: string | null
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
      employee_training_compliance: {
        Row: {
          assigned_date: string | null
          certificate_url: string | null
          company_id: string
          completion_date: string | null
          created_at: string
          due_date: string | null
          employee_id: string
          id: string
          notes: string | null
          requirement_id: string
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_date?: string | null
          certificate_url?: string | null
          company_id: string
          completion_date?: string | null
          created_at?: string
          due_date?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          requirement_id: string
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_date?: string | null
          certificate_url?: string | null
          company_id?: string
          completion_date?: string | null
          created_at?: string
          due_date?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          requirement_id?: string
          score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_compliance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_training_compliance_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "job_position_training_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_trainings: {
        Row: {
          certificate_url: string | null
          company_id: string
          completion_date: string | null
          created_at: string | null
          employee_id: string
          id: string
          score: number | null
          start_date: string | null
          status: string
          training_id: string
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          company_id: string
          completion_date?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          score?: number | null
          start_date?: string | null
          status?: string
          training_id: string
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          company_id?: string
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          score?: number | null
          start_date?: string | null
          status?: string
          training_id?: string
          updated_at?: string | null
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
            referencedRelation: "training_matrix"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string | null
          department: string
          department_id: string | null
          email: string
          empresa_id: string | null
          hire_date: string
          id: string
          name: string
          phone: string | null
          position: string
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id: string
          created_at?: string | null
          department: string
          department_id?: string | null
          email: string
          empresa_id?: string | null
          hire_date: string
          id?: string
          name: string
          phone?: string | null
          position: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string | null
          department?: string
          department_id?: string | null
          email?: string
          empresa_id?: string | null
          hire_date?: string
          id?: string
          name?: string
          phone?: string | null
          position?: string
          status?: string
          updated_at?: string | null
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
            foreignKeyName: "employees_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          id_responsavel: string | null
          nome: string
          setor: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          id_responsavel?: string | null
          nome: string
          setor?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          id_responsavel?: string | null
          nome?: string
          setor?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_calibrations: {
        Row: {
          calibration_date: string
          calibration_entity: string
          certificate_number: string | null
          created_at: string
          empresa_id: string | null
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
          calibration_entity: string
          certificate_number?: string | null
          created_at?: string
          empresa_id?: string | null
          equipment_id: string
          equipment_name: string
          id?: string
          next_calibration_date: string
          observations?: string | null
          responsible: string
          status?: string
          updated_at?: string
        }
        Update: {
          calibration_date?: string
          calibration_entity?: string
          certificate_number?: string | null
          created_at?: string
          empresa_id?: string | null
          equipment_id?: string
          equipment_name?: string
          id?: string
          next_calibration_date?: string
          observations?: string | null
          responsible?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      external_attendees: {
        Row: {
          created_at: string | null
          id: string
          meeting_id: string
          name: string
          relationship: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_id: string
          name: string
          relationship?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_id?: string
          name?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_attendees_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      external_audits: {
        Row: {
          audit_date: string
          auditor_company: string | null
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
          completion_date?: string | null
          created_at?: string
          description?: string | null
          external_auditor: string
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
        Relationships: []
      }
      feedbacks: {
        Row: {
          company_id: string
          content: string
          created_at: string | null
          feedback_type: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          title: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string | null
          feedback_type: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          title: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string | null
          feedback_type?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      freight_quotes: {
        Row: {
          collection_date: string
          company_id: string
          created_at: string
          created_by: string
          delivery_date: string
          destination_address: string
          destination_city: string
          destination_zip_code: string
          id: string
          observations: string | null
          origin_address: string
          origin_city: string
          origin_zip_code: string
          payment_method: string
          payment_term: string
          quote_number: string
          selected_carrier_id: string | null
          selected_response_id: string | null
          status: string
          total_volume: number | null
          total_weight: number | null
          updated_at: string
        }
        Insert: {
          collection_date: string
          company_id: string
          created_at?: string
          created_by: string
          delivery_date: string
          destination_address: string
          destination_city: string
          destination_zip_code: string
          id?: string
          observations?: string | null
          origin_address: string
          origin_city: string
          origin_zip_code: string
          payment_method: string
          payment_term: string
          quote_number: string
          selected_carrier_id?: string | null
          selected_response_id?: string | null
          status?: string
          total_volume?: number | null
          total_weight?: number | null
          updated_at?: string
        }
        Update: {
          collection_date?: string
          company_id?: string
          created_at?: string
          created_by?: string
          delivery_date?: string
          destination_address?: string
          destination_city?: string
          destination_zip_code?: string
          id?: string
          observations?: string | null
          origin_address?: string
          origin_city?: string
          origin_zip_code?: string
          payment_method?: string
          payment_term?: string
          quote_number?: string
          selected_carrier_id?: string | null
          selected_response_id?: string | null
          status?: string
          total_volume?: number | null
          total_weight?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freight_quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_quotes_selected_carrier_id_fkey"
            columns: ["selected_carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_admission_processes: {
        Row: {
          candidate_id: string
          company_id: string
          completion_date: string | null
          completion_percentage: number
          created_at: string
          document_checklist: Json
          employee_id: string | null
          id: string
          job_opening_id: string
          notes: string | null
          responsible_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          company_id: string
          completion_date?: string | null
          completion_percentage?: number
          created_at?: string
          document_checklist?: Json
          employee_id?: string | null
          id?: string
          job_opening_id: string
          notes?: string | null
          responsible_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string
          completion_date?: string | null
          completion_percentage?: number
          created_at?: string
          document_checklist?: Json
          employee_id?: string | null
          id?: string
          job_opening_id?: string
          notes?: string | null
          responsible_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_admission_processes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "hr_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_admission_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_admission_processes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_admission_processes_job_opening_id_fkey"
            columns: ["job_opening_id"]
            isOneToOne: false
            referencedRelation: "hr_job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_announcements: {
        Row: {
          author_id: string
          company_id: string
          content: string
          created_at: string
          expiry_date: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          publish_date: string
          target_audience: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          company_id: string
          content: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          publish_date?: string
          target_audience?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          company_id?: string
          content?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          publish_date?: string
          target_audience?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_announcements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_applications: {
        Row: {
          application_date: string
          candidate_id: string
          company_id: string
          cover_letter: string | null
          created_at: string
          current_stage: string
          id: string
          job_opening_id: string
          notes: string | null
          referral_person: string | null
          referral_source: string | null
          rejection_reason: string | null
          resume_score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          application_date?: string
          candidate_id: string
          company_id: string
          cover_letter?: string | null
          created_at?: string
          current_stage?: string
          id?: string
          job_opening_id: string
          notes?: string | null
          referral_person?: string | null
          referral_source?: string | null
          rejection_reason?: string | null
          resume_score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          application_date?: string
          candidate_id?: string
          company_id?: string
          cover_letter?: string | null
          created_at?: string
          current_stage?: string
          id?: string
          job_opening_id?: string
          notes?: string | null
          referral_person?: string | null
          referral_source?: string | null
          rejection_reason?: string | null
          resume_score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "hr_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_applications_job_opening_id_fkey"
            columns: ["job_opening_id"]
            isOneToOne: false
            referencedRelation: "hr_job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_approved_positions: {
        Row: {
          approved_count: number
          company_id: string
          created_at: string
          created_by: string | null
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
          company_id: string
          created_at?: string
          created_by?: string | null
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
          created_by?: string | null
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
            foreignKeyName: "fk_approved_positions_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "hr_departments"
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
      hr_candidate_assessments: {
        Row: {
          application_id: string
          areas_for_improvement: string | null
          assessment_date: string
          assessment_type: string
          assessor_id: string
          behavioral_competencies: Json | null
          comments: string | null
          company_id: string
          created_at: string
          fit_for_role: string
          id: string
          overall_rating: number | null
          strengths: string | null
          technical_skills: Json | null
          updated_at: string
        }
        Insert: {
          application_id: string
          areas_for_improvement?: string | null
          assessment_date?: string
          assessment_type: string
          assessor_id: string
          behavioral_competencies?: Json | null
          comments?: string | null
          company_id: string
          created_at?: string
          fit_for_role?: string
          id?: string
          overall_rating?: number | null
          strengths?: string | null
          technical_skills?: Json | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          areas_for_improvement?: string | null
          assessment_date?: string
          assessment_type?: string
          assessor_id?: string
          behavioral_competencies?: Json | null
          comments?: string | null
          company_id?: string
          created_at?: string
          fit_for_role?: string
          id?: string
          overall_rating?: number | null
          strengths?: string | null
          technical_skills?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_candidate_assessments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "hr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_candidate_assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_candidates: {
        Row: {
          company_id: string
          created_at: string
          current_job_title: string | null
          education: string | null
          email: string
          expected_salary: number | null
          experience: string | null
          first_name: string
          id: string
          is_available: boolean
          is_hired: boolean | null
          last_name: string
          linkedin_url: string | null
          location: string | null
          notes: string | null
          notice_period: string | null
          other_social_media: Json | null
          phone: string | null
          resume_url: string | null
          skills: string[] | null
          source: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_job_title?: string | null
          education?: string | null
          email: string
          expected_salary?: number | null
          experience?: string | null
          first_name: string
          id?: string
          is_available?: boolean
          is_hired?: boolean | null
          last_name: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          notice_period?: string | null
          other_social_media?: Json | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_job_title?: string | null
          education?: string | null
          email?: string
          expected_salary?: number | null
          experience?: string | null
          first_name?: string
          id?: string
          is_available?: boolean
          is_hired?: boolean | null
          last_name?: string
          linkedin_url?: string | null
          location?: string | null
          notes?: string | null
          notice_period?: string | null
          other_social_media?: Json | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_candidates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_climate_survey_questions: {
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
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          id?: string
          options?: Json | null
          order_number: number
          question: string
          question_type?: string
          required?: boolean
          survey_id: string
          updated_at?: string
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
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_climate_survey_questions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_climate_survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "hr_climate_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_climate_survey_responses: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string | null
          id: string
          is_anonymous: boolean
          responses: Json
          submitted_at: string
          survey_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id?: string | null
          id?: string
          is_anonymous?: boolean
          responses: Json
          submitted_at?: string
          survey_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          is_anonymous?: boolean
          responses?: Json
          submitted_at?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_climate_survey_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_climate_survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "hr_climate_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_climate_surveys: {
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
          company_id: string
          created_at?: string
          description: string
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
            foreignKeyName: "hr_climate_surveys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_company_documents: {
        Row: {
          company_id: string
          content: string | null
          created_at: string
          document_type: string
          file_url: string | null
          id: string
          published_date: string
          required_acknowledgment: boolean
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          company_id: string
          content?: string | null
          created_at?: string
          document_type: string
          file_url?: string | null
          id?: string
          published_date: string
          required_acknowledgment?: boolean
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          company_id?: string
          content?: string | null
          created_at?: string
          document_type?: string
          file_url?: string | null
          id?: string
          published_date?: string
          required_acknowledgment?: boolean
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_departments: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          parent_department_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          parent_department_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_development_plans: {
        Row: {
          action_items: Json
          career_goal: string | null
          company_id: string
          created_at: string
          creator_id: string
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
          action_items: Json
          career_goal?: string | null
          company_id: string
          created_at?: string
          creator_id: string
          development_areas: Json
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
          creator_id?: string
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
            foreignKeyName: "hr_development_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_disc_evaluations: {
        Row: {
          company_id: string
          compliance_score: number
          created_at: string
          dominance_score: number
          employee_id: string
          evaluation_date: string
          id: string
          influence_score: number
          primary_type: string
          report_url: string | null
          secondary_type: string | null
          steadiness_score: number
          updated_at: string
        }
        Insert: {
          company_id: string
          compliance_score: number
          created_at?: string
          dominance_score: number
          employee_id: string
          evaluation_date: string
          id?: string
          influence_score: number
          primary_type: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          compliance_score?: number
          created_at?: string
          dominance_score?: number
          employee_id?: string
          evaluation_date?: string
          id?: string
          influence_score?: number
          primary_type?: string
          report_url?: string | null
          secondary_type?: string | null
          steadiness_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_disc_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_document_acknowledgments: {
        Row: {
          acknowledged: boolean
          acknowledgment_date: string | null
          company_id: string
          created_at: string
          document_id: string
          employee_id: string
          id: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledgment_date?: string | null
          company_id: string
          created_at?: string
          document_id: string
          employee_id: string
          id?: string
        }
        Update: {
          acknowledged?: boolean
          acknowledgment_date?: string | null
          company_id?: string
          created_at?: string
          document_id?: string
          employee_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_document_acknowledgments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_document_acknowledgments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "hr_company_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_documents: {
        Row: {
          company_id: string
          created_at: string
          document_type: string
          document_url: string | null
          employee_id: string
          expiry_date: string | null
          id: string
          notes: string | null
          signed: boolean
          signed_at: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          document_type: string
          document_url?: string | null
          employee_id: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          signed?: boolean
          signed_at?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          document_type?: string
          document_url?: string | null
          employee_id?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          signed?: boolean
          signed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_movements: {
        Row: {
          approver_id: string | null
          comments: string | null
          company_id: string
          created_at: string
          effective_date: string
          employee_id: string
          from_department_id: string | null
          from_position_id: string | null
          id: string
          justification: string
          movement_type: string
          new_salary: number | null
          previous_salary: number | null
          requester_id: string
          status: string
          to_department_id: string | null
          to_position_id: string | null
          updated_at: string
        }
        Insert: {
          approver_id?: string | null
          comments?: string | null
          company_id: string
          created_at?: string
          effective_date: string
          employee_id: string
          from_department_id?: string | null
          from_position_id?: string | null
          id?: string
          justification: string
          movement_type: string
          new_salary?: number | null
          previous_salary?: number | null
          requester_id: string
          status?: string
          to_department_id?: string | null
          to_position_id?: string | null
          updated_at?: string
        }
        Update: {
          approver_id?: string | null
          comments?: string | null
          company_id?: string
          created_at?: string
          effective_date?: string
          employee_id?: string
          from_department_id?: string | null
          from_position_id?: string | null
          id?: string
          justification?: string
          movement_type?: string
          new_salary?: number | null
          previous_salary?: number | null
          requester_id?: string
          status?: string
          to_department_id?: string | null
          to_position_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_movements_from_department_id_fkey"
            columns: ["from_department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_movements_from_position_id_fkey"
            columns: ["from_position_id"]
            isOneToOne: false
            referencedRelation: "hr_job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_movements_to_department_id_fkey"
            columns: ["to_department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_movements_to_position_id_fkey"
            columns: ["to_position_id"]
            isOneToOne: false
            referencedRelation: "hr_job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_occurrences: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          days_count: number | null
          document_url: string | null
          employee_id: string
          end_date: string | null
          hours_count: number | null
          id: string
          occurrence_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          days_count?: number | null
          document_url?: string | null
          employee_id: string
          end_date?: string | null
          hours_count?: number | null
          id?: string
          occurrence_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          days_count?: number | null
          document_url?: string | null
          employee_id?: string
          end_date?: string | null
          hours_count?: number | null
          id?: string
          occurrence_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_occurrences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_trainings: {
        Row: {
          certificate_url: string | null
          company_id: string
          completion_date: string | null
          created_at: string
          employee_id: string
          feedback: string | null
          id: string
          score: number | null
          status: string
          training_id: string
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          company_id: string
          completion_date?: string | null
          created_at?: string
          employee_id: string
          feedback?: string | null
          id?: string
          score?: number | null
          status?: string
          training_id: string
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          company_id?: string
          completion_date?: string | null
          created_at?: string
          employee_id?: string
          feedback?: string | null
          id?: string
          score?: number | null
          status?: string
          training_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_trainings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_trainings_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "hr_trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_equipment: {
        Row: {
          acquisition_date: string | null
          assigned_date: string | null
          assigned_to: string | null
          company_id: string
          created_at: string
          expected_return_date: string | null
          id: string
          name: string
          notes: string | null
          serial_number: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          acquisition_date?: string | null
          assigned_date?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string
          expected_return_date?: string | null
          id?: string
          name: string
          notes?: string | null
          serial_number?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          acquisition_date?: string | null
          assigned_date?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          expected_return_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          serial_number?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_equipment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_exit_interviews: {
        Row: {
          colleagues_feedback: string | null
          company_feedback: string | null
          company_id: string
          created_at: string
          employee_id: string
          exit_date: string
          id: string
          interview_date: string | null
          interviewer_id: string | null
          manager_feedback: string | null
          reason_for_leaving: string
          status: string
          suggestions: string | null
          updated_at: string
          would_return: boolean | null
        }
        Insert: {
          colleagues_feedback?: string | null
          company_feedback?: string | null
          company_id: string
          created_at?: string
          employee_id: string
          exit_date: string
          id?: string
          interview_date?: string | null
          interviewer_id?: string | null
          manager_feedback?: string | null
          reason_for_leaving: string
          status?: string
          suggestions?: string | null
          updated_at?: string
          would_return?: boolean | null
        }
        Update: {
          colleagues_feedback?: string | null
          company_feedback?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string
          exit_date?: string
          id?: string
          interview_date?: string | null
          interviewer_id?: string | null
          manager_feedback?: string | null
          reason_for_leaving?: string
          status?: string
          suggestions?: string | null
          updated_at?: string
          would_return?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_exit_interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_feedbacks: {
        Row: {
          company_id: string
          content: string
          created_at: string
          feedback_type: string
          id: string
          receiver_id: string
          sender_id: string
          status: string
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          feedback_type: string
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          feedback_type?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_feedbacks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_interviews: {
        Row: {
          application_id: string
          company_id: string
          created_at: string
          duration: number
          feedback: string | null
          id: string
          interview_date: string
          interview_type: string
          interviewer_id: string
          location: string | null
          recommendation: string
          score: number | null
          status: string
          strengths: string | null
          updated_at: string
          weaknesses: string | null
        }
        Insert: {
          application_id: string
          company_id: string
          created_at?: string
          duration: number
          feedback?: string | null
          id?: string
          interview_date: string
          interview_type: string
          interviewer_id: string
          location?: string | null
          recommendation?: string
          score?: number | null
          status?: string
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Update: {
          application_id?: string
          company_id?: string
          created_at?: string
          duration?: number
          feedback?: string | null
          id?: string
          interview_date?: string
          interview_type?: string
          interviewer_id?: string
          location?: string | null
          recommendation?: string
          score?: number | null
          status?: string
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "hr_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_job_openings: {
        Row: {
          application_deadline: string | null
          company_id: string
          created_at: string
          created_by: string
          department_id: string
          description: string
          id: string
          is_internal: boolean
          is_published: boolean
          job_position_id: string
          location: string | null
          requirements: string | null
          responsibilities: string | null
          status: string
          title: string
          type: string
          updated_at: string
          vacancies: number
        }
        Insert: {
          application_deadline?: string | null
          company_id: string
          created_at?: string
          created_by: string
          department_id: string
          description: string
          id?: string
          is_internal?: boolean
          is_published?: boolean
          job_position_id: string
          location?: string | null
          requirements?: string | null
          responsibilities?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          vacancies?: number
        }
        Update: {
          application_deadline?: string | null
          company_id?: string
          created_at?: string
          created_by?: string
          department_id?: string
          description?: string
          id?: string
          is_internal?: boolean
          is_published?: boolean
          job_position_id?: string
          location?: string | null
          requirements?: string | null
          responsibilities?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          vacancies?: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_job_openings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_job_openings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_job_openings_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "hr_job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_job_positions: {
        Row: {
          company_id: string
          created_at: string
          department_id: string
          description: string | null
          id: string
          is_active: boolean
          requirements: string | null
          responsibilities: string | null
          salary_range_max: number | null
          salary_range_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          department_id: string
          description?: string | null
          id?: string
          is_active?: boolean
          requirements?: string | null
          responsibilities?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department_id?: string
          description?: string | null
          id?: string
          is_active?: boolean
          requirements?: string | null
          responsibilities?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_job_positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_job_positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_mood_checkins: {
        Row: {
          check_in_date: string
          comment: string | null
          company_id: string
          created_at: string
          employee_id: string
          id: string
          mood_score: number
        }
        Insert: {
          check_in_date?: string
          comment?: string | null
          company_id: string
          created_at?: string
          employee_id: string
          id?: string
          mood_score: number
        }
        Update: {
          check_in_date?: string
          comment?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          mood_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_mood_checkins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          reference_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      hr_onboarding_processes: {
        Row: {
          checklist: Json | null
          company_id: string
          completion_percentage: number
          created_at: string
          employee_id: string
          end_date: string | null
          id: string
          notes: string | null
          responsible_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          checklist?: Json | null
          company_id: string
          completion_percentage?: number
          created_at?: string
          employee_id: string
          end_date?: string | null
          id?: string
          notes?: string | null
          responsible_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          checklist?: Json | null
          company_id?: string
          completion_percentage?: number
          created_at?: string
          employee_id?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          responsible_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_onboarding_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_organization_structure: {
        Row: {
          company_id: string
          created_at: string
          department_id: string
          employee_id: string
          end_date: string | null
          id: string
          is_current: boolean
          job_position_id: string
          manager_id: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          department_id: string
          employee_id: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_position_id: string
          manager_id?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department_id?: string
          employee_id?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_position_id?: string
          manager_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_organization_structure_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_organization_structure_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_organization_structure_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "hr_job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_performance_evaluations: {
        Row: {
          approved: boolean | null
          comments: string | null
          company_id: string
          created_at: string
          development_plan: string | null
          employee_comments: string | null
          employee_id: string
          evaluation_date: string
          evaluation_period: string
          evaluation_type: string
          evaluator_id: string
          goals_achievement_score: number | null
          id: string
          improvement_areas: string | null
          overall_score: number | null
          skills_score: number | null
          status: string
          strengths: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          comments?: string | null
          company_id: string
          created_at?: string
          development_plan?: string | null
          employee_comments?: string | null
          employee_id: string
          evaluation_date: string
          evaluation_period: string
          evaluation_type: string
          evaluator_id: string
          goals_achievement_score?: number | null
          id?: string
          improvement_areas?: string | null
          overall_score?: number | null
          skills_score?: number | null
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          comments?: string | null
          company_id?: string
          created_at?: string
          development_plan?: string | null
          employee_comments?: string | null
          employee_id?: string
          evaluation_date?: string
          evaluation_period?: string
          evaluation_type?: string
          evaluator_id?: string
          goals_achievement_score?: number | null
          id?: string
          improvement_areas?: string | null
          overall_score?: number | null
          skills_score?: number | null
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_performance_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_personnel_movements: {
        Row: {
          approver_id: string | null
          comments: string | null
          company_id: string
          created_at: string
          effective_date: string | null
          employee_id: string | null
          from_department_id: string | null
          from_position_id: string | null
          id: string
          justification: string
          movement_type: string
          new_salary: number | null
          previous_salary: number | null
          requester_id: string | null
          status: string
          to_department_id: string | null
          to_position_id: string | null
          updated_at: string
        }
        Insert: {
          approver_id?: string | null
          comments?: string | null
          company_id: string
          created_at?: string
          effective_date?: string | null
          employee_id?: string | null
          from_department_id?: string | null
          from_position_id?: string | null
          id?: string
          justification: string
          movement_type: string
          new_salary?: number | null
          previous_salary?: number | null
          requester_id?: string | null
          status?: string
          to_department_id?: string | null
          to_position_id?: string | null
          updated_at?: string
        }
        Update: {
          approver_id?: string | null
          comments?: string | null
          company_id?: string
          created_at?: string
          effective_date?: string | null
          employee_id?: string | null
          from_department_id?: string | null
          from_position_id?: string | null
          id?: string
          justification?: string
          movement_type?: string
          new_salary?: number | null
          previous_salary?: number | null
          requester_id?: string | null
          status?: string
          to_department_id?: string | null
          to_position_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_personnel_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_personnel_movements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_personnel_movements_from_department_id_fkey"
            columns: ["from_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_personnel_movements_from_position_id_fkey"
            columns: ["from_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_personnel_movements_to_department_id_fkey"
            columns: ["to_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_personnel_movements_to_position_id_fkey"
            columns: ["to_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_room_reservations: {
        Row: {
          attendees: Json | null
          company_id: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          room_id: string
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: Json | null
          company_id: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          room_id: string
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: Json | null
          company_id?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          room_id?: string
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_room_reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_room_reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hr_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_rooms: {
        Row: {
          amenities: Json | null
          available: boolean
          capacity: number
          company_id: string
          created_at: string
          id: string
          image_url: string | null
          location: string
          name: string
          room_type: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          available?: boolean
          capacity: number
          company_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          location: string
          name: string
          room_type: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          available?: boolean
          capacity?: number
          company_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_trainings: {
        Row: {
          company_id: string
          cost: number | null
          created_at: string
          department: string | null
          description: string | null
          duration: number | null
          end_date: string | null
          evaluation_method: string | null
          id: string
          instructor: string | null
          location: string | null
          max_participants: number | null
          participants: Json | null
          procedure_id: string | null
          provider: string | null
          start_date: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          cost?: number | null
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          evaluation_method?: string | null
          id?: string
          instructor?: string | null
          location?: string | null
          max_participants?: number | null
          participants?: Json | null
          procedure_id?: string | null
          provider?: string | null
          start_date: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          cost?: number | null
          created_at?: string
          department?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          evaluation_method?: string | null
          id?: string
          instructor?: string | null
          location?: string | null
          max_participants?: number | null
          participants?: Json | null
          procedure_id?: string | null
          provider?: string | null
          start_date?: string
          status?: string
          title?: string
          type?: string
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
      hr_turnover_metrics: {
        Row: {
          company_id: string
          created_at: string
          department_id: string | null
          id: string
          involuntary_terminations: number
          month: number
          new_hires: number
          total_employees: number
          turnover_rate: number
          updated_at: string
          voluntary_terminations: number
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string
          department_id?: string | null
          id?: string
          involuntary_terminations: number
          month: number
          new_hires: number
          total_employees: number
          turnover_rate: number
          updated_at?: string
          voluntary_terminations: number
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string
          department_id?: string | null
          id?: string
          involuntary_terminations?: number
          month?: number
          new_hires?: number
          total_employees?: number
          turnover_rate?: number
          updated_at?: string
          voluntary_terminations?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_turnover_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_turnover_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_vacation_requests: {
        Row: {
          approval_date: string | null
          company_id: string
          created_at: string
          employee_id: string
          end_date: string
          id: string
          manager_id: string
          notes: string | null
          start_date: string
          status: string
          total_days: number
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          company_id: string
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          manager_id: string
          notes?: string | null
          start_date: string
          status?: string
          total_days: number
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          manager_id?: string
          notes?: string | null
          start_date?: string
          status?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_vacation_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      indicator_measurements: {
        Row: {
          created_at: string
          id: string
          indicator_id: string
          month: number
          notes: string | null
          updated_at: string
          value: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          indicator_id: string
          month: number
          notes?: string | null
          updated_at?: string
          value: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          indicator_id?: string
          month?: number
          notes?: string | null
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
      inspection_documents: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          inspection_id: string | null
          upload_date: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          inspection_id?: string | null
          upload_date?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          inspection_id?: string | null
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_documents_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          ai_processing_completed_at: string | null
          ai_processing_started_at: string | null
          ai_verification_status: string | null
          batch_number: string
          company_id: string
          created_at: string
          created_by: string | null
          has_discrepancies: boolean | null
          id: string
          inspection_criteria: Json | null
          inspection_date: string
          inspection_result: string
          inspector: string
          invoice_number: string | null
          material_name: string
          non_conformity: string | null
          observations: string | null
          purchase_order_number: string | null
          quantity: number
          supplier: string
          unit: string
          updated_at: string
        }
        Insert: {
          ai_processing_completed_at?: string | null
          ai_processing_started_at?: string | null
          ai_verification_status?: string | null
          batch_number: string
          company_id: string
          created_at?: string
          created_by?: string | null
          has_discrepancies?: boolean | null
          id?: string
          inspection_criteria?: Json | null
          inspection_date: string
          inspection_result: string
          inspector: string
          invoice_number?: string | null
          material_name: string
          non_conformity?: string | null
          observations?: string | null
          purchase_order_number?: string | null
          quantity: number
          supplier: string
          unit: string
          updated_at?: string
        }
        Update: {
          ai_processing_completed_at?: string | null
          ai_processing_started_at?: string | null
          ai_verification_status?: string | null
          batch_number?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          has_discrepancies?: boolean | null
          id?: string
          inspection_criteria?: Json | null
          inspection_date?: string
          inspection_result?: string
          inspector?: string
          invoice_number?: string | null
          material_name?: string
          non_conformity?: string | null
          observations?: string | null
          purchase_order_number?: string | null
          quantity?: number
          supplier?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      iso_documents: {
        Row: {
          approval_date: string | null
          archiving_time: string | null
          associated_requirement: string
          content: string | null
          created_at: string
          description: string | null
          disposal_method: string | null
          distribution_location: string | null
          document_code: string | null
          document_type: string
          empresa_id: string | null
          id: string
          internal_external: string | null
          process: string | null
          protection: string | null
          recovery_method: string | null
          responsible: string | null
          retention_time: string | null
          revision: string | null
          standard_item: string | null
          status: string | null
          storage_location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          archiving_time?: string | null
          associated_requirement: string
          content?: string | null
          created_at?: string
          description?: string | null
          disposal_method?: string | null
          distribution_location?: string | null
          document_code?: string | null
          document_type: string
          empresa_id?: string | null
          id?: string
          internal_external?: string | null
          process?: string | null
          protection?: string | null
          recovery_method?: string | null
          responsible?: string | null
          retention_time?: string | null
          revision?: string | null
          standard_item?: string | null
          status?: string | null
          storage_location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          archiving_time?: string | null
          associated_requirement?: string
          content?: string | null
          created_at?: string
          description?: string | null
          disposal_method?: string | null
          distribution_location?: string | null
          document_code?: string | null
          document_type?: string
          empresa_id?: string | null
          id?: string
          internal_external?: string | null
          process?: string | null
          protection?: string | null
          recovery_method?: string | null
          responsible?: string | null
          retention_time?: string | null
          revision?: string | null
          standard_item?: string | null
          status?: string | null
          storage_location?: string | null
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
          empresa_id: string | null
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
          empresa_id?: string | null
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
          empresa_id?: string | null
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
      job_position_training_requirements: {
        Row: {
          company_id: string
          completion_deadline_days: number | null
          created_at: string
          created_by: string | null
          id: string
          is_mandatory: boolean
          job_position_id: string
          procedure_id: string | null
          training_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          completion_deadline_days?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_mandatory?: boolean
          job_position_id: string
          procedure_id?: string | null
          training_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          completion_deadline_days?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_mandatory?: boolean
          job_position_id?: string
          procedure_id?: string | null
          training_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_position_training_requirements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_position_training_requirements_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_position_training_requirements_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "iso_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_position_training_requirements_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "hr_trainings"
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
          created_at: string | null
          department: string
          department_id: string | null
          description: string
          education_requirements: string | null
          experience_requirements: string | null
          id: string
          immediate_supervisor_position: string | null
          is_department_head: boolean | null
          is_supervisor: boolean | null
          main_responsibilities: string | null
          norm: string | null
          required_ppe: Json | null
          required_procedures: Json | null
          required_resources: Json | null
          requirements: string | null
          responsibilities: string | null
          revision: string | null
          skill_requirements: string | null
          status: string | null
          superior_position_id: string | null
          title: string
          training_requirements: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approver?: string | null
          cbo_code?: string | null
          code?: string | null
          company_id: string
          created_at?: string | null
          department: string
          department_id?: string | null
          description: string
          education_requirements?: string | null
          experience_requirements?: string | null
          id?: string
          immediate_supervisor_position?: string | null
          is_department_head?: boolean | null
          is_supervisor?: boolean | null
          main_responsibilities?: string | null
          norm?: string | null
          required_ppe?: Json | null
          required_procedures?: Json | null
          required_resources?: Json | null
          requirements?: string | null
          responsibilities?: string | null
          revision?: string | null
          skill_requirements?: string | null
          status?: string | null
          superior_position_id?: string | null
          title: string
          training_requirements?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approver?: string | null
          cbo_code?: string | null
          code?: string | null
          company_id?: string
          created_at?: string | null
          department?: string
          department_id?: string | null
          description?: string
          education_requirements?: string | null
          experience_requirements?: string | null
          id?: string
          immediate_supervisor_position?: string | null
          is_department_head?: boolean | null
          is_supervisor?: boolean | null
          main_responsibilities?: string | null
          norm?: string | null
          required_ppe?: Json | null
          required_procedures?: Json | null
          required_resources?: Json | null
          requirements?: string | null
          responsibilities?: string | null
          revision?: string | null
          skill_requirements?: string | null
          status?: string | null
          superior_position_id?: string | null
          title?: string
          training_requirements?: string | null
          updated_at?: string | null
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
            foreignKeyName: "job_positions_department_id_fkey"
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
      jobs: {
        Row: {
          approval_url: string | null
          clickup_task_id: string | null
          clientname: string
          clientphone: string
          createdat: string | null
          description: string | null
          id: string
          materiallink: string
          title: string
          updatedat: string | null
        }
        Insert: {
          approval_url?: string | null
          clickup_task_id?: string | null
          clientname: string
          clientphone: string
          createdat?: string | null
          description?: string | null
          id?: string
          materiallink: string
          title: string
          updatedat?: string | null
        }
        Update: {
          approval_url?: string | null
          clickup_task_id?: string | null
          clientname?: string
          clientphone?: string
          createdat?: string | null
          description?: string | null
          id?: string
          materiallink?: string
          title?: string
          updatedat?: string | null
        }
        Relationships: []
      }
      justifications: {
        Row: {
          created_at: string | null
          id: string
          meeting_id: string
          member_id: string
          member_name: string
          reason: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_id: string
          member_id: string
          member_name: string
          reason: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_id?: string
          member_id?: string
          member_name?: string
          reason?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "justifications_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      lodges: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string | null
          email: string
          empresa_id: string | null
          founded_date: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          number: string
          phone_number: string
          president: string
          state: string
          updated_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description?: string | null
          email: string
          empresa_id?: string | null
          founded_date?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          number: string
          phone_number: string
          president: string
          state: string
          updated_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string | null
          email?: string
          empresa_id?: string | null
          founded_date?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          number?: string
          phone_number?: string
          president?: string
          state?: string
          updated_at?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      medical_certificates: {
        Row: {
          cid: string | null
          company_id: string
          created_at: string
          created_by: string | null
          days: number
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
          company_id: string
          created_at?: string
          created_by?: string | null
          days?: number
          description?: string | null
          doctor: string
          document_url?: string | null
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          cid?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          days?: number
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
            foreignKeyName: "medical_certificates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
      meetings: {
        Row: {
          attendance_count: number | null
          attendance_percentage: number | null
          confirmation_token: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          title: string
          total_count: number | null
          updated_at: string | null
        }
        Insert: {
          attendance_count?: number | null
          attendance_percentage?: number | null
          confirmation_token?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          title: string
          total_count?: number | null
          updated_at?: string | null
        }
        Update: {
          attendance_count?: number | null
          attendance_percentage?: number | null
          confirmation_token?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          title?: string
          total_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      module_assistants: {
        Row: {
          capabilities: string | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          label: string
          limitations: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          capabilities?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          label: string
          limitations?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          capabilities?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          label?: string
          limitations?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
      modulos: {
        Row: {
          ativo: boolean | null
          chave: string
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          preco: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          chave: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          preco?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          chave?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          preco?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mood_checkins: {
        Row: {
          check_in_date: string
          comment: string | null
          company_id: string
          created_at: string | null
          employee_id: string
          id: string
          mood_score: number
        }
        Insert: {
          check_in_date?: string
          comment?: string | null
          company_id: string
          created_at?: string | null
          employee_id: string
          id?: string
          mood_score: number
        }
        Update: {
          check_in_date?: string
          comment?: string | null
          company_id?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          mood_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "mood_checkins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mood_checkins_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
      non_conforming_products: {
        Row: {
          approval_status: string
          created_at: string
          customer: string | null
          department: string
          description: string
          empresa_id: string | null
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
          created_at?: string
          customer?: string | null
          department: string
          description: string
          empresa_id?: string | null
          id?: string
          immediate_action: string
          non_conformity_type: string
          product_name: string
          requirement_id: string
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          created_at?: string
          customer?: string | null
          department?: string
          description?: string
          empresa_id?: string | null
          id?: string
          immediate_action?: string
          non_conformity_type?: string
          product_name?: string
          requirement_id?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      non_conformities: {
        Row: {
          closed_at: string | null
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
          created_at?: string
          department: string
          description: string
          id?: string
          requirement_id: string
          responsible: string
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
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
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          reference_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          reference_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          reference_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      objetivos_estrategicos: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          empresa_id: string | null
          id: string
          progresso: number
          responsavel: string
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          progresso?: number
          responsavel: string
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          progresso?: number
          responsavel?: string
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      occurrences: {
        Row: {
          created_at: string
          date: string
          description: string
          employee_id: string
          id: string
          reported_by: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          employee_id: string
          id?: string
          reported_by: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          employee_id?: string
          id?: string
          reported_by?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_processes: {
        Row: {
          checklist: Json
          company_id: string
          completion_date: string | null
          created_at: string | null
          employee_id: string
          id: string
          responsible_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          checklist: Json
          company_id: string
          completion_date?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          responsible_id: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          checklist?: Json
          company_id?: string
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          responsible_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_processes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_processes_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_context: {
        Row: {
          analysis: string | null
          context_type: string
          created_at: string
          created_by: string
          description: string
          empresa_id: string | null
          id: string
          swot_category: string | null
          update_date: string
          updated_at: string
        }
        Insert: {
          analysis?: string | null
          context_type: string
          created_at?: string
          created_by: string
          description: string
          empresa_id?: string | null
          id?: string
          swot_category?: string | null
          update_date: string
          updated_at?: string
        }
        Update: {
          analysis?: string | null
          context_type?: string
          created_at?: string
          created_by?: string
          description?: string
          empresa_id?: string | null
          id?: string
          swot_category?: string | null
          update_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_contexts: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          scope: string | null
          stakeholders: string | null
          swot_analysis: Json | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          scope?: string | null
          stakeholders?: string | null
          swot_analysis?: Json | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          scope?: string | null
          stakeholders?: string | null
          swot_analysis?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_contexts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_receipts: {
        Row: {
          amount_paid: number
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          payer_name: string | null
          payment_date: string
          payment_method: string
          receipt_number: string
          receivable_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payer_name?: string | null
          payment_date: string
          payment_method: string
          receipt_number: string
          receivable_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          payer_name?: string | null
          payment_date?: string
          payment_method?: string
          receipt_number?: string
          receivable_id?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          criado_em: string | null
          empresa_id: string | null
          id: string
          nome: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      performance_evaluations: {
        Row: {
          comments: string | null
          company_id: string
          created_at: string | null
          development_plan: string | null
          employee_comments: string | null
          employee_id: string
          evaluation_date: string
          evaluation_period: string
          evaluator_id: string
          goals_achievement_score: number
          id: string
          improvement_areas: string | null
          overall_score: number
          skills_score: number
          status: string
          strengths: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          company_id: string
          created_at?: string | null
          development_plan?: string | null
          employee_comments?: string | null
          employee_id: string
          evaluation_date: string
          evaluation_period: string
          evaluator_id: string
          goals_achievement_score: number
          id?: string
          improvement_areas?: string | null
          overall_score: number
          skills_score: number
          status?: string
          strengths?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          company_id?: string
          created_at?: string | null
          development_plan?: string | null
          employee_comments?: string | null
          employee_id?: string
          evaluation_date?: string
          evaluation_period?: string
          evaluator_id?: string
          goals_achievement_score?: number
          id?: string
          improvement_areas?: string | null
          overall_score?: number
          skills_score?: number
          status?: string
          strengths?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_indicators: {
        Row: {
          calculation_type: string
          created_at: string
          description: string | null
          goal_type: string
          goal_value: number
          id: string
          name: string
          process: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          calculation_type: string
          created_at?: string
          description?: string | null
          goal_type: string
          goal_value: number
          id?: string
          name: string
          process: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          calculation_type?: string
          created_at?: string
          description?: string | null
          goal_type?: string
          goal_value?: number
          id?: string
          name?: string
          process?: string
          unit?: string | null
          updated_at?: string
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
      permissoes_usuario: {
        Row: {
          created_at: string | null
          id: string
          modulo_id: string | null
          pode_criar: boolean | null
          pode_editar: boolean | null
          pode_excluir: boolean | null
          pode_visualizar: boolean | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          modulo_id?: string | null
          pode_criar?: boolean | null
          pode_editar?: boolean | null
          pode_excluir?: boolean | null
          pode_visualizar?: boolean | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          modulo_id?: string | null
          pode_criar?: boolean | null
          pode_editar?: boolean | null
          pode_excluir?: boolean | null
          pode_visualizar?: boolean | null
          updated_at?: string | null
          usuario_id?: string | null
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
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      process_mappings: {
        Row: {
          activities: Json | null
          company_id: string | null
          created_at: string | null
          date: string
          entry_requirements: string | null
          expected_result: string | null
          id: string
          name: string
          performance_indicators: string | null
          problems: string | null
          process_issues: string | null
          process_objective: string | null
          process_risks: string | null
          process_type: string | null
          risks: string | null
          status: string | null
        }
        Insert: {
          activities?: Json | null
          company_id?: string | null
          created_at?: string | null
          date: string
          entry_requirements?: string | null
          expected_result?: string | null
          id?: string
          name: string
          performance_indicators?: string | null
          problems?: string | null
          process_issues?: string | null
          process_objective?: string | null
          process_risks?: string | null
          process_type?: string | null
          risks?: string | null
          status?: string | null
        }
        Update: {
          activities?: Json | null
          company_id?: string | null
          created_at?: string | null
          date?: string
          entry_requirements?: string | null
          expected_result?: string | null
          id?: string
          name?: string
          performance_indicators?: string | null
          problems?: string | null
          process_issues?: string | null
          process_objective?: string | null
          process_risks?: string | null
          process_type?: string | null
          risks?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_mappings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          criado_em: string | null
          id: string
          nome: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          criado_em?: string | null
          id?: string
          nome?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          criado_em?: string | null
          id?: string
          nome?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos_tap: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          cronograma_fim: string
          cronograma_inicio: string
          descricao_geral: string
          id: string
          nome_projeto: string
          status_projeto: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cronograma_fim: string
          cronograma_inicio: string
          descricao_geral: string
          id?: string
          nome_projeto: string
          status_projeto?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          cronograma_fim?: string
          cronograma_inicio?: string
          descricao_geral?: string
          id?: string
          nome_projeto?: string
          status_projeto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_tap_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_actions: {
        Row: {
          comments: string | null
          completed_at: string | null
          created_at: string
          currency: string | null
          due_date: string
          how: string
          how_much: number | null
          id: string
          priority: string
          process_area: string
          responsible: string
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
          what: string
          where: string
          why: string
        }
        Insert: {
          comments?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          due_date: string
          how: string
          how_much?: number | null
          id?: string
          priority: string
          process_area: string
          responsible: string
          start_date?: string | null
          status: string
          title: string
          updated_at?: string | null
          what: string
          where: string
          why: string
        }
        Update: {
          comments?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string
          how?: string
          how_much?: number | null
          id?: string
          priority?: string
          process_area?: string
          responsible?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          what?: string
          where?: string
          why?: string
        }
        Relationships: []
      }
      quality_objectives: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          frequency: string | null
          id: string
          name: string
          status: string | null
          target: number | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name: string
          status?: string | null
          target?: number | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency?: string | null
          id?: string
          name?: string
          status?: string | null
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
      quality_policies: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          status?: string
          updated_at?: string
          version: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_evaluations: {
        Row: {
          carrier_reputation_score: number
          created_at: string
          delivery_score: number
          evaluator_id: string
          id: string
          notes: string | null
          price_score: number
          quote_id: string
          response_id: string
          total_score: number
        }
        Insert: {
          carrier_reputation_score: number
          created_at?: string
          delivery_score: number
          evaluator_id: string
          id?: string
          notes?: string | null
          price_score: number
          quote_id: string
          response_id: string
          total_score: number
        }
        Update: {
          carrier_reputation_score?: number
          created_at?: string
          delivery_score?: number
          evaluator_id?: string
          id?: string
          notes?: string | null
          price_score?: number
          quote_id?: string
          response_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_evaluations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "freight_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_evaluations_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "quote_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          cargo_type: string
          created_at: string
          description: string | null
          id: string
          quote_id: string
          volume: number
          weight: number
        }
        Insert: {
          cargo_type: string
          created_at?: string
          description?: string | null
          id?: string
          quote_id: string
          volume: number
          weight: number
        }
        Update: {
          cargo_type?: string
          created_at?: string
          description?: string | null
          id?: string
          quote_id?: string
          volume?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "freight_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_responses: {
        Row: {
          access_token: string
          additional_services: Json | null
          carrier_id: string
          conditions: string | null
          created_at: string
          delivery_time: number
          id: string
          price: number
          quote_id: string
          responded_at: string | null
          status: string
          updated_at: string
          valid_until: string
        }
        Insert: {
          access_token: string
          additional_services?: Json | null
          carrier_id: string
          conditions?: string | null
          created_at?: string
          delivery_time: number
          id?: string
          price: number
          quote_id: string
          responded_at?: string | null
          status?: string
          updated_at?: string
          valid_until: string
        }
        Update: {
          access_token?: string
          additional_services?: Json | null
          carrier_id?: string
          conditions?: string | null
          created_at?: string
          delivery_time?: number
          id?: string
          price?: number
          quote_id?: string
          responded_at?: string | null
          status?: string
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_responses_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_responses_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "freight_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_material_inspections: {
        Row: {
          batch_number: string
          created_at: string
          empresa_id: string | null
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
          batch_number: string
          created_at?: string
          empresa_id?: string | null
          id?: string
          inspection_date: string
          inspection_result?: string
          inspector: string
          material_name: string
          observations?: string | null
          parameters?: Json | null
          quantity: number
          supplier: string
          unit: string
          updated_at?: string
        }
        Update: {
          batch_number?: string
          created_at?: string
          empresa_id?: string | null
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
        Relationships: []
      }
      recruitment_processes: {
        Row: {
          company_id: string
          created_at: string | null
          description: string
          end_date: string | null
          id: string
          job_position_id: string
          start_date: string
          status: string
          title: string
          updated_at: string | null
          vacancies: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description: string
          end_date?: string | null
          id?: string
          job_position_id: string
          start_date: string
          status?: string
          title: string
          updated_at?: string | null
          vacancies?: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string
          end_date?: string | null
          id?: string
          job_position_id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
          vacancies?: number
        }
        Relationships: [
          {
            foreignKeyName: "recruitment_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruitment_processes_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          attendees: Json | null
          created_at: string
          description: string | null
          empresa_id: string | null
          end_time: string
          id: string
          room_id: string
          start_time: string
          title: string
          user_id: string
        }
        Insert: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          empresa_id?: string | null
          end_time: string
          id?: string
          room_id: string
          start_time: string
          title: string
          user_id: string
        }
        Update: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          empresa_id?: string | null
          end_time?: string
          id?: string
          room_id?: string
          start_time?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analyses: {
        Row: {
          analysis: string
          candidate_id: string
          compatibility_score: number
          created_at: string
          created_by: string
          id: string
          job_opening_id: string
          recommendation: string
          strengths: string[]
          weaknesses: string[]
        }
        Insert: {
          analysis: string
          candidate_id: string
          compatibility_score: number
          created_at?: string
          created_by: string
          id?: string
          job_opening_id: string
          recommendation: string
          strengths: string[]
          weaknesses: string[]
        }
        Update: {
          analysis?: string
          candidate_id?: string
          compatibility_score?: number
          created_at?: string
          created_by?: string
          id?: string
          job_opening_id?: string
          recommendation?: string
          strengths?: string[]
          weaknesses?: string[]
        }
        Relationships: []
      }
      reunioes: {
        Row: {
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
          created_at?: string
          criado_por?: string | null
          data: string
          descricao?: string | null
          id?: string
          local?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
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
            foreignKeyName: "reunioes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes_acoes: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          prazo: string | null
          responsavel_id: string | null
          reuniao_id: string
          status: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          reuniao_id: string
          status?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          responsavel_id?: string | null
          reuniao_id?: string
          status?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
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
          created_at: string
          employee_id: string
          id: string
          presente: boolean | null
          reuniao_id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          presente?: boolean | null
          reuniao_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          presente?: boolean | null
          reuniao_id?: string
        }
        Relationships: [
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
      riscos: {
        Row: {
          created_at: string
          descricao: string
          id: string
          impacto: string
          mitigacao: string | null
          probabilidade: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          impacto: string
          mitigacao?: string | null
          probabilidade: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          impacto?: string
          mitigacao?: string | null
          probabilidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      risks: {
        Row: {
          category: string
          created_at: string
          description: string
          empresa_id: string | null
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
          category: string
          created_at?: string
          description: string
          empresa_id?: string | null
          id?: string
          impact: number
          mitigation_plan?: string | null
          probability: number
          process: string
          responsible: string
          risk_level?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          empresa_id?: string | null
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
        Relationships: []
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
          description: string | null
          id: string
          is_default: boolean
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          permissions?: Json | null
          updated_at?: string | null
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
      rooms: {
        Row: {
          amenities: Json | null
          available: boolean | null
          capacity: number
          created_at: string
          empresa_id: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          room_type: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          available?: boolean | null
          capacity: number
          created_at?: string
          empresa_id?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          room_type: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          available?: boolean | null
          capacity?: number
          created_at?: string
          empresa_id?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          status: string
          target_resource: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          status: string
          target_resource?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          status?: string
          target_resource?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      strategic_action_plans: {
        Row: {
          company_id: string | null
          created_at: string | null
          due_date: string
          how_execution: string
          how_much: string | null
          id: string
          origin: string | null
          priority: string
          progress: number
          stakeholders: string | null
          status: string
          title: string
          updated_at: string | null
          what_description: string
          where_location: string
          who_responsible: string
          why_description: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          due_date: string
          how_execution: string
          how_much?: string | null
          id?: string
          origin?: string | null
          priority: string
          progress?: number
          stakeholders?: string | null
          status?: string
          title: string
          updated_at?: string | null
          what_description: string
          where_location: string
          who_responsible: string
          why_description: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          due_date?: string
          how_execution?: string
          how_much?: string | null
          id?: string
          origin?: string | null
          priority?: string
          progress?: number
          stakeholders?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          what_description?: string
          where_location?: string
          who_responsible?: string
          why_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_action_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_evaluations: {
        Row: {
          category: string
          comments: string | null
          created_at: string
          delivery_score: number | null
          empresa_id: string | null
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
          category: string
          comments?: string | null
          created_at?: string
          delivery_score?: number | null
          empresa_id?: string | null
          evaluation_date: string
          evaluator: string
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
          created_at?: string
          delivery_score?: number | null
          empresa_id?: string | null
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
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          module: string | null
          personnel_request_id: string | null
          requester_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          module?: string | null
          personnel_request_id?: string | null
          requester_id?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          module?: string | null
          personnel_request_id?: string | null
          requester_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_matrix: {
        Row: {
          company_id: string
          created_at: string | null
          department: string | null
          description: string
          frequency: string | null
          id: string
          is_mandatory: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department?: string | null
          description: string
          frequency?: string | null
          id?: string
          is_mandatory?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department?: string | null
          description?: string
          frequency?: string | null
          id?: string
          is_mandatory?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_matrix_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          department: string
          description: string | null
          duration: number
          empresa_id: string | null
          evaluation_method: string | null
          id: string
          participants: Json | null
          status: string
          title: string
          trainer: string
          training_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          duration: number
          empresa_id?: string | null
          evaluation_method?: string | null
          id?: string
          participants?: Json | null
          status?: string
          title: string
          trainer: string
          training_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          duration?: number
          empresa_id?: string | null
          evaluation_method?: string | null
          id?: string
          participants?: Json | null
          status?: string
          title?: string
          trainer?: string
          training_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      trial_period_evaluations: {
        Row: {
          adaptation_score: number
          approved: boolean | null
          behavior_score: number
          comments: string | null
          company_id: string
          created_at: string | null
          employee_id: string
          evaluation_date: string
          evaluation_type: string
          evaluator_id: string
          id: string
          performance_score: number
          updated_at: string | null
        }
        Insert: {
          adaptation_score: number
          approved?: boolean | null
          behavior_score: number
          comments?: string | null
          company_id: string
          created_at?: string | null
          employee_id: string
          evaluation_date: string
          evaluation_type: string
          evaluator_id: string
          id?: string
          performance_score: number
          updated_at?: string | null
        }
        Update: {
          adaptation_score?: number
          approved?: boolean | null
          behavior_score?: number
          comments?: string | null
          company_id?: string
          created_at?: string | null
          employee_id?: string
          evaluation_date?: string
          evaluation_type?: string
          evaluator_id?: string
          id?: string
          performance_score?: number
          updated_at?: string | null
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
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address: string
          city: string
          created_at: string | null
          empresa_id: string | null
          id: string
          is_active: boolean | null
          is_rentable: boolean | null
          name: string
          rental_base_price: string | null
          state: string
          updated_at: string | null
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          is_active?: boolean | null
          is_rentable?: boolean | null
          name: string
          rental_base_price?: string | null
          state: string
          updated_at?: string | null
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          is_active?: boolean | null
          is_rentable?: boolean | null
          name?: string
          rental_base_price?: string | null
          state?: string
          updated_at?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      user_audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          allowed_modules: string[] | null
          company_id: string | null
          cpf: string | null
          created_at: string
          email: string
          empresa_id: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_company_admin: boolean
          is_super_admin: boolean
          last_login: string | null
          last_name: string | null
          lgpd_consent: boolean | null
          lgpd_consent_date: string | null
          phone: string | null
          projeto_id: string | null
          role: string
          role_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_modules?: string[] | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          empresa_id?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          phone?: string | null
          projeto_id?: string | null
          role?: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_modules?: string[] | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          empresa_id?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_company_admin?: boolean
          is_super_admin?: boolean
          last_login?: string | null
          last_name?: string | null
          lgpd_consent?: boolean | null
          lgpd_consent_date?: string | null
          phone?: string | null
          projeto_id?: string | null
          role?: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
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
      usuarios: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          is_admin: boolean | null
          is_master: boolean | null
          nome: string
          projeto_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          is_admin?: boolean | null
          is_master?: boolean | null
          nome: string
          projeto_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          is_admin?: boolean | null
          is_master?: boolean | null
          nome?: string
          projeto_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_updated_at_trigger: {
        Args: { table_name: string }
        Returns: undefined
      }
      belongs_to_company: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      check_schema_config: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_secret_existe: {
        Args: { nome_secreto: string }
        Returns: boolean
      }
      check_secret_exists: {
        Args: { secret_name: string }
        Returns: boolean
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: {
          table_exists: boolean
        }[]
      }
      check_user_access: {
        Args: { user_id: string }
        Returns: boolean
      }
      create_check_table_exists_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_get_db_version_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      exec_sql: {
        Args: { sql_statement: string }
        Returns: undefined
      }
      generate_access_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_trial_evaluations: {
        Args: { employee_id: string; start_date: string }
        Returns: undefined
      }
      generate_unique_assessment_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_disc_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gerar_token_de_avaliação_único: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_company_by_id: {
        Args: { company_uuid: string }
        Returns: {
          id: string
          nome: string
          cnpj: string
        }[]
      }
      get_db_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_security_logs: {
        Args: {
          user_id_filter?: string
          action_filter?: string
          status_filter?: string
          from_date?: string
          to_date?: string
        }
        Returns: {
          id: string
          action: string
          user_id: string
          target_resource: string
          details: Json
          status: string
          ip_address: string
          event_timestamp: string
          created_at: string
        }[]
      }
      get_security_logs_paginated: {
        Args: {
          user_id_filter?: string
          action_filter?: string
          status_filter?: string
          from_date?: string
          to_date?: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          action: string
          user_id: string
          target_resource: string
          details: Json
          status: string
          ip_address: string
          event_timestamp: string
          created_at: string
        }[]
      }
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_company_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_company_admin_for: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: {
          action_text: string
          user_id_text: string
          target_resource_text: string
          details_json: Json
          status_text: string
          ip_address_text: string
        }
        Returns: undefined
      }
      pertence_à_empresa: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      set_assessment_link_token: {
        Args: { token: string; user_id: string }
        Returns: undefined
      }
      user_belongs_to_company: {
        Args: { company_uuid: string }
        Returns: boolean
      }
      user_has_module_access: {
        Args: { module_key: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: { modulo_chave: string; tipo_permissao: string }
        Returns: boolean
      }
      user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      usuario_é_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      verificar_acesso_do_usuário: {
        Args: { user_id: string }
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
