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
      companies: {
        Row: {
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
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          responsible_employee_id: string | null
          sector: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          responsible_employee_id?: string | null
          sector?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
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
          email: string
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
          email: string
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
          email?: string
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
        ]
      }
      equipment_calibrations: {
        Row: {
          calibration_date: string
          calibration_entity: string
          certificate_number: string | null
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
          calibration_entity: string
          certificate_number?: string | null
          created_at?: string
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
      job_positions: {
        Row: {
          company_id: string
          created_at: string | null
          department: string
          description: string
          id: string
          requirements: string | null
          responsibilities: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department: string
          description: string
          id?: string
          requirements?: string | null
          responsibilities?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department?: string
          description?: string
          id?: string
          requirements?: string | null
          responsibilities?: string | null
          title?: string
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
          id?: string
          swot_category?: string | null
          update_date?: string
          updated_at?: string
        }
        Relationships: []
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
      process_mappings: {
        Row: {
          activities: Json | null
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
        Relationships: []
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
      raw_material_inspections: {
        Row: {
          batch_number: string
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
          batch_number: string
          created_at?: string
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
      risks: {
        Row: {
          category: string
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
          category: string
          created_at?: string
          description: string
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
      rooms: {
        Row: {
          amenities: Json | null
          available: boolean | null
          capacity: number
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
          available?: boolean | null
          capacity: number
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
          available?: boolean | null
          capacity?: number
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_evaluations: {
        Row: {
          category: string
          comments: string | null
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
          category: string
          comments?: string | null
          created_at?: string
          delivery_score?: number | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_updated_at_trigger: {
        Args: { table_name: string }
        Returns: undefined
      }
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_is_admin: {
        Args: Record<PropertyKey, never>
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
