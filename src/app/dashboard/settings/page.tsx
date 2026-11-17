"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
          <p className="text-sm text-slate-400">Configure tenant name, timezone, webhook secrets, DND filtering, and compliance parameters.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Organization: Acme Realty
        </Badge>
      </div>

      
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
    
    </div>
  )
}
