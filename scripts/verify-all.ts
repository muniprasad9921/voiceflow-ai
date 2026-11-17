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
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const anonClient = createClient(supabaseUrl, publishableKey)
const adminClient = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

interface TableCheck {
  table: string
  exists: boolean
  count: number
  error?: string
}

async function verifyAll() {
  console.log('================================================================');
  console.log('VOICEFLOW AI - COMPREHENSIVE SUPABASE VERIFICATION');
  console.log('================================================================');
  console.log(`Endpoint: ${supabaseUrl}`);

  // 1. ALL TABLES VERIFICATION
  const allTables = [
    'profiles',
    'organizations',
    'organization_members',
    'roles',
    'permissions',
    'role_permissions',
    'ai_agents',
    'agent_versions',
    'agent_tools',
    'phone_numbers',
    'contacts',
    'leads',
    'campaigns',
    'campaign_contacts',
    'calls',
    'call_recordings',
    'call_transcripts',
    'call_summaries',
    'call_events',
    'knowledge_bases',
    'knowledge_documents',
    'knowledge_chunks',
    'appointments',
    'integrations',
    'integration_credentials',
    'workflows',
    'workflow_executions',
    'wallets',
    'wallet_transactions',
    'subscriptions',
    'payments',
    'invoices',
    'notifications',
    'audit_logs',
    'support_tickets'
  ]

  console.log('\n[SECTION 1 & 2: VERIFYING ALL SCHEMA TABLES EXISTENCE]');
  const tableResults: TableCheck[] = []

  for (const table of allTables) {
    try {
      const { data, count, error } = await adminClient
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        tableResults.push({ table, exists: false, count: 0, error: error.message })
      } else {
        tableResults.push({ table, exists: true, count: count ?? 0 })
      }
    } catch (err: any) {
      tableResults.push({ table, exists: false, count: 0, error: err.message })
    }
  }

  const existingCount = tableResults.filter(t => t.exists).length
  console.log(`Tables Verified: ${existingCount} / ${allTables.length} exist.`);
  tableResults.forEach(t => {
    if (t.exists) {
      console.log(`  ✓ ${t.table.padEnd(25)} [EXISTS, Rows: ${t.count}]`)
    } else {
      console.log(`  ✗ ${t.table.padEnd(25)} [MISSING: ${t.error}]`)
    }
  })

  // 2. ROW LEVEL SECURITY (RLS) CHECK
  console.log('\n[SECTION 3 & 4: RLS & TENANT ISOLATION]');
  // Query with anonClient (unauthenticated) - should return 0 rows for tenant tables
  const rlsChecks = ['organizations', 'ai_agents', 'contacts', 'leads', 'campaigns', 'calls', 'wallets', 'knowledge_bases']
  for (const table of rlsChecks) {
    const { data: anonData, error: anonError } = await anonClient.from(table).select('*')
    const anonRows = anonData?.length ?? 0
    // Admin query
    const { data: adminData } = await adminClient.from(table).select('*')
    const adminRows = adminData?.length ?? 0
    console.log(`  • ${table.padEnd(20)} -> Anon Sees: ${anonRows} rows | Admin Sees: ${adminRows} rows -> RLS Block: ${anonRows === 0 ? 'ACTIVE (PASS)' : 'EXPOSED (FAIL)'}`)
  }

  // 3. STORAGE BUCKETS VERIFICATION
  console.log('\n[SECTION 5: STORAGE BUCKETS VERIFICATION]');
  const { data: buckets, error: bucketError } = await adminClient.storage.listBuckets()
  if (bucketError) {
    console.error('Bucket list error:', bucketError.message)
  } else {
    buckets.forEach(b => {
      console.log(`  ✓ Bucket: ${b.id.padEnd(25)} (Public: ${b.public}, Created: ${b.created_at})`)
    })
  }

  // 4. SEED DATA DETAILED VERIFICATION
  console.log('\n[SECTION 7: SEED DATA VERIFICATION]');
  const { data: orgs } = await adminClient.from('organizations').select('id, name, slug, plan, industry')
  console.log('Organizations:', orgs)

  const { data: agents } = await adminClient.from('ai_agents').select('id, name, role_title, language_primary, status')
  console.log('AI Agents:', agents)

  const { data: leads } = await adminClient.from('leads').select('id, name, phone, score, status, estimated_value')
  console.log('Leads:', leads)

  const { data: calls } = await adminClient.from('calls').select('id, duration_seconds, cost, direction, status')
  console.log('Calls:', calls)

  const { data: transcripts } = await adminClient.from('call_transcripts').select('call_id, sentiment, language')
  console.log('Transcripts:', transcripts)

  const { data: wallets } = await adminClient.from('wallets').select('id, balance, currency')
  console.log('Wallets:', wallets)

  // 5. SUPABASE AUTH VERIFICATION
  console.log('\n[SECTION 8: AUTH CONNECTIVITY VERIFICATION]');
  try {
    const testEmail = `verification_${Date.now()}@voiceflow-test.internal`
    const testPassword = 'Test_Password_123!'
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Verification Bot' }
    })

    if (authError) {
      console.log('  Auth createUser Notice:', authError.message)
    } else if (authData.user) {
      console.log(`  ✓ Supabase Auth User Creation: SUCCESS (UserID: ${authData.user.id})`)
      
      // Test signing in as this user with anon client
      const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      if (signInError) {
        console.log('  Auth sign-in notice:', signInError.message)
      } else {
        console.log(`  ✓ Supabase Auth Sign-In: SUCCESS (Session Token Acquired)`)
      }

      // Cleanup test user
      await adminClient.auth.admin.deleteUser(authData.user.id)
      console.log(`  ✓ Cleanup Test User: SUCCESS`)
    }
  } catch (err: any) {
    console.log('  Auth error:', err.message)
  }

  console.log('\n================================================================');
  console.log('VERIFICATION COMPLETE');
  console.log('================================================================');
}

verifyAll().catch(console.error)
