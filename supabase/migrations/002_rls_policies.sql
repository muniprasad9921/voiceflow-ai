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
