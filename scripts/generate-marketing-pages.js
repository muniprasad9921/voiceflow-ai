const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '(marketing)');

const marketingPages = {
  'features': {
    title: 'Enterprise AI Voice Agent Features',
    badge: 'Autonomous B2B Calling',
    desc: 'Explore the full spectrum of capabilities that make VoiceFlow AI the leading conversational AI platform.',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">01</div>
          <h3 className="text-lg font-bold text-white mb-2">Multilingual Indian Voice</h3>
          <p className="text-sm text-slate-400">Natural fluency in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English with authentic accents.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">02</div>
          <h3 className="text-lg font-bold text-white mb-2">Sub-second Latency</h3>
          <p className="text-sm text-slate-400">Under 600ms conversational turn-around using streaming ASR, neural synthesis, and edge inference.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">03</div>
          <h3 className="text-lg font-bold text-white mb-2">Automated CRM & Calendars</h3>
          <p className="text-sm text-slate-400">Instant qualification, lead scoring, WhatsApp follow-ups, and calendar appointment scheduling.</p>
        </div>
      </div>
    `
  },
  'pricing': {
    title: 'Simple, Transparent Pricing',
    badge: 'No Contracts · Pay As You Go',
    desc: 'Start with our generous free tier, then scale seamlessly with predictable pay-as-you-go calling rates.',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-5xl mx-auto">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Starter Free</div>
          <div className="text-4xl font-extrabold text-white mb-2">₹0</div>
          <p className="text-xs text-slate-400 mb-6">Explore Voice Playground & create up to 2 AI employees.</p>
          <a href="/signup" className="block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">Start Free</a>
        </div>
        <div className="p-8 bg-gradient-to-b from-indigo-950 to-slate-900 border-2 border-indigo-500 rounded-2xl relative shadow-2xl shadow-indigo-500/20">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Growth Plan</div>
          <div className="text-4xl font-extrabold text-white mb-2">₹4,999 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
          <p className="text-xs text-slate-300 mb-6">Unlimited AI voice agents, bulk campaigns, CRM pipelines, and priority support.</p>
          <a href="/signup" className="block text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all">Get Started</a>
        </div>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Enterprise</div>
          <div className="text-4xl font-extrabold text-white mb-2">Custom</div>
          <p className="text-xs text-slate-400 mb-6">Dedicated SIP trunks, custom LLM fine-tuning, and on-premise SLA.</p>
          <a href="/contact" className="block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">Contact Sales</a>
        </div>
      </div>
    `
  },
  'industries': {
    title: 'Industry-Specific AI Voice Solutions',
    badge: 'Tailored Workflows',
    desc: 'Pre-configured voice agents with industry-specific vocabulary, objection matrices, and compliance guardrails.',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Real Estate</h3>
          <p className="text-xs text-slate-400">Qualify prospective property buyers, verify budget ranges, and schedule weekend site visits with Google Maps dispatch.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Healthcare & Clinics</h3>
          <p className="text-xs text-slate-400">Handle patient appointment bookings, collect initial symptoms, send reminders, and reduce no-show rates.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Automobile Dealerships</h3>
          <p className="text-xs text-slate-400">Call web test drive inquiries, verify driver preferences, schedule dealership showroom visits, and follow up.</p>
        </div>
      </div>
    `
  },
  'about': {
    title: 'About VoiceFlow AI',
    badge: 'Our Mission',
    desc: 'We build autonomous, human-sounding AI voice employees that help Indian and global businesses close deals while they sleep.',
    content: `
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-sm text-slate-300 leading-relaxed">
        <p>VoiceFlow AI was founded to bridge the gap between high-volume customer inquiries and human sales capacity. By combining low-latency voice synthesis with multilingual conversational models, we enable businesses to speak to every lead in their native language within seconds of inquiry.</p>
        <p>Our platform enforces strict telecom compliance under TRAI DLT regulations in India and adheres to enterprise data isolation principles with dedicated Row Level Security.</p>
      </div>
    `
  },
  'contact': {
    title: 'Get in Touch',
    badge: 'We are here to help',
    desc: 'Have questions about enterprise deployment, custom language models, or high-volume calling? Talk to our team.',
    content: `
      <div className="max-w-lg mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 pt-6">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
          <input className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="Ramesh Varma" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
          <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="ramesh@company.com" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
          <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="Tell us about your team and calling volume..." />
        </div>
        <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all">Send Inquiry</button>
      </div>
    `
  },
  'privacy': {
    title: 'Privacy Policy',
    badge: 'Data Protection & Isolation',
    desc: 'How VoiceFlow AI handles, protects, and strictly isolates your organization and customer data.',
    content: `
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-xs text-slate-300 leading-relaxed">
        <p><strong>1. Strict Tenant Isolation:</strong> Every customer organization operates under its own isolated partition enforced via PostgreSQL Row Level Security (RLS). Cross-tenant queries are blocked at the database engine level.</p>
        <p><strong>2. Audio & Data Retention:</strong> Call recordings and transcript logs are encrypted at rest and stored in private cloud storage buckets. Customer data is never used to train global third-party AI models.</p>
        <p><strong>3. Compliance:</strong> We comply with all applicable telecommunications, TRAI DLT, and data privacy regulations.</p>
      </div>
    `
  },
  'terms': {
    title: 'Terms of Service',
    badge: 'Legal & Usage Agreement',
    desc: 'Terms governing the use of VoiceFlow AI platform, telephony carriage, and autonomous voice agents.',
    content: `
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-xs text-slate-300 leading-relaxed">
        <p><strong>1. Permitted Calling:</strong> Users may only call leads and customers who have given proper opt-in consent. Spam, harassment, and unauthorized robocalling are strictly prohibited.</p>
        <p><strong>2. Calling Hours:</strong> Outbound calling must strictly comply with authorized telemarketing windows (typically 09:00 AM to 07:00 PM local time).</p>
        <p><strong>3. AI Identity Disclosure:</strong> Every AI voice agent must state its artificial identity clearly during the call initiation.</p>
      </div>
    `
  },
  'docs': {
    title: 'Developer & Platform Documentation',
    badge: 'API & Integration Guide',
    desc: 'Everything you need to integrate VoiceFlow AI with your CRM, webhooks, and workflow automations.',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <h3 className="font-bold text-white text-sm">REST API Reference</h3>
          <p className="text-xs text-slate-400">Initiate calls programmatically, query call transcripts, fetch lead scores, and manage agent prompts via standard REST endpoints.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <h3 className="font-bold text-white text-sm">Webhook Events</h3>
          <p className="text-xs text-slate-400">Receive real-time HMAC-signed webhooks on call completion, appointment booking, or intent qualification.</p>
        </div>
      </div>
    `
  },
  'blog': {
    title: 'VoiceFlow AI Insights & Case Studies',
    badge: 'Industry Trends & Updates',
    desc: 'Read about the latest developments in conversational AI, Indian language voice synthesis, and sales automation.',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-indigo-400 font-semibold uppercase">Case Study</span>
          <h3 className="font-bold text-white text-base">How Acme Realty Scaled Weekend Site Visits by 340% Using Telugu AI Agents</h3>
          <p className="text-xs text-slate-400">Discover how autonomous outbound follow-up calls within 60 seconds of portal inquiries transformed conversion rates.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-indigo-400 font-semibold uppercase">Technical Guide</span>
          <h3 className="font-bold text-white text-base">Achieving Under-600ms Conversational Latency in Regional Indian Accents</h3>
          <p className="text-xs text-slate-400">An in-depth breakdown of our streaming pipeline connecting regional ASR with neural synthesis.</p>
        </div>
      </div>
    `
  }
};

for (const [slug, page] of Object.entries(marketingPages)) {
  const filePath = path.join(baseDir, slug, 'page.tsx');
  const code = `import React from "react"

export default function ${slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')}Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          ${page.badge}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">${page.title}</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">${page.desc}</p>
        ${page.content}
      </div>
    </div>
  )
}
`;
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Created marketing page:', filePath);
}
