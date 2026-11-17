import React from "react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Data Protection & Isolation
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">How VoiceFlow AI handles, protects, and strictly isolates your organization and customer data.</p>
        
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-xs text-slate-300 leading-relaxed">
        <p><strong>1. Strict Tenant Isolation:</strong> Every customer organization operates under its own isolated partition enforced via PostgreSQL Row Level Security (RLS). Cross-tenant queries are blocked at the database engine level.</p>
        <p><strong>2. Audio & Data Retention:</strong> Call recordings and transcript logs are encrypted at rest and stored in private cloud storage buckets. Customer data is never used to train global third-party AI models.</p>
        <p><strong>3. Compliance:</strong> We comply with all applicable telecommunications, TRAI DLT, and data privacy regulations.</p>
      </div>
    
      </div>
    </div>
  )
}
