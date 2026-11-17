# VoiceFlow AI — Enterprise B2B Voice Agent & Business Automation SaaS

VoiceFlow AI is an autonomous B2B AI Voice Employee and Business Automation SaaS platform. It enables businesses to deploy ultra-low latency conversational AI voice agents that handle inbound and outbound calls, qualify leads, schedule appointments, execute multi-step business workflows, and sync seamlessly with CRM pipelines 24/7 across 12+ languages.

---

## Key Features

- **Autonomous Voice Employees:** Outbound lead qualification, inbound customer support, payment reminders, and appointment scheduling.
- **Multi-Tenant Architecture:** Built on Supabase PostgreSQL with strict Row Level Security (RLS) tenant isolation.
- **Enterprise CRM Suite:** Unified pipeline Kanban board, contact & lead scoring, and customer 360 profiles.
- **Agent Studio & Playground:** Visual prompt builder, LLM selection, voice persona configuration, and interactive testing studio.
- **Outbound Campaign Engine:** Bulk calling campaigns, predictive dialing logic, and live campaign analytics.
- **Call Detail Records (CDR) & Transcripts:** Multi-speaker transcripts with millisecond timestamps, audio playback, and sentiment scoring.
- **Prepaid Wallet & Billing:** Real-time per-second call metering, automated low-balance alerts, and transaction ledgers.
- **Private Document & Audio Storage:** Encrypted buckets for call recordings and knowledge base documents.

---

## Tech Stack

- **Framework:** Next.js 16 (Turbopack, App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, Lucide Icons, Radix UI
- **Database & Auth:** Supabase (PostgreSQL, GoTrue Auth, Storage, RLS)
- **State & Forms:** React Hook Form, Zod
- **Data Visualization:** Recharts

---

## Getting Started

### 1. Prerequisites
- Node.js 20+ (recommended v22+)
- pnpm (v9+ or v12+)
- A Supabase project

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/voiceflow-ai.git
cd voiceflow-ai

# Install dependencies
pnpm install
```

### 3. Environment Setup
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Migrations
Apply the consolidated migration found in `supabase/full_migration.sql` through the Supabase SQL Editor:
- Creates all 35 schema tables.
- Enables Row Level Security (RLS) on all tenant tables.
- Sets up private storage buckets (`call-recordings`, `knowledge-documents`).

### 5. Run the Application
```bash
# Start development server
pnpm run dev

# Or build for production
pnpm run build
pnpm run start
```
Visit `http://localhost:3000` in your browser.

---

## Security & Tenant Isolation

- **Zero-Trust Multi-Tenancy:** Every tenant table implements RLS policies enforced by PostgreSQL security definer functions (`is_org_member()`, `current_user_org_ids()`).
- **Secret Key Protection:** `SUPABASE_SERVICE_ROLE_KEY` is restricted exclusively to server-side APIs and background administration scripts. It is never exposed in browser bundles or client code.
- **Storage Security:** Call recordings and knowledge base uploads are stored in private buckets protected by authenticated tenant policies.

---

## License
Proprietary & Confidential. All rights reserved.
