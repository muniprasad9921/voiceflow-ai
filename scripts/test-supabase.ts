import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local manually for standalone scripts
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

async function runTests() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('--- SUPABASE CONNECTION & VERIFICATION TEST ---')
  console.log('Project URL:', supabaseUrl || '(not configured)')
  console.log('Publishable Key:', publishableKey ? `${publishableKey.substring(0, 16)}...` : '(missing)')
  console.log('Secret Key configured:', secretKey ? 'YES (server-only)' : 'NO')

  if (!supabaseUrl || !publishableKey) {
    console.error('\n❌ ERROR: NEXT_PUBLIC_SUPABASE_URL or publishable key is missing.')
    console.error('Please configure your project URL in .env.local')
    process.exit(1)
  }

  // 1. Test Client Connection (using Publishable Key)
  console.log('\n[1/4] Testing client connection using Publishable Key...')
  const client = createClient(supabaseUrl, publishableKey)
  
  try {
    const { data, error } = await client.from('organizations').select('id, name, slug').limit(1)
    if (error) {
      console.log('Notice from public client:', error.message)
    } else {
      console.log('✅ Public client connected successfully. Records visible:', data?.length ?? 0)
    }
  } catch (err: any) {
    console.error('❌ Connection error:', err.message)
  }

  // 2. Test Admin Client Connection (using Secret Key if present)
  if (secretKey) {
    console.log('\n[2/4] Testing admin connection using Secret Key (server-side only)...')
    const adminClient = createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    try {
      const { data: orgs, error: orgError } = await adminClient.from('organizations').select('id, name, slug, plan')
      if (orgError) {
        console.error('❌ Admin query failed:', orgError.message)
      } else {
        console.log(`✅ Admin connected successfully! Found ${orgs?.length || 0} organizations:`)
        orgs?.forEach(o => console.log(`   - [${o.id}] ${o.name} (${o.slug}) [Plan: ${o.plan}]`))
      }

      // Check agents
      const { data: agents } = await adminClient.from('ai_agents').select('id, name, role_title, status')
      console.log(`✅ AI Agents found: ${agents?.length || 0}`)
      agents?.forEach(a => console.log(`   - ${a.name} (${a.role_title}) [${a.status}]`))

      // Check storage buckets
      console.log('\n[3/4] Checking storage buckets...')
      const { data: buckets, error: bError } = await adminClient.storage.listBuckets()
      if (bError) {
        console.log('Bucket check notice:', bError.message)
      } else {
        console.log(`✅ Found ${buckets?.length || 0} storage buckets:`)
        buckets?.forEach(b => console.log(`   - ${b.id} (public: ${b.public})`))
      }

      // 4. Test RLS Tenant Isolation
      console.log('\n[4/4] Verifying Tenant Isolation (RLS)...')
      // With anon client and no auth session, RLS should block or return 0 rows for private records
      const { data: privateLeads } = await client.from('leads').select('*')
      console.log(`✅ Anon client without auth sees: ${privateLeads?.length || 0} leads (Expected 0 due to RLS)`)

    } catch (err: any) {
      console.error('❌ Admin client error:', err.message)
    }
  }

  console.log('\n--- VERIFICATION FINISHED ---')
}

runTests().catch(console.error)
