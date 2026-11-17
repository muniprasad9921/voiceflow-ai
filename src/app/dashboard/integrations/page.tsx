"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations & Webhooks</h1>
          <p className="text-sm text-slate-400">Connect your favorite CRM, telephony gateway, calendar, and workflow automation apps.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          REST API & Webhooks
        </Badge>
      </div>

      
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
    
    </div>
  )
}
