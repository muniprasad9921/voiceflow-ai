-- VoiceFlow AI Initial Schema Migration
-- Migration: 001_initial_schema.sql

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT,
  full_name         TEXT,
  avatar_url        TEXT,
  phone             TEXT,
  timezone          TEXT DEFAULT 'Asia/Kolkata',
  locale            TEXT DEFAULT 'en',
  onboarding_done   BOOLEAN DEFAULT FALSE,
  last_seen_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Organizations (multi-tenant root)
CREATE TABLE IF NOT EXISTS public.organizations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  logo_url          TEXT,
  website           TEXT,
  industry          TEXT,
  country           TEXT DEFAULT 'IN',
  timezone          TEXT DEFAULT 'Asia/Kolkata',
  plan              TEXT DEFAULT 'free',
  trial_ends_at     TIMESTAMPTZ,
  settings          JSONB DEFAULT '{}',
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Organization Members
CREATE TABLE IF NOT EXISTS public.organization_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL DEFAULT 'viewer', -- owner | admin | manager | agent | viewer
  invited_by        UUID REFERENCES auth.users(id),
  invited_at        TIMESTAMPTZ,
  accepted_at       TIMESTAMPTZ,
  status            TEXT DEFAULT 'active', -- active | invited | suspended
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- 5. Roles & Permissions
CREATE TABLE IF NOT EXISTS public.roles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  is_custom         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, name)
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key               TEXT UNIQUE NOT NULL,
  label             TEXT NOT NULL,
  category          TEXT NOT NULL,
  description       TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id           UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id     UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 6. Knowledge Bases & Documents (RAG)
CREATE TABLE IF NOT EXISTS public.knowledge_bases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  embedding_model   TEXT DEFAULT 'text-embedding-3-small',
  is_default        BOOLEAN DEFAULT FALSE,
  document_count    INT DEFAULT 0,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  knowledge_base_id UUID NOT NULL REFERENCES public.knowledge_bases(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  content_type      TEXT NOT NULL, -- pdf | docx | txt | url | faq | text
  source_url        TEXT,
  file_url          TEXT,
  file_size         BIGINT,
  status            TEXT DEFAULT 'pending', -- pending | processing | ready | failed
  error_message     TEXT,
  chunk_count       INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_id       UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  knowledge_base_id UUID NOT NULL REFERENCES public.knowledge_bases(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  chunk_index       INT NOT NULL,
  token_count       INT,
  embedding         vector(1536),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI Agents & Versions
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  role_title          TEXT,
  avatar_url          TEXT,
  language_primary    TEXT NOT NULL DEFAULT 'en-IN',
  language_secondary  TEXT,
  voice_provider      TEXT DEFAULT 'retell',
  voice_id            TEXT,
  voice_speed         NUMERIC(3,2) DEFAULT 1.0,
  temperature         NUMERIC(3,2) DEFAULT 0.7,
  model               TEXT DEFAULT 'gpt-4o-mini',
  system_prompt       TEXT NOT NULL DEFAULT '',
  conversation_opening TEXT,
  qualification_questions JSONB DEFAULT '[]',
  capture_fields      JSONB DEFAULT '[]',
  escalation_phone    TEXT,
  escalation_trigger  TEXT,
  knowledge_base_id   UUID REFERENCES public.knowledge_bases(id) ON DELETE SET NULL,
  retell_agent_id     TEXT,
  status              TEXT DEFAULT 'draft', -- draft | testing | active | paused
  is_template         BOOLEAN DEFAULT FALSE,
  created_by          UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_versions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  version_number    INT NOT NULL,
  snapshot          JSONB NOT NULL,
  change_summary    TEXT,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agent_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.agent_tools (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  tool_type         TEXT NOT NULL, -- calendar | crm | webhook | sms | transfer
  name              TEXT NOT NULL,
  description       TEXT,
  config            JSONB DEFAULT '{}',
  is_enabled        BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Phone Numbers
CREATE TABLE IF NOT EXISTS public.phone_numbers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  phone_number      TEXT NOT NULL,
  provider          TEXT DEFAULT 'retell', -- retell | twilio | plivo
  provider_id       TEXT,
  country_code      TEXT DEFAULT 'IN',
  number_type       TEXT DEFAULT 'local', -- local | tollfree | mobile
  assigned_agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'active', -- active | inactive | pending
  monthly_cost      NUMERIC(10,2) DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, phone_number)
);

-- 9. Contacts & Leads (CRM)
CREATE TABLE IF NOT EXISTS public.contacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  company           TEXT,
  location          TEXT,
  industry          TEXT,
  budget            TEXT,
  source            TEXT DEFAULT 'manual', -- manual | csv | meta_ads | website | api
  status            TEXT DEFAULT 'new', -- new | contacted | qualified | converted | inactive
  priority          TEXT DEFAULT 'medium', -- low | medium | high
  assigned_to       UUID REFERENCES auth.users(id),
  custom_fields     JSONB DEFAULT '{}',
  notes             TEXT,
  dnd_status        BOOLEAN DEFAULT FALSE,
  consent_obtained  BOOLEAN DEFAULT TRUE,
  last_contacted_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, phone)
);

CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id        UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  company           TEXT,
  location          TEXT,
  source            TEXT DEFAULT 'campaign',
  status            TEXT DEFAULT 'new', -- new | contacted | qualified | unqualified | converted
  score             INT DEFAULT 50, -- 0-100
  score_breakdown   JSONB DEFAULT '{}',
  priority          TEXT DEFAULT 'medium',
  assigned_to       UUID REFERENCES auth.users(id),
  intent_signals    JSONB DEFAULT '[]',
  estimated_value   NUMERIC(12,2),
  notes             TEXT,
  custom_fields     JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Campaigns & Campaign Contacts
CREATE TABLE IF NOT EXISTS public.campaigns (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  agent_id          UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE RESTRICT,
  phone_number_id   UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'draft', -- draft | scheduled | running | paused | completed | cancelled
  type              TEXT DEFAULT 'outbound', -- outbound | inbound
  schedule_start    TIMESTAMPTZ,
  schedule_end      TIMESTAMPTZ,
  calling_hours_start TIME DEFAULT '09:00:00',
  calling_hours_end   TIME DEFAULT '18:00:00',
  timezone          TEXT DEFAULT 'Asia/Kolkata',
  max_attempts      INT DEFAULT 3,
  retry_interval_minutes INT DEFAULT 60,
  daily_call_limit  INT DEFAULT 500,
  budget            NUMERIC(10,2) DEFAULT 0,
  spent             NUMERIC(10,2) DEFAULT 0,
  total_contacts    INT DEFAULT 0,
  completed_calls   INT DEFAULT 0,
  successful_calls  INT DEFAULT 0,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaign_contacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  campaign_id       UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id        UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  status            TEXT DEFAULT 'pending', -- pending | calling | answered | failed | busy | no_answer | completed
  attempts          INT DEFAULT 0,
  last_call_at      TIMESTAMPTZ,
  next_attempt_at   TIMESTAMPTZ,
  call_outcome      TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, contact_id)
);

-- 11. Calls, Transcripts, Summaries, Recordings
CREATE TABLE IF NOT EXISTS public.calls (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  campaign_id       UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  contact_id        UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  lead_id           UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id          UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  phone_number_id   UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
  direction         TEXT NOT NULL DEFAULT 'outbound', -- inbound | outbound
  status            TEXT NOT NULL DEFAULT 'queued', -- queued | ringing | in-progress | completed | busy | no-answer | failed | cancelled
  from_number       TEXT NOT NULL,
  to_number         TEXT NOT NULL,
  duration_seconds  INT DEFAULT 0,
  cost              NUMERIC(8,4) DEFAULT 0,
  disconnection_reason TEXT,
  retell_call_id    TEXT,
  started_at        TIMESTAMPTZ,
  ended_at          TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_recordings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_id           UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE UNIQUE,
  storage_path      TEXT NOT NULL,
  public_url        TEXT,
  duration_seconds  INT,
  file_size         BIGINT,
  format            TEXT DEFAULT 'mp3',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_transcripts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_id           UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE UNIQUE,
  transcript_text   TEXT NOT NULL,
  dialogue          JSONB DEFAULT '[]', -- array of { role, content, timestamp }
  sentiment         TEXT, -- positive | neutral | negative
  sentiment_score   NUMERIC(3,2),
  language          TEXT DEFAULT 'en',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_summaries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_id           UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE UNIQUE,
  summary           TEXT NOT NULL,
  key_points        JSONB DEFAULT '[]',
  qualification_result TEXT, -- qualified | not_qualified | follow_up_needed
  action_items      JSONB DEFAULT '[]',
  captured_data     JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_id           UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  event_type        TEXT NOT NULL,
  payload           JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id        UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  call_id           UUID REFERENCES public.calls(id) ON DELETE SET NULL,
  agent_id          UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  start_time        TIMESTAMPTZ NOT NULL,
  end_time          TIMESTAMPTZ NOT NULL,
  status            TEXT DEFAULT 'scheduled', -- scheduled | completed | cancelled | rescheduled
  location          TEXT,
  calendar_event_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Integrations & Credentials
CREATE TABLE IF NOT EXISTS public.integrations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider          TEXT NOT NULL, -- retell | whatsapp | google_calendar | google_sheets | razorpay | n8n
  name              TEXT NOT NULL,
  status            TEXT DEFAULT 'inactive', -- active | inactive | error
  config            JSONB DEFAULT '{}',
  last_synced_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, provider)
);

CREATE TABLE IF NOT EXISTS public.integration_credentials (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  integration_id    UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  encrypted_key     TEXT NOT NULL,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Workflows & Automations
CREATE TABLE IF NOT EXISTS public.workflows (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  trigger_type      TEXT NOT NULL, -- lead_created | call_completed | lead_qualified | call_failed
  is_active         BOOLEAN DEFAULT TRUE,
  definition        JSONB NOT NULL DEFAULT '{}',
  runs_count        INT DEFAULT 0,
  last_run_at       TIMESTAMPTZ,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  workflow_id       UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status            TEXT DEFAULT 'running', -- running | completed | failed
  trigger_payload   JSONB DEFAULT '{}',
  result            JSONB DEFAULT '{}',
  error_message     TEXT,
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ
);

-- 15. Wallets, Transactions & Billing
CREATE TABLE IF NOT EXISTS public.wallets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  balance           NUMERIC(12,4) DEFAULT 100.0000, -- default demo credits (₹100)
  currency          TEXT DEFAULT 'INR',
  is_locked         BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  wallet_id         UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  type              TEXT NOT NULL, -- credit | debit
  amount            NUMERIC(12,4) NOT NULL,
  description       TEXT NOT NULL,
  reference_type    TEXT, -- call | payment | refund | adjustment
  reference_id      TEXT,
  balance_after     NUMERIC(12,4),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  plan              TEXT NOT NULL DEFAULT 'free', -- free | starter | growth | enterprise
  status            TEXT NOT NULL DEFAULT 'active', -- active | past_due | cancelled | trialing
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end   TIMESTAMPTZ,
  razorpay_subscription_id TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  amount            NUMERIC(10,2) NOT NULL,
  currency          TEXT DEFAULT 'INR',
  status            TEXT NOT NULL DEFAULT 'pending', -- pending | captured | failed | refunded
  provider          TEXT DEFAULT 'razorpay',
  provider_payment_id TEXT,
  provider_order_id   TEXT,
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_number    TEXT UNIQUE NOT NULL,
  amount            NUMERIC(10,2) NOT NULL,
  tax               NUMERIC(10,2) DEFAULT 0,
  currency          TEXT DEFAULT 'INR',
  status            TEXT DEFAULT 'paid', -- draft | open | paid | uncollectible
  paid_at           TIMESTAMPTZ,
  pdf_url           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Notifications, Audit Logs & Support
CREATE TABLE IF NOT EXISTS public.notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  message           TEXT NOT NULL,
  type              TEXT DEFAULT 'info', -- info | success | warning | error | call
  link              TEXT,
  is_read           BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action            TEXT NOT NULL,
  resource_type     TEXT NOT NULL,
  resource_id       TEXT,
  details           JSONB DEFAULT '{}',
  ip_address        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject           TEXT NOT NULL,
  description       TEXT NOT NULL,
  priority          TEXT DEFAULT 'medium', -- low | medium | high | urgent
  status            TEXT DEFAULT 'open', -- open | in_progress | resolved | closed
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_agents_org ON public.ai_agents(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON public.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON public.contacts(organization_id, phone);
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON public.campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_calls_org ON public.calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_calls_campaign ON public.calls(campaign_id);
CREATE INDEX IF NOT EXISTS idx_calls_created ON public.calls(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chunks_kb ON public.knowledge_chunks(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON public.knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_org ON public.wallet_transactions(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
-- VoiceFlow AI Row Level Security Policies
-- Migration: 002_rls_policies.sql

-- 1. Security Helper Functions
CREATE OR REPLACE FUNCTION public.current_user_org_ids()
RETURNS TABLE (organization_id UUID) 
LANGUAGE sql 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = auth.uid() 
    AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = org_id 
      AND user_id = auth.uid() 
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organization_members 
    WHERE organization_id = org_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
$$;

-- 2. Enable RLS on ALL Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- 4. Organizations Policies
CREATE POLICY "Org members can view their organization"
  ON public.organizations FOR SELECT
  USING (id IN (SELECT current_user_org_ids()));

CREATE POLICY "Authenticated users can create an organization"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Org admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(id));

-- 5. Organization Members Policies
CREATE POLICY "Members can view other members in their organization"
  ON public.organization_members FOR SELECT
  USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY "Admins can add members to their organization"
  ON public.organization_members FOR INSERT
  WITH CHECK (public.is_org_admin(organization_id) OR user_id = auth.uid());

CREATE POLICY "Admins can update members in their organization"
  ON public.organization_members FOR UPDATE
  USING (public.is_org_admin(organization_id));

CREATE POLICY "Admins can remove members from their organization"
  ON public.organization_members FOR DELETE
  USING (public.is_org_admin(organization_id));

-- 6. Macro Policies for Tenant-Specific Entities
-- AI Agents
CREATE POLICY "Tenant isolation for ai_agents select" ON public.ai_agents FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for ai_agents insert" ON public.ai_agents FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for ai_agents update" ON public.ai_agents FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for ai_agents delete" ON public.ai_agents FOR DELETE USING (public.is_org_admin(organization_id));

-- Contacts
CREATE POLICY "Tenant isolation for contacts select" ON public.contacts FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for contacts insert" ON public.contacts FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for contacts update" ON public.contacts FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for contacts delete" ON public.contacts FOR DELETE USING (organization_id IN (SELECT current_user_org_ids()));

-- Leads
CREATE POLICY "Tenant isolation for leads select" ON public.leads FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for leads insert" ON public.leads FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for leads update" ON public.leads FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for leads delete" ON public.leads FOR DELETE USING (organization_id IN (SELECT current_user_org_ids()));

-- Campaigns
CREATE POLICY "Tenant isolation for campaigns select" ON public.campaigns FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for campaigns insert" ON public.campaigns FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for campaigns update" ON public.campaigns FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for campaigns delete" ON public.campaigns FOR DELETE USING (public.is_org_admin(organization_id));

-- Calls
CREATE POLICY "Tenant isolation for calls select" ON public.calls FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for calls insert" ON public.calls FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for calls update" ON public.calls FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));

-- Knowledge Bases
CREATE POLICY "Tenant isolation for knowledge_bases select" ON public.knowledge_bases FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_bases insert" ON public.knowledge_bases FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_bases update" ON public.knowledge_bases FOR UPDATE USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_bases delete" ON public.knowledge_bases FOR DELETE USING (public.is_org_admin(organization_id));

-- Knowledge Documents & Chunks
CREATE POLICY "Tenant isolation for knowledge_documents select" ON public.knowledge_documents FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_documents insert" ON public.knowledge_documents FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_documents delete" ON public.knowledge_documents FOR DELETE USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY "Tenant isolation for knowledge_chunks select" ON public.knowledge_chunks FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for knowledge_chunks insert" ON public.knowledge_chunks FOR INSERT WITH CHECK (organization_id IN (SELECT current_user_org_ids()));

-- Wallets & Transactions
CREATE POLICY "Tenant isolation for wallets select" ON public.wallets FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Tenant isolation for wallet_transactions select" ON public.wallet_transactions FOR SELECT USING (organization_id IN (SELECT current_user_org_ids()));

-- Notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR organization_id IN (SELECT current_user_org_ids()));
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- 7. Automatic Profile & Wallet Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-create wallet on new organization creation
CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (organization_id, balance, currency)
  VALUES (NEW.id, 100.0000, 'INR');
  
  INSERT INTO public.subscriptions (organization_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_organization_created ON public.organizations;
CREATE TRIGGER on_organization_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organization();
-- VoiceFlow AI Storage Buckets & Policies
-- Migration: 003_storage_buckets.sql

-- 1. Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('call-recordings', 'call-recordings', false, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg']),
  ('knowledge-documents', 'knowledge-documents', false, 20971520, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies
-- Objects in call-recordings bucket are structured as: {organization_id}/{call_id}.mp3
CREATE POLICY "Org members can read their own call recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'call-recordings'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can upload call recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'call-recordings'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

-- Objects in knowledge-documents bucket are structured as: {organization_id}/{document_id}.ext
CREATE POLICY "Org members can read their own knowledge documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can upload knowledge documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can delete their own knowledge documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);
-- VoiceFlow AI Seed Data for Testing & Demo
-- Migration: 004_seed_data.sql

DO $$
DECLARE
  demo_org_id UUID := '11111111-1111-1111-1111-111111111111';
  agent_priya_id UUID := '22222222-2222-2222-2222-222222222222';
  agent_ravi_id UUID := '33333333-3333-3333-3333-333333333333';
  kb_id UUID := '44444444-4444-4444-4444-444444444444';
  campaign_id UUID := '55555555-5555-5555-5555-555555555555';
  contact_1_id UUID := '66666666-6666-6666-6666-666666666661';
  contact_2_id UUID := '66666666-6666-6666-6666-666666666662';
  call_1_id UUID := '77777777-7777-7777-7777-777777777771';
BEGIN

  -- 1. Demo Organization
  INSERT INTO public.organizations (id, name, slug, industry, country, timezone, plan)
  VALUES (
    demo_org_id,
    'Acme Realty & Automations',
    'acme-realty',
    'Real Estate',
    'IN',
    'Asia/Kolkata',
    'growth'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Demo Knowledge Base
  INSERT INTO public.knowledge_bases (id, organization_id, name, description, is_default, document_count)
  VALUES (
    kb_id,
    demo_org_id,
    'Acme Real Estate Knowledge Base',
    'Property pricing, brochure details, site visit locations, and FAQs',
    TRUE,
    2
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Demo AI Agents
  INSERT INTO public.ai_agents (
    id,
    organization_id,
    name,
    description,
    role_title,
    language_primary,
    language_secondary,
    status,
    system_prompt,
    conversation_opening,
    qualification_questions,
    capture_fields,
    knowledge_base_id
  ) VALUES (
    agent_priya_id,
    demo_org_id,
    'Priya - Real Estate Specialist',
    'Senior sales qualification agent for luxury residential villas and apartments in Hyderabad and Bangalore.',
    'Sales Development Representative',
    'te-IN',
    'en-IN',
    'active',
    'You are Priya, a polite, professional AI voice assistant from Acme Realty. You speak fluent Telugu and Indian English. Your objective is to introduce the project, ask about their budget, location preference, and schedule a site visit.',
    'Namaskaram! I am Priya calling from Acme Realty. Am I speaking with the property buyer today?',
    '["Are you looking for a 2BHK or 3BHK?", "What is your target budget?", "When would you prefer a weekend site visit?"]'::jsonb,
    '[{"name": "budget", "type": "string"}, {"name": "preferred_location", "type": "string"}, {"name": "site_visit_date", "type": "date"}]'::jsonb,
    kb_id
  ), (
    agent_ravi_id,
    demo_org_id,
    'Dr. Ravi - Healthcare Assistant',
    'Medical appointment booking and prescription follow-up assistant.',
    'Healthcare Scheduling Officer',
    'hi-IN',
    'en-IN',
    'active',
    'You are Dr. Ravi''s clinic assistant. You speak Hindi and English. You confirm patient details, inquire about symptoms gently, and suggest available doctor consultation slots.',
    'Namaste! Main Apollo Healthcare clinic se bol raha hoon. Kya main aapka appointment schedule kar sakta hoon?',
    '["What symptoms are you experiencing?", "Do you need a morning or evening doctor slot?"]'::jsonb,
    '[{"name": "symptoms", "type": "string"}, {"name": "doctor_department", "type": "string"}]'::jsonb,
    NULL
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Demo Contacts
  INSERT INTO public.contacts (id, organization_id, name, phone, email, company, location, budget, status, priority)
  VALUES (
    contact_1_id,
    demo_org_id,
    'Ramesh Rao',
    '+919876543210',
    'ramesh.rao@example.com',
    'Tech Innovators',
    'Hyderabad',
    '₹1.5 Cr - ₹2 Cr',
    'qualified',
    'high'
  ), (
    contact_2_id,
    demo_org_id,
    'Suresh Kumar',
    '+919812345678',
    'suresh.k@example.com',
    'Kolkata Traders',
    'Bangalore',
    '₹90 Lakhs',
    'contacted',
    'medium'
  ) ON CONFLICT (id) DO NOTHING;

  -- 5. Demo Leads with AI Scores
  INSERT INTO public.leads (organization_id, contact_id, name, phone, email, status, score, estimated_value, priority)
  VALUES (
    demo_org_id,
    contact_1_id,
    'Ramesh Rao',
    '+919876543210',
    'ramesh.rao@example.com',
    'qualified',
    92,
    18000000.00,
    'high'
  ), (
    demo_org_id,
    contact_2_id,
    'Suresh Kumar',
    '+919812345678',
    'suresh.k@example.com',
    'contacted',
    68,
    9000000.00,
    'medium'
  ) ON CONFLICT (id) DO NOTHING;

  -- 6. Demo Campaign
  INSERT INTO public.campaigns (
    id,
    organization_id,
    name,
    description,
    agent_id,
    status,
    type,
    daily_call_limit,
    total_contacts,
    completed_calls,
    successful_calls
  ) VALUES (
    campaign_id,
    demo_org_id,
    'Cyber Hills Luxury Villas Launch',
    'Outbound qualification campaign for 100 new pre-launch inquiries.',
    agent_priya_id,
    'running',
    'outbound',
    200,
    100,
    45,
    38
  ) ON CONFLICT (id) DO NOTHING;

  -- 7. Demo Call Record
  INSERT INTO public.calls (
    id,
    organization_id,
    campaign_id,
    contact_id,
    agent_id,
    direction,
    status,
    from_number,
    to_number,
    duration_seconds,
    cost,
    started_at,
    ended_at
  ) VALUES (
    call_1_id,
    demo_org_id,
    campaign_id,
    contact_1_id,
    agent_priya_id,
    'outbound',
    'completed',
    '+914045678900',
    '+919876543210',
    142,
    3.5500,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours' + INTERVAL '142 seconds'
  ) ON CONFLICT (id) DO NOTHING;

  -- 8. Demo Call Transcript
  INSERT INTO public.call_transcripts (call_id, organization_id, transcript_text, dialogue, sentiment, sentiment_score, language)
  VALUES (
    call_1_id,
    demo_org_id,
    'Agent: Namaskaram! I am Priya calling from Acme Realty. Am I speaking with Ramesh garu?\nUser: Avunu, speaking Priya. Tell me.\nAgent: We have launched Cyber Hills luxury 3BHK villas near Gachibowli. Are you currently exploring a property investment?\nUser: Yes, I am looking for a 3BHK with club house amenities around 1.8 Cr.\nAgent: Wonderful! Cyber Hills fits your budget perfectly. Can I schedule a VIP site visit for this Saturday at 11 AM?\nUser: Saturday 11 AM works for me. Please send details on WhatsApp.\nAgent: Done! Sending the brochure and appointment invite right away. Dhanyavadalu!',
    '[
      {"role": "agent", "content": "Namaskaram! I am Priya calling from Acme Realty. Am I speaking with Ramesh garu?", "timestamp": "0:02"},
      {"role": "user", "content": "Avunu, speaking Priya. Tell me.", "timestamp": "0:15"},
      {"role": "agent", "content": "We have launched Cyber Hills luxury 3BHK villas near Gachibowli. Are you currently exploring a property investment?", "timestamp": "0:28"},
      {"role": "user", "content": "Yes, I am looking for a 3BHK with club house amenities around 1.8 Cr.", "timestamp": "0:45"},
      {"role": "agent", "content": "Wonderful! Cyber Hills fits your budget perfectly. Can I schedule a VIP site visit for this Saturday at 11 AM?", "timestamp": "1:02"},
      {"role": "user", "content": "Saturday 11 AM works for me. Please send details on WhatsApp.", "timestamp": "1:22"},
      {"role": "agent", "content": "Done! Sending the brochure and appointment invite right away. Dhanyavadalu!", "timestamp": "1:35"}
    ]'::jsonb,
    'positive',
    0.94,
    'te-IN'
  ) ON CONFLICT (call_id) DO NOTHING;

  -- 9. Demo Call Summary
  INSERT INTO public.call_summaries (call_id, organization_id, summary, key_points, qualification_result, captured_data)
  VALUES (
    call_1_id,
    demo_org_id,
    'Customer Ramesh Rao confirmed interest in 3BHK Cyber Hills luxury villas with budget of ₹1.8 Cr. Successfully scheduled site visit for Saturday 11:00 AM.',
    '["Looking for 3BHK in Gachibowli corridor", "Budget approved at ₹1.8 Cr", "Site visit confirmed for Saturday 11:00 AM", "Requested brochure via WhatsApp"]'::jsonb,
    'qualified',
    '{"budget": "1.8 Cr", "property_type": "3BHK Villa", "site_visit": "Saturday 11:00 AM"}'::jsonb
  ) ON CONFLICT (call_id) DO NOTHING;

  -- 10. Demo Wallet Balance & Transactions
  INSERT INTO public.wallets (organization_id, balance, currency)
  VALUES (demo_org_id, 4850.5000, 'INR')
  ON CONFLICT (organization_id) DO UPDATE SET balance = 4850.5000;

  INSERT INTO public.wallet_transactions (organization_id, wallet_id, type, amount, description, reference_type, balance_after)
  SELECT 
    demo_org_id, 
    id, 
    'debit', 
    3.5500, 
    'Outbound AI call (142 sec) - Campaign: Cyber Hills', 
    'call', 
    4850.5000
  FROM public.wallets WHERE organization_id = demo_org_id
  LIMIT 1;

END $$;
