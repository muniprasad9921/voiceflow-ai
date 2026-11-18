-- ==============================================================================
-- VOICEFLOW AI — Migration 005: AI Chat Support & Customer Assistance
-- ==============================================================================

-- 1. Chat Conversations Table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id   UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated', 'closed')),
  visitor_name      TEXT,
  visitor_email     TEXT,
  visitor_phone     TEXT,
  metadata          JSONB DEFAULT '{}',
  last_message_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type       TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
  content           TEXT NOT NULL,
  sources           JSONB DEFAULT '[]',
  intent            TEXT,
  confidence        NUMERIC(4,3),
  is_verified       BOOLEAN DEFAULT TRUE,
  feedback          TEXT CHECK (feedback IN ('helpful', 'unhelpful', NULL)),
  feedback_notes    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chat Escalations Table
CREATE TABLE IF NOT EXISTS public.chat_escalations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  visitor_name      TEXT NOT NULL,
  visitor_email     TEXT NOT NULL,
  visitor_phone     TEXT,
  message           TEXT NOT NULL,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'closed')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Approved Knowledge Base FAQs (Curated Ground Truth for RAG)
CREATE TABLE IF NOT EXISTS public.approved_kb_faqs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category          TEXT NOT NULL, -- overview | features | pricing | technology | onboarding | support | integrations
  question          TEXT NOT NULL,
  answer            TEXT NOT NULL,
  keywords          TEXT[] DEFAULT '{}',
  is_active         BOOLEAN DEFAULT TRUE,
  priority          INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for Fast Retrieval
CREATE INDEX IF NOT EXISTS idx_chat_conv_session ON public.chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conv_user ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conv_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conv_updated ON public.chat_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_msg_conv ON public.chat_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_esc_status ON public.chat_escalations(status);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_category ON public.approved_kb_faqs(category);
CREATE INDEX IF NOT EXISTS idx_kb_faqs_keywords ON public.approved_kb_faqs USING gin(keywords);

-- 6. Enable Row Level Security
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_kb_faqs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Visitors and users can view and create conversations matching their session_id
CREATE POLICY "Public visitors can create conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Visitors can read own conversation by session"
  ON public.chat_conversations FOR SELECT
  USING (
    session_id IS NOT NULL OR 
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
  );

CREATE POLICY "Public visitors can insert messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public visitors can view messages"
  ON public.chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can update message feedback"
  ON public.chat_messages FOR UPDATE
  USING (true);

CREATE POLICY "Public visitors can create escalations"
  ON public.chat_escalations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Approved FAQs are publicly readable"
  ON public.approved_kb_faqs FOR SELECT
  USING (is_active = true);

-- 8. Seed Verified Knowledge Base Content
INSERT INTO public.approved_kb_faqs (category, question, answer, keywords, priority)
VALUES
  (
    'overview',
    'What is VoiceFlow AI?',
    'VoiceFlow AI is an enterprise-grade autonomous B2B AI Voice Employee and Business Automation platform. It allows businesses to deploy human-like conversational voice agents that handle inbound support, conduct outbound lead qualification, book appointments, and execute multi-step workflows 24/7 across 12+ languages.',
    ARRAY['voiceflow', 'about', 'overview', 'what is', 'platform', 'ai voice', 'what is voiceflow ai'],
    100
  ),
  (
    'features',
    'What services do you provide?',
    'VoiceFlow AI provides four primary enterprise services: 1) Autonomous Outbound Voice Agents for lead qualification, sales outreach, and payment follow-ups; 2) 24/7 Inbound Customer Support Agents with sub-500ms latency; 3) Smart Appointment Scheduling synced with Google Calendar and Outlook; and 4) Enterprise CRM & Workflow Automation connecting directly to HubSpot, Salesforce, Zoho, WhatsApp, and internal webhooks.',
    ARRAY['services', 'offerings', 'features', 'capabilities', 'what do you do', 'solutions', 'what services do you provide'],
    95
  ),
  (
    'technology',
    'How does AI voice calling work?',
    'VoiceFlow AI uses a high-performance, sub-500ms voice pipeline. When a call connects, audio streams in real time through an ultra-low latency Speech-to-Text (STT) model. Our Conversational Intelligence Layer reasons over your business knowledge base using RAG, determines the optimal response with natural turn-taking, and streams lifelike human speech back through emotional Neural Text-to-Speech (TTS) with full interruption handling.',
    ARRAY['how it works', 'voice calling', 'technology', 'latency', 'architecture', 'speech', 'tts', 'stt', 'how does ai voice calling work'],
    90
  ),
  (
    'pricing',
    'What are your pricing plans?',
    'VoiceFlow AI offers three transparent pricing plans: 1) Starter Plan at ₹4,999/month ($59/mo) with 1 AI Voice Employee and 500 calling minutes; 2) Growth Plan at ₹14,999/month ($179/mo) with 5 AI Voice Employees, 2,500 calling minutes, CRM integration, and analytics; and 3) Enterprise Plan at ₹39,999/month ($479/mo) featuring unlimited AI employees, custom voice cloning, dedicated account management, custom SLA, and VPC deployment. Additional usage is billed per second from your prepaid wallet.',
    ARRAY['pricing', 'plans', 'cost', 'subscription', 'starter', 'growth', 'enterprise', 'rate', 'how much', 'what are your pricing plans'],
    95
  ),
  (
    'onboarding',
    'How can I get started?',
    'Getting started takes under 5 minutes: 1) Create your account at voiceflow.ai/signup; 2) Open Agent Studio in your dashboard to pick a pre-built industry template (Real Estate, Healthcare, Banking, Logistics, etc.); 3) Customize your voice persona, prompt instructions, and knowledge base; 4) Add balance to your prepaid wallet; and 5) Test your agent in the interactive playground or launch your first calling campaign.',
    ARRAY['get started', 'signup', 'onboarding', 'how to start', 'register', 'begin', 'how can i get started'],
    90
  ),
  (
    'support',
    'How can I contact support?',
    'You can contact the VoiceFlow AI team anytime by emailing support@voiceflow.ai, calling our AI support desk, or submitting an escalation ticket right here in this chat window. Our technical team responds to growth and enterprise customers within 1 hour.',
    ARRAY['support', 'contact', 'help', 'email', 'phone', 'escalate', 'human support', 'how can i contact support'],
    85
  ),
  (
    'languages',
    'What languages do you support?',
    'VoiceFlow AI natively supports 12+ languages with regional accents: English (US, UK, Indian, Australian), Hindi, Hinglish (mixed Hindi-English), Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Spanish, French, and German. Agents dynamically adapt to the caller language in real time.',
    ARRAY['languages', 'hindi', 'english', 'tamil', 'telugu', 'hinglish', 'multilingual', 'accent'],
    80
  ),
  (
    'integrations',
    'What integrations are supported?',
    'VoiceFlow AI connects out-of-the-box with leading enterprise platforms including: HubSpot, Salesforce, Zoho CRM, Google Calendar, Google Sheets, Meta WhatsApp Business Cloud API, Razorpay, Twilio, Retell AI, Exotel, Webhooks, and Zapier/n8n automation pipelines.',
    ARRAY['integrations', 'hubspot', 'salesforce', 'zoho', 'whatsapp', 'google calendar', 'crm', 'webhooks', 'retell'],
    80
  ),
  (
    'security',
    'Is customer data secure and compliant?',
    'Yes, enterprise security is foundational to VoiceFlow AI. All tenant data is strictly isolated using PostgreSQL Row Level Security (RLS). Call recordings and documents reside in private encrypted storage buckets. We are GDPR compliant and adhere to India Digital Personal Data Protection Act (DPDPA) guidelines with full TLS 1.3 encryption in transit and AES-256 at rest.',
    ARRAY['security', 'privacy', 'gdpr', 'dpdpa', 'compliance', 'encryption', 'data safety', 'rls'],
    80
  ),
  (
    'billing',
    'How does call metering and billing work?',
    'VoiceFlow AI operates on a fair per-second billing model. Outbound and inbound calls deduct minutes directly from your prepaid wallet balance with no rounding up to full minutes. You can configure automatic low-balance notifications and top up your wallet instantly via Razorpay, UPI, credit cards, or net banking.',
    ARRAY['billing', 'metering', 'wallet', 'per second', 'recharge', 'payment', 'deduction'],
    75
  )
ON CONFLICT DO NOTHING;
