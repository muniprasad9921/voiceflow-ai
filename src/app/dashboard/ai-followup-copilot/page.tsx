"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AiFollowupCopilotPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Follow-up Copilot</h1>
          <p className="text-sm text-slate-400">Automate WhatsApp messages, SMS summaries, and calendar invites immediately following each call.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          WhatsApp Business API Ready
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="text-sm font-bold text-white">Automated WhatsApp Follow-up Rules</div>
        <div className="p-3 bg-slate-800/60 rounded border border-slate-700/60 text-xs text-slate-300">
          <strong>Trigger:</strong> Site Visit Booked → <strong>Action:</strong> Send Google Maps pin, brochure PDF, and calendar invite to customer WhatsApp in Telugu/English within 30 seconds.
        </div>
      </div>
    
    </div>
  )
}
