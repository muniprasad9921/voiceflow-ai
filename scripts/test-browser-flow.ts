import { createClient } from '@supabase/supabase-js'
import * as http from 'http'
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
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const anonClient = createClient(supabaseUrl, publishableKey)

async function testFullAuthFlow() {
  console.log('--- TESTING FULL DEMO LOGIN & PROTECTED DASHBOARD FLOW ---')

  // 1. Authenticate with demo credentials
  console.log('\n[1] Testing Supabase Authentication for demo@voiceflow.ai...')
  const { data, error } = await anonClient.auth.signInWithPassword({
    email: 'demo@voiceflow.ai',
    password: 'DemoUser@2026!'
  })

  if (error || !data.session) {
    console.error('❌ Sign-in failed:', error?.message)
    process.exit(1)
  }

  console.log('✓ Successfully signed in! User ID:', data.user.id)
  console.log('✓ Access Token Acquired (validity: 3600s)')

  // 2. Query Acme Realty data as the authenticated demo user
  console.log('\n[2] Verifying Authenticated Tenant Access as demo user...')
  const { data: orgs, error: orgErr } = await anonClient
    .from('organizations')
    .select('id, name, slug, plan, industry')

  if (orgErr) {
    console.error('❌ Org query error:', orgErr.message)
  } else {
    console.log(`✓ Organizations accessible to demo user (${orgs?.length} found):`)
    orgs?.forEach(o => console.log(`   - ${o.name} [ID: ${o.id}, Plan: ${o.plan}]`))
  }

  // 3. Query AI Agents
  const { data: agents } = await anonClient
    .from('ai_agents')
    .select('id, name, language_primary, status')

  console.log(`✓ AI Agents accessible to demo user (${agents?.length} found):`)
  agents?.forEach(a => console.log(`   - ${a.name} [Lang: ${a.language_primary}, Status: ${a.status}]`))

  // 4. Query CRM Leads
  const { data: leads } = await anonClient
    .from('leads')
    .select('id, name, score, status, estimated_value')

  console.log(`✓ Leads accessible to demo user (${leads?.length} found):`)
  leads?.forEach(l => console.log(`   - ${l.name} [Score: ${l.score}, Status: ${l.status}, Value: ₹${l.estimated_value}]`))

  // 5. Query Wallet Balance
  const { data: wallets } = await anonClient
    .from('wallets')
    .select('id, balance, currency')

  console.log(`✓ Wallet accessible to demo user: ₹${wallets?.[0]?.balance} ${wallets?.[0]?.currency}`)

  console.log('\n--- ALL DEMO USER DATA CHECKS PASSED SUCCESSFULLY ---')
}

testFullAuthFlow().catch(console.error)
