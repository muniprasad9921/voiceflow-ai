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
