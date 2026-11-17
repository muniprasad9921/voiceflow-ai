import React from "react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          API & Integration Guide
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Developer & Platform Documentation</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Everything you need to integrate VoiceFlow AI with your CRM, webhooks, and workflow automations.</p>
        
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
    
      </div>
    </div>
  )
}
