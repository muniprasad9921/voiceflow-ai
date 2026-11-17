"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Automations & Workflow Builder</h1>
          <p className="text-sm text-slate-400">Trigger actions on lead qualification, call completion, missed appointments, or negative sentiment.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Event Driven Engine
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-2">
        <div className="font-bold text-white text-sm">Active Trigger Rules</div>
        <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40 text-slate-300">
          WHEN Call Ended with status "Qualified" → THEN Create CRM Lead + Schedule Google Calendar Event + Trigger WhatsApp Confirmation.
        </div>
      </div>
    
    </div>
  )
}
