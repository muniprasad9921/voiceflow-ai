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
