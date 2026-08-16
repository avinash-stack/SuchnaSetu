export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      states_uts: {
        Row: {
          code: string;
          name: string;
          type: "state" | "ut";
          capital: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          name: string;
          type: "state" | "ut";
          capital?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          name?: string;
          type?: "state" | "ut";
          capital?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          acronym: string | null;
          slug: string;
          type: string;
          jurisdiction: "central" | "state" | "autonomous" | "psu";
          state_code: string | null;
          website_url: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          acronym?: string | null;
          slug: string;
          type?: string;
          jurisdiction: "central" | "state" | "autonomous" | "psu";
          state_code?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          acronym?: string | null;
          slug?: string;
          type?: string;
          jurisdiction?: "central" | "state" | "autonomous" | "psu";
          state_code?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          acronym: string | null;
          slug: string;
          website_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          acronym?: string | null;
          slug: string;
          website_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          acronym?: string | null;
          slug?: string;
          website_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      qualifications: {
        Row: {
          id: string;
          name: string;
          slug: string;
          level: "10th" | "12th" | "diploma" | "graduate" | "post_graduate" | "doctorate" | "professional";
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          level: "10th" | "12th" | "diploma" | "graduate" | "post_graduate" | "doctorate" | "professional";
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          level?: "10th" | "12th" | "diploma" | "graduate" | "post_graduate" | "doctorate" | "professional";
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      modules: {
        Row: {
          key: string;
          title: string;
          description: string | null;
          is_enabled: boolean;
          route_path: string;
          icon_name: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          key: string;
          title: string;
          description?: string | null;
          is_enabled?: boolean;
          route_path: string;
          icon_name?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          key?: string;
          title?: string;
          description?: string | null;
          is_enabled?: boolean;
          route_path?: string;
          icon_name?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      official_sources: {
        Row: {
          id: string;
          organization_id: string | null;
          name: string;
          base_url: string;
          portal_type: string;
          is_verified: boolean;
          last_checked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          name: string;
          base_url: string;
          portal_type: string;
          is_verified?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          name?: string;
          base_url?: string;
          portal_type?: string;
          is_verified?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
      };
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: "super_admin" | "editor" | "auditor";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role: "super_admin" | "editor" | "auditor";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: "super_admin" | "editor" | "auditor";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      gov_jobs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          notification_number: string | null;
          organization_id: string;
          department_id: string | null;
          category_id: string;
          min_qualification_id: string | null;
          state_code: string | null;
          employment_type: "permanent" | "contract" | "deputation" | "apprenticeship";
          total_vacancies: number;
          salary_min: number | null;
          salary_max: number | null;
          pay_scale_details: string | null;
          official_notification_url: string;
          official_apply_url: string | null;
          status: "draft" | "published" | "archived";
          is_featured: boolean;
          summary: string | null;
          meta_title: string | null;
          meta_description: string | null;
          published_at: string | null;
          deleted_at: string | null;
          application_start_date: string | null;
          application_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          notification_number?: string | null;
          organization_id: string;
          department_id?: string | null;
          category_id: string;
          min_qualification_id?: string | null;
          state_code?: string | null;
          employment_type?: "permanent" | "contract" | "deputation" | "apprenticeship";
          total_vacancies?: number;
          salary_min?: number | null;
          salary_max?: number | null;
          pay_scale_details?: string | null;
          official_notification_url: string;
          official_apply_url?: string | null;
          status?: "draft" | "published" | "archived";
          is_featured?: boolean;
          summary?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          application_start_date?: string | null;
          application_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          notification_number?: string | null;
          organization_id?: string;
          department_id?: string | null;
          category_id?: string;
          min_qualification_id?: string | null;
          state_code?: string | null;
          employment_type?: "permanent" | "contract" | "deputation" | "apprenticeship";
          total_vacancies?: number;
          salary_min?: number | null;
          salary_max?: number | null;
          pay_scale_details?: string | null;
          official_notification_url?: string;
          official_apply_url?: string | null;
          status?: "draft" | "published" | "archived";
          is_featured?: boolean;
          summary?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          application_start_date?: string | null;
          application_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_vacancies: {
        Row: {
          id: string;
          job_id: string;
          post_name: string;
          post_code: string | null;
          total_posts: number;
          ur_posts: number | null;
          ews_posts: number | null;
          obc_posts: number | null;
          sc_posts: number | null;
          st_posts: number | null;
          pwd_posts: number | null;
          pay_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          post_name: string;
          post_code?: string | null;
          total_posts?: number;
          ur_posts?: number | null;
          ews_posts?: number | null;
          obc_posts?: number | null;
          sc_posts?: number | null;
          st_posts?: number | null;
          pwd_posts?: number | null;
          pay_level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          post_name?: string;
          post_code?: string | null;
          total_posts?: number;
          ur_posts?: number | null;
          ews_posts?: number | null;
          obc_posts?: number | null;
          sc_posts?: number | null;
          st_posts?: number | null;
          pwd_posts?: number | null;
          pay_level?: string | null;
          created_at?: string;
        };
      };
      job_important_dates: {
        Row: {
          id: string;
          job_id: string;
          event_name: string;
          event_date: string | null;
          event_date_text: string | null;
          is_tentative: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          event_name: string;
          event_date?: string | null;
          event_date_text?: string | null;
          is_tentative?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          event_name?: string;
          event_date?: string | null;
          event_date_text?: string | null;
          is_tentative?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      job_eligibility: {
        Row: {
          id: string;
          job_id: string;
          min_age: number | null;
          max_age: number | null;
          age_calculation_date: string | null;
          age_relaxation_details: string | null;
          education_qualification: string;
          experience_details: string | null;
          selection_process: string | null;
          application_fee_details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          min_age?: number | null;
          max_age?: number | null;
          age_calculation_date?: string | null;
          age_relaxation_details?: string | null;
          education_qualification: string;
          experience_details?: string | null;
          selection_process?: string | null;
          application_fee_details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          min_age?: number | null;
          max_age?: number | null;
          age_calculation_date?: string | null;
          age_relaxation_details?: string | null;
          education_qualification?: string;
          experience_details?: string | null;
          selection_process?: string | null;
          application_fee_details?: Json | null;
          created_at?: string;
        };
      };
      job_official_documents: {
        Row: {
          id: string;
          job_id: string;
          document_type: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
          title: string;
          file_url: string;
          file_size_bytes: number | null;
          published_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          document_type: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
          title: string;
          file_url: string;
          file_size_bytes?: number | null;
          published_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          document_type?: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
          title?: string;
          file_url?: string;
          file_size_bytes?: number | null;
          published_date?: string | null;
          created_at?: string;
        };
      };
      public_bulletins: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: "employment_news" | "student_advisory" | "legal_update" | "press_release";
          organization_id: string | null;
          related_job_id: string | null;
          summary: string;
          content: string | null;
          source_url: string;
          source_name: string;
          is_breaking: boolean;
          status: "draft" | "published" | "archived";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: "employment_news" | "student_advisory" | "legal_update" | "press_release";
          organization_id?: string | null;
          related_job_id?: string | null;
          summary: string;
          content?: string | null;
          source_url: string;
          source_name: string;
          is_breaking?: boolean;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: "employment_news" | "student_advisory" | "legal_update" | "press_release";
          organization_id?: string | null;
          related_job_id?: string | null;
          summary?: string;
          content?: string | null;
          source_url?: string;
          source_name?: string;
          is_breaking?: boolean;
          status?: "draft" | "published" | "archived";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      import_sources: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          adapter_key: string;
          target_module: string;
          organization_id: string | null;
          base_url: string | null;
          config: Json;
          is_enabled: boolean;
          sync_interval_minutes: number;
          last_synced_at: string | null;
          next_scheduled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          adapter_key: string;
          target_module: string;
          organization_id?: string | null;
          base_url?: string | null;
          config?: Json;
          is_enabled?: boolean;
          sync_interval_minutes?: number;
          last_synced_at?: string | null;
          next_scheduled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          adapter_key?: string;
          target_module?: string;
          organization_id?: string | null;
          base_url?: string | null;
          config?: Json;
          is_enabled?: boolean;
          sync_interval_minutes?: number;
          last_synced_at?: string | null;
          next_scheduled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      import_jobs: {
        Row: {
          id: string;
          source_id: string;
          trigger_type: "manual" | "scheduled" | "webhook" | "retry";
          status: "pending" | "running" | "completed" | "failed" | "cancelled" | "retrying";
          started_at: string | null;
          completed_at: string | null;
          total_extracted: number;
          total_normalized: number;
          total_inserted: number;
          total_updated: number;
          total_skipped: number;
          total_failed: number;
          retry_count: number;
          max_retries: number;
          error_message: string | null;
          error_details: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          trigger_type?: "manual" | "scheduled" | "webhook" | "retry";
          status?: "pending" | "running" | "completed" | "failed" | "cancelled" | "retrying";
          started_at?: string | null;
          completed_at?: string | null;
          total_extracted?: number;
          total_normalized?: number;
          total_inserted?: number;
          total_updated?: number;
          total_skipped?: number;
          total_failed?: number;
          retry_count?: number;
          max_retries?: number;
          error_message?: string | null;
          error_details?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          trigger_type?: "manual" | "scheduled" | "webhook" | "retry";
          status?: "pending" | "running" | "completed" | "failed" | "cancelled" | "retrying";
          started_at?: string | null;
          completed_at?: string | null;
          total_extracted?: number;
          total_normalized?: number;
          total_inserted?: number;
          total_updated?: number;
          total_skipped?: number;
          total_failed?: number;
          retry_count?: number;
          max_retries?: number;
          error_message?: string | null;
          error_details?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      import_raw_payloads: {
        Row: {
          id: string;
          job_id: string;
          source_id: string;
          external_id: string | null;
          payload_hash: string;
          raw_payload: Json;
          content_type: string;
          status: "raw" | "normalized" | "duplicate" | "rejected" | "failed";
          error_message: string | null;
          extracted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          source_id: string;
          external_id?: string | null;
          payload_hash: string;
          raw_payload: Json;
          content_type?: string;
          status?: "raw" | "normalized" | "duplicate" | "rejected" | "failed";
          error_message?: string | null;
          extracted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          source_id?: string;
          external_id?: string | null;
          payload_hash?: string;
          raw_payload?: Json;
          content_type?: string;
          status?: "raw" | "normalized" | "duplicate" | "rejected" | "failed";
          error_message?: string | null;
          extracted_at?: string;
          created_at?: string;
        };
      };
      import_logs: {
        Row: {
          id: string;
          job_id: string;
          level: "debug" | "info" | "warn" | "error" | "fatal";
          step: string;
          message: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          level?: "debug" | "info" | "warn" | "error" | "fatal";
          step: string;
          message: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          level?: "debug" | "info" | "warn" | "error" | "fatal";
          step?: string;
          message?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      import_entity_hashes: {
        Row: {
          id: string;
          source_id: string;
          entity_type: string;
          entity_id: string | null;
          natural_key: string;
          content_hash: string;
          raw_hash: string;
          last_seen_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          entity_type: string;
          entity_id?: string | null;
          natural_key: string;
          content_hash: string;
          raw_hash: string;
          last_seen_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          entity_type?: string;
          entity_id?: string | null;
          natural_key?: string;
          content_hash?: string;
          raw_hash?: string;
          last_seen_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
