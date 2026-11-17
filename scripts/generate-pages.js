const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', 'dashboard');

const pages = {
  'phone-numbers': {
    title: 'Phone Numbers & SIP Trunks',
    desc: 'Manage virtual DID numbers, toll-free lines, caller ID, and telecom routing.',
    badge: 'TRAI Registered',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-base font-bold text-white">+91 40 4567 8900</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Assigned Agent: <strong className="text-white">Priya (Telugu + English)</strong></div>
          <div className="text-xs text-slate-400">Location: Hyderabad (Local DID) · ₹450 / month</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-base font-bold text-white">+91 80 9876 5432</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Assigned Agent: <strong className="text-white">Dr. Ravi (Hindi + English)</strong></div>
          <div className="text-xs text-slate-400">Location: Bangalore (Local DID) · ₹450 / month</div>
        </div>
      </div>
    `
  },
  'live-calls': {
    title: 'Live Calls Monitor',
    desc: 'Real-time telemetry of concurrent outbound calls, audio streams, and sentiment.',
    badge: 'Real-time WebSocket Ready',
    content: `
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping mx-auto" />
        <div className="text-base font-bold text-white">Telephony Gateway Idle</div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">No live calls in progress right now. Outbound calls initiate automatically when campaigns are launched.</p>
      </div>
    `
  },
  'crm': {
    title: 'CRM Deals & Pipeline',
    desc: 'Comprehensive customer relationship management tracking deal stages from first AI call to closed revenue.',
    badge: 'Revenue Pipeline: ₹12.4 Cr',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Discovery / Cold</div>
          <div className="text-2xl font-bold text-white mt-1">₹4.2 Cr</div>
          <div className="text-xs text-slate-500 mt-1">42 open prospects</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Site Visits Booked</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">₹5.8 Cr</div>
          <div className="text-xs text-slate-500 mt-1">28 qualified buyers</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Negotiation / Token</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹2.4 Cr</div>
          <div className="text-xs text-slate-500 mt-1">12 closed / ready deals</div>
        </div>
      </div>
    `
  },
  'knowledge-base': {
    title: 'Knowledge Base & RAG Vector Store',
    desc: 'Upload business brochures, price lists, and PDFs. Vector embeddings empower the AI agent with ground truth.',
    badge: 'pgvector Enabled',
    content: `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Cyber Hills Luxury Villas Brochure.pdf</div>
          <div className="text-xs text-slate-400">142 vector chunks indexed · 1536-dim embeddings</div>
          <div className="text-xs text-emerald-400 font-medium">Ready for real-time RAG</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Property Pricing & Payment Milestones.xlsx</div>
          <div className="text-xs text-slate-400">58 vector chunks indexed · 1536-dim embeddings</div>
          <div className="text-xs text-emerald-400 font-medium">Ready for real-time RAG</div>
        </div>
      </div>
    `
  },
  'analytics': {
    title: 'Analytics & Reporting',
    desc: 'Deep analytics across answer rates, campaign conversion funnels, calling duration, and agent performance.',
    badge: '98.4% Telephony Uptime',
    content: `
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Avg Call Duration</div>
          <div className="text-xl font-bold text-white mt-1">2m 14s</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Pickup Rate</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">68.4%</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Qualification %</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">21.5%</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Avg Cost / Lead</div>
          <div className="text-xl font-bold text-white mt-1">₹47.20</div>
        </div>
      </div>
    `
  },
  'ai-revenue-intelligence': {
    title: 'AI Revenue Intelligence',
    desc: 'Predictive revenue forecasting, deal velocity scoring, and automated pipeline risk detection.',
    badge: 'Machine Learning Forecasting',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="font-bold text-white text-sm">Key Insights This Week</div>
        <ul className="space-y-2 text-xs text-slate-300">
          <li>• Leads called between 11:00 AM and 01:00 PM convert 34% higher than evening calls.</li>
          <li>• Customers mentioning "clubhouse" have a 92% site visit confirmation rate.</li>
          <li>• Estimated pipeline value this month: ₹1.8 Cr based on current qualification trajectory.</li>
        </ul>
      </div>
    `
  },
  'ai-lead-scoring': {
    title: 'AI Lead Scoring Engine',
    desc: 'Autonomous lead scoring using sentiment analysis, budget signals, and urgency indicators.',
    badge: 'Intent Model v2.4',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="text-sm font-bold text-white">Scoring Weights Matrix</div>
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Budget Match (&gt;₹1.5 Cr)</span><strong className="text-emerald-400">+40 pts</strong></div>
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Weekend Site Visit Confirmed</span><strong className="text-emerald-400">+35 pts</strong></div>
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Positive Sentiment in Telugu/English</span><strong className="text-indigo-400">+15 pts</strong></div>
          <div className="flex justify-between py-1"><span>Objections Resolved Successfully</span><strong className="text-indigo-400">+10 pts</strong></div>
        </div>
      </div>
    `
  },
  'ai-followup-copilot': {
    title: 'AI Follow-up Copilot',
    desc: 'Automate WhatsApp messages, SMS summaries, and calendar invites immediately following each call.',
    badge: 'WhatsApp Business API Ready',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="text-sm font-bold text-white">Automated WhatsApp Follow-up Rules</div>
        <div className="p-3 bg-slate-800/60 rounded border border-slate-700/60 text-xs text-slate-300">
          <strong>Trigger:</strong> Site Visit Booked → <strong>Action:</strong> Send Google Maps pin, brochure PDF, and calendar invite to customer WhatsApp in Telugu/English within 30 seconds.
        </div>
      </div>
    `
  },
  'agent-quality': {
    title: 'Agent Quality & Compliance',
    desc: 'Audit AI conversations for TRAI DLT guidelines, polite etiquette, prompt compliance, and hallucination prevention.',
    badge: 'TRAI & DLT Compliant',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="text-sm font-bold text-white">Automated Quality Checks</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">100%</span> AI Identity Disclosed</div>
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">0%</span> Hallucinated Facts</div>
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">99.2%</span> Polite Sentiment Score</div>
        </div>
      </div>
    `
  },
  'customer-360': {
    title: 'Customer 360 View',
    desc: 'Omnichannel customer timeline combining phone calls, WhatsApp messages, CRM notes, and appointments.',
    badge: 'Unified Contact Profile',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
        Unified customer timeline is populated automatically as calls, appointments, and WhatsApp interactions occur.
      </div>
    `
  },
  'integrations': {
    title: 'Integrations & Webhooks',
    desc: 'Connect your favorite CRM, telephony gateway, calendar, and workflow automation apps.',
    badge: 'REST API & Webhooks',
    content: `
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white">Retell AI Telephony</div>
          <div className="text-slate-400">Indian language voice streaming</div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold inline-block">Connected</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white">WhatsApp Cloud API</div>
          <div className="text-slate-400">Instant customer messaging</div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold inline-block">Configurable</span>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white">Google Calendar</div>
          <div className="text-slate-400">Site visit appointments</div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold inline-block">Connected</span>
        </div>
      </div>
    `
  },
  'automations': {
    title: 'Automations & Workflow Builder',
    desc: 'Trigger actions on lead qualification, call completion, missed appointments, or negative sentiment.',
    badge: 'Event Driven Engine',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-2">
        <div className="font-bold text-white text-sm">Active Trigger Rules</div>
        <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40 text-slate-300">
          WHEN Call Ended with status "Qualified" → THEN Create CRM Lead + Schedule Google Calendar Event + Trigger WhatsApp Confirmation.
        </div>
      </div>
    `
  },
  'team': {
    title: 'Team Management & Permissions',
    desc: 'Invite sales managers, call center supervisors, and agents with granular role-based access control.',
    badge: 'Enterprise RBAC',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <div><strong className="text-white">Admin User</strong> <span className="text-slate-500">(admin@acmerealty.com)</span></div>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold">Owner</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <div><strong className="text-white">Sales Supervisor</strong> <span className="text-slate-500">(sales@acmerealty.com)</span></div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">Manager</span>
        </div>
      </div>
    `
  },
  'notifications': {
    title: 'Notifications & Alerts',
    desc: 'Real-time alerts for hot qualified leads, low wallet balance, and completed campaigns.',
    badge: '3 New Alerts',
    content: `
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
          <span className="text-slate-200">Hot Lead: Ramesh Rao booked site visit for Cyber Hills Luxury Villas</span>
          <span className="text-slate-500">10 mins ago</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
          <span className="text-slate-200">Campaign "Cyber Hills Launch" completed 45 calls</span>
          <span className="text-slate-500">1 hour ago</span>
        </div>
      </div>
    `
  },
  'settings': {
    title: 'Organization Settings',
    desc: 'Configure tenant name, timezone, webhook secrets, DND filtering, and compliance parameters.',
    badge: 'Organization: Acme Realty',
    content: `
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4 max-w-lg text-xs">
        <div>
          <label className="text-slate-300 font-semibold block mb-1">Timezone</label>
          <input disabled value="Asia/Kolkata (IST)" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
        </div>
        <div>
          <label className="text-slate-300 font-semibold block mb-1">TRAI Calling Hours Window</label>
          <input disabled value="09:00 AM - 07:00 PM IST (Strict Compliance)" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white" />
        </div>
      </div>
    `
  },
  'help': {
    title: 'Help & Knowledge Center',
    desc: 'Documentation, API guides, TRAI compliance handbook, and customer support.',
    badge: '24/7 Enterprise Support',
    content: `
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Getting Started Guide</div>
          <p className="text-slate-400">Step-by-step instructions on training AI voice employees in Telugu, Hindi & English.</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">TRAI DLT & Telecom Regulations</div>
          <p className="text-slate-400">Complete guide to automated voice calling compliance and opt-out workflows in India.</p>
        </div>
      </div>
    `
  }
};

for (const [slug, data] of Object.entries(pages)) {
  const filePath = path.join(baseDir, slug, 'page.tsx');
  const code = `"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function ${slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">${data.title}</h1>
          <p className="text-sm text-slate-400">${data.desc}</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          ${data.badge}
        </Badge>
      </div>

      ${data.content}
    </div>
  )
}
`;

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Created:', filePath);
}
