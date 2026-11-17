// ============================================================
// VoiceFlow AI – Supabase Database Type Definitions
// ============================================================
// Every table follows the Supabase convention:
//   Row    – what SELECT returns
//   Insert – what INSERT accepts (all nullable/defaulted cols are optional)
//   Update – what UPDATE accepts (all cols optional)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Enum aliases ───────────────────────────────────────────

export type OrgMemberRole = 'owner' | 'admin' | 'member' | 'viewer'

export type AgentStatus = 'draft' | 'testing' | 'active' | 'paused'

export type PhoneNumberType = 'local' | 'tollfree' | 'mobile'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'

export type CampaignType = 'outbound' | 'inbound'

export type CallDirection = 'inbound' | 'outbound'

export type CallStatus =
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no-answer'
  | 'cancelled'

export type DocumentContentType =
  | 'pdf'
  | 'docx'
  | 'txt'
  | 'url'
  | 'text'
  | 'faq'

export type DocumentStatus = 'processing' | 'ready' | 'failed'

export type WalletTransactionType = 'credit' | 'debit'

export type SubscriptionPlan =
  | 'free'
  | 'starter'
  | 'growth'
  | 'enterprise'

// ─── Table definitions ──────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      // ── profiles ──────────────────────────────────────────
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ── organizations ─────────────────────────────────────
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website: string | null
          industry: string | null
          size: string | null
          created_at: string
          updated_at: string
          owner_id: string
          subscription_id: string | null
          is_active: boolean
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          created_at?: string
          updated_at?: string
          owner_id: string
          subscription_id?: string | null
          is_active?: boolean
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          created_at?: string
          updated_at?: string
          owner_id?: string
          subscription_id?: string | null
          is_active?: boolean
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'organizations_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      // ── organization_members ──────────────────────────────
      organization_members: {
        Row: {
          id: string
          org_id: string
          user_id: string
          role: OrgMemberRole
          created_at: string
          invited_by: string | null
        }
        Insert: {
          id?: string
          org_id: string
          user_id: string
          role?: OrgMemberRole
          created_at?: string
          invited_by?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string
          role?: OrgMemberRole
          created_at?: string
          invited_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'organization_members_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      // ── ai_agents ────────────────────────────────────────
      ai_agents: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          voice_id: string | null
          language_primary: string
          language_secondary: string | null
          instructions: string | null
          persona: string | null
          status: AgentStatus
          model: string
          temperature: number
          knowledge_base_id: string | null
          created_by: string
          created_at: string
          updated_at: string
          retell_agent_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          voice_id?: string | null
          language_primary?: string
          language_secondary?: string | null
          instructions?: string | null
          persona?: string | null
          status?: AgentStatus
          model?: string
          temperature?: number
          knowledge_base_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          retell_agent_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          voice_id?: string | null
          language_primary?: string
          language_secondary?: string | null
          instructions?: string | null
          persona?: string | null
          status?: AgentStatus
          model?: string
          temperature?: number
          knowledge_base_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          retell_agent_id?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'ai_agents_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ai_agents_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      // ── phone_numbers ─────────────────────────────────────
      phone_numbers: {
        Row: {
          id: string
          org_id: string
          phone_number: string
          provider: string
          provider_id: string | null
          type: PhoneNumberType
          country_code: string
          assigned_agent_id: string | null
          status: string
          monthly_cost: number | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          phone_number: string
          provider: string
          provider_id?: string | null
          type?: PhoneNumberType
          country_code?: string
          assigned_agent_id?: string | null
          status?: string
          monthly_cost?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          phone_number?: string
          provider?: string
          provider_id?: string | null
          type?: PhoneNumberType
          country_code?: string
          assigned_agent_id?: string | null
          status?: string
          monthly_cost?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'phone_numbers_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'phone_numbers_assigned_agent_id_fkey'
            columns: ['assigned_agent_id']
            referencedRelation: 'ai_agents'
            referencedColumns: ['id']
          }
        ]
      }

      // ── contacts ──────────────────────────────────────────
      contacts: {
        Row: {
          id: string
          org_id: string
          name: string
          phone: string | null
          email: string | null
          company: string | null
          location: string | null
          industry: string | null
          budget: number | null
          source: string | null
          status: string | null
          priority: string | null
          assigned_to: string | null
          notes: string | null
          custom_fields: Json | null
          created_at: string
          updated_at: string
          last_contacted_at: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          phone?: string | null
          email?: string | null
          company?: string | null
          location?: string | null
          industry?: string | null
          budget?: number | null
          source?: string | null
          status?: string | null
          priority?: string | null
          assigned_to?: string | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          last_contacted_at?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          company?: string | null
          location?: string | null
          industry?: string | null
          budget?: number | null
          source?: string | null
          status?: string | null
          priority?: string | null
          assigned_to?: string | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
          last_contacted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contacts_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── leads ─────────────────────────────────────────────
      leads: {
        Row: {
          id: string
          org_id: string
          contact_id: string | null
          name: string
          phone: string | null
          email: string | null
          company: string | null
          location: string | null
          source: string | null
          status: LeadStatus
          score: number | null
          priority: string | null
          assigned_to: string | null
          notes: string | null
          custom_fields: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          contact_id?: string | null
          name: string
          phone?: string | null
          email?: string | null
          company?: string | null
          location?: string | null
          source?: string | null
          status?: LeadStatus
          score?: number | null
          priority?: string | null
          assigned_to?: string | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          contact_id?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          company?: string | null
          location?: string | null
          source?: string | null
          status?: LeadStatus
          score?: number | null
          priority?: string | null
          assigned_to?: string | null
          notes?: string | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'leads_contact_id_fkey'
            columns: ['contact_id']
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          }
        ]
      }

      // ── campaigns ─────────────────────────────────────────
      campaigns: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          agent_id: string | null
          status: CampaignStatus
          type: CampaignType
          schedule_start: string | null
          schedule_end: string | null
          calling_hours_start: string | null
          calling_hours_end: string | null
          max_attempts: number
          retry_interval_minutes: number
          budget: number | null
          spent: number
          timezone: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          agent_id?: string | null
          status?: CampaignStatus
          type?: CampaignType
          schedule_start?: string | null
          schedule_end?: string | null
          calling_hours_start?: string | null
          calling_hours_end?: string | null
          max_attempts?: number
          retry_interval_minutes?: number
          budget?: number | null
          spent?: number
          timezone?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          agent_id?: string | null
          status?: CampaignStatus
          type?: CampaignType
          schedule_start?: string | null
          schedule_end?: string | null
          calling_hours_start?: string | null
          calling_hours_end?: string | null
          max_attempts?: number
          retry_interval_minutes?: number
          budget?: number | null
          spent?: number
          timezone?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'campaigns_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'campaigns_agent_id_fkey'
            columns: ['agent_id']
            referencedRelation: 'ai_agents'
            referencedColumns: ['id']
          }
        ]
      }

      // ── calls ─────────────────────────────────────────────
      calls: {
        Row: {
          id: string
          org_id: string
          campaign_id: string | null
          contact_id: string | null
          agent_id: string | null
          phone_number_id: string | null
          direction: CallDirection
          status: CallStatus
          duration_seconds: number | null
          cost: number | null
          retell_call_id: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          campaign_id?: string | null
          contact_id?: string | null
          agent_id?: string | null
          phone_number_id?: string | null
          direction?: CallDirection
          status?: CallStatus
          duration_seconds?: number | null
          cost?: number | null
          retell_call_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          campaign_id?: string | null
          contact_id?: string | null
          agent_id?: string | null
          phone_number_id?: string | null
          direction?: CallDirection
          status?: CallStatus
          duration_seconds?: number | null
          cost?: number | null
          retell_call_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'calls_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'calls_campaign_id_fkey'
            columns: ['campaign_id']
            referencedRelation: 'campaigns'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'calls_contact_id_fkey'
            columns: ['contact_id']
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'calls_agent_id_fkey'
            columns: ['agent_id']
            referencedRelation: 'ai_agents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'calls_phone_number_id_fkey'
            columns: ['phone_number_id']
            referencedRelation: 'phone_numbers'
            referencedColumns: ['id']
          }
        ]
      }

      // ── knowledge_bases ───────────────────────────────────
      knowledge_bases: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'knowledge_bases_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── knowledge_documents ───────────────────────────────
      knowledge_documents: {
        Row: {
          id: string
          knowledge_base_id: string
          org_id: string
          title: string
          content_type: DocumentContentType
          file_url: string | null
          file_size: number | null
          status: DocumentStatus
          chunk_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          knowledge_base_id: string
          org_id: string
          title: string
          content_type?: DocumentContentType
          file_url?: string | null
          file_size?: number | null
          status?: DocumentStatus
          chunk_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          knowledge_base_id?: string
          org_id?: string
          title?: string
          content_type?: DocumentContentType
          file_url?: string | null
          file_size?: number | null
          status?: DocumentStatus
          chunk_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'knowledge_documents_knowledge_base_id_fkey'
            columns: ['knowledge_base_id']
            referencedRelation: 'knowledge_bases'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'knowledge_documents_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── wallets ───────────────────────────────────────────
      wallets: {
        Row: {
          id: string
          org_id: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wallets_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── wallet_transactions ───────────────────────────────
      wallet_transactions: {
        Row: {
          id: string
          org_id: string
          wallet_id: string
          type: WalletTransactionType
          amount: number
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          wallet_id: string
          type: WalletTransactionType
          amount: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          wallet_id?: string
          type?: WalletTransactionType
          amount?: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wallet_transactions_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'wallet_transactions_wallet_id_fkey'
            columns: ['wallet_id']
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          }
        ]
      }

      // ── subscriptions ─────────────────────────────────────
      subscriptions: {
        Row: {
          id: string
          org_id: string
          plan: SubscriptionPlan
          status: string
          starts_at: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          plan?: SubscriptionPlan
          status?: string
          starts_at?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          plan?: SubscriptionPlan
          status?: string
          starts_at?: string
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }

      // ── notifications ─────────────────────────────────────
      notifications: {
        Row: {
          id: string
          org_id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }

      // ── audit_logs ────────────────────────────────────────
      audit_logs: {
        Row: {
          id: string
          org_id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_org_id_fkey'
            columns: ['org_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
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
      org_member_role: OrgMemberRole
      agent_status: AgentStatus
      phone_number_type: PhoneNumberType
      lead_status: LeadStatus
      campaign_status: CampaignStatus
      campaign_type: CampaignType
      call_direction: CallDirection
      call_status: CallStatus
      document_content_type: DocumentContentType
      document_status: DocumentStatus
      wallet_transaction_type: WalletTransactionType
      subscription_plan: SubscriptionPlan
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ─── Convenience helper types ────────────────────────────────

type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]

export type Row<T extends keyof Database['public']['Tables']> =
  Tables<T>['Row']

export type InsertDto<T extends keyof Database['public']['Tables']> =
  Tables<T>['Insert']

export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Tables<T>['Update']

// Named row exports for convenience
export type Profile              = Row<'profiles'>
export type Organization         = Row<'organizations'>
export type OrganizationMember   = Row<'organization_members'>
export type AIAgent              = Row<'ai_agents'>
export type PhoneNumber          = Row<'phone_numbers'>
export type Contact              = Row<'contacts'>
export type Lead                 = Row<'leads'>
export type Campaign             = Row<'campaigns'>
export type Call                 = Row<'calls'>
export type KnowledgeBase        = Row<'knowledge_bases'>
export type KnowledgeDocument    = Row<'knowledge_documents'>
export type Wallet               = Row<'wallets'>
export type WalletTransaction    = Row<'wallet_transactions'>
export type Subscription         = Row<'subscriptions'>
export type Notification         = Row<'notifications'>
export type AuditLog             = Row<'audit_logs'>
