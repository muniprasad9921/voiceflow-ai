import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

async function setupDemoUser() {
  const demoEmail = 'demo@voiceflow.ai'
  const demoPassword = 'DemoUser@2026!'

  console.log(`Setting up demo user: ${demoEmail}...`)

  // Check if user already exists
  const { data: userList } = await adminClient.auth.admin.listUsers()
  let user = userList.users.find(u => u.email === demoEmail)

  if (!user) {
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo Admin',
        company_name: 'Acme Realty & Automations'
      }
    })
    if (createError) {
      console.error('Failed to create demo user:', createError.message)
      return
    }
    user = newUser.user
    console.log('✓ Created demo user:', user.id)
  } else {
    // Update password to ensure it matches
    await adminClient.auth.admin.updateUserById(user.id, {
      password: demoPassword,
      email_confirm: true
    })
    console.log('✓ Demo user already exists, updated password:', user.id)
  }

  // Link to Acme Realty organization
  const demoOrgId = '11111111-1111-1111-1111-111111111111'
  const { error: memberError } = await adminClient
    .from('organization_members')
    .upsert({
      organization_id: demoOrgId,
      user_id: user.id,
      role: 'owner',
      status: 'active'
    }, { onConflict: 'organization_id,user_id' })

  if (memberError) {
    console.log('Notice linking member:', memberError.message)
  } else {
    console.log('✓ Demo user successfully linked as Owner of Acme Realty & Automations')
  }

  // Also ensure profile exists
  await adminClient.from('profiles').upsert({
    id: user.id,
    email: demoEmail,
    full_name: 'Demo Admin',
    onboarding_done: true
  })
  console.log('✓ Demo profile ensured')
}

setupDemoUser().catch(console.error)
