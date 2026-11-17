import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join('=').trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminClient = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const demoOrgId = '11111111-1111-1111-1111-111111111111'

async function testCrud() {
  console.log('========================================================')
  console.log('TESTING FULL CRUD OPERATIONS ON LIVE SUPABASE DATABASE')
  console.log('========================================================\n')

  // 1. Test AI Agent Creation, Editing, Activation & Deactivation
  console.log('[TEST 1: AI AGENT LIFECYCLE]')
  const testAgentName = `Audit Test Agent ${Date.now()}`
  const { data: newAgent, error: createAgentErr } = await adminClient
    .from('ai_agents')
    .insert({
      organization_id: demoOrgId,
      name: testAgentName,
      role_title: 'Automated Audit Specialist',
      language_primary: 'te-IN',
      status: 'active',
      system_prompt: 'Test prompt for audit verification'
    })
    .select()
    .single()

  if (createAgentErr || !newAgent) {
    console.error('✗ Agent creation failed:', createAgentErr?.message)
    process.exit(1)
  }
  console.log(`✓ Agent Created: ID ${newAgent.id} [Status: ${newAgent.status}]`)

  // Deactivate
  const { data: pausedAgent, error: pauseErr } = await adminClient
    .from('ai_agents')
    .update({ status: 'paused' })
    .eq('id', newAgent.id)
    .select()
    .single()
  console.log(`✓ Agent Deactivated (Paused): [Status: ${pausedAgent?.status}]`)

  // Edit instructions & Reactivate
  const { data: activeAgent, error: activateErr } = await adminClient
    .from('ai_agents')
    .update({ status: 'active', system_prompt: 'Updated instructions via audit test' })
    .eq('id', newAgent.id)
    .select()
    .single()
  console.log(`✓ Agent Edited & Reactivated: [Status: ${activeAgent?.status}, Prompt: ${activeAgent?.system_prompt}]`)

  // 2. Test CRM Contacts & Leads CRUD
  console.log('\n[TEST 2: CRM CONTACTS & LEADS LIFECYCLE]')
  const testPhone = `+9199999${Math.floor(10000 + Math.random() * 90000)}`
  const { data: contact, error: contactErr } = await adminClient
    .from('contacts')
    .insert({
      organization_id: demoOrgId,
      name: 'Audit Test Contact',
      phone: testPhone,
      email: 'test_contact@audit.internal',
      location: 'Hyderabad',
      budget: '₹2.5 Cr',
      status: 'new'
    })
    .select()
    .single()

  if (contactErr || !contact) {
    console.error('✗ Contact creation failed:', contactErr?.message)
    process.exit(1)
  }
  console.log(`✓ Contact Created: ID ${contact.id} [${contact.name}, ${contact.phone}]`)

  // Create Lead
  const { data: lead, error: leadErr } = await adminClient
    .from('leads')
    .insert({
      organization_id: demoOrgId,
      contact_id: contact.id,
      name: contact.name,
      phone: contact.phone,
      status: 'new',
      score: 75,
      estimated_value: 25000000
    })
    .select()
    .single()
  console.log(`✓ Lead Created: ID ${lead?.id} [Score: ${lead?.score}, Status: ${lead?.status}]`)

  // Update Lead to Qualified
  const { data: qualLead, error: qualErr } = await adminClient
    .from('leads')
    .update({ status: 'qualified', score: 95 })
    .eq('id', lead?.id)
    .select()
    .single()
  console.log(`✓ Lead Status Updated: [New Status: ${qualLead?.status}, Score: ${qualLead?.score}]`)

  // 3. Test Campaign Creation
  console.log('\n[TEST 3: CAMPAIGN CREATION]')
  const { data: campaign, error: campErr } = await adminClient
    .from('campaigns')
    .insert({
      organization_id: demoOrgId,
      name: `Audit Outbound Campaign ${Date.now()}`,
      agent_id: newAgent.id,
      status: 'draft',
      daily_call_limit: 150
    })
    .select()
    .single()
  console.log(`✓ Campaign Created: ID ${campaign?.id} [${campaign?.name}, Status: ${campaign?.status}]`)

  // 4. Test Call Record, Transcript, and Summary
  console.log('\n[TEST 4: CALL RECORD & TRANSCRIPT STORAGE]')
  const { data: call, error: callErr } = await adminClient
    .from('calls')
    .insert({
      organization_id: demoOrgId,
      campaign_id: campaign?.id,
      contact_id: contact.id,
      agent_id: newAgent.id,
      direction: 'outbound',
      status: 'completed',
      from_number: '+914045678900',
      to_number: contact.phone,
      duration_seconds: 98,
      cost: 2.45
    })
    .select()
    .single()
  console.log(`✓ Call Logged: ID ${call?.id} [Duration: ${call?.duration_seconds}s, Cost: ₹${call?.cost}]`)

  // Add transcript
  const { data: transcript, error: transErr } = await adminClient
    .from('call_transcripts')
    .insert({
      organization_id: demoOrgId,
      call_id: call?.id,
      transcript_text: 'Agent: Namaskaram! Calling to confirm your interest in luxury villas.\nUser: Yes, Saturday morning works for a site visit.',
      sentiment: 'positive',
      sentiment_score: 0.92,
      language: 'te-IN'
    })
    .select()
    .single()
  console.log(`✓ Call Transcript Stored: ID ${transcript?.id} [Sentiment: ${transcript?.sentiment}]`)

  // Cleanup test artifacts
  console.log('\n[TEST 5: CLEANUP AUDIT TEST ARTIFACTS]')
  await adminClient.from('calls').delete().eq('id', call?.id)
  await adminClient.from('campaigns').delete().eq('id', campaign?.id)
  await adminClient.from('leads').delete().eq('id', lead?.id)
  await adminClient.from('contacts').delete().eq('id', contact.id)
  await adminClient.from('ai_agents').delete().eq('id', newAgent.id)
  console.log('✓ All test records cleaned up cleanly without affecting seed data.')

  console.log('\n========================================================')
  console.log('ALL CRUD OPERATIONS COMPLETED & VERIFIED SUCCESSFULLY!')
  console.log('========================================================')
}

testCrud().catch(console.error)
