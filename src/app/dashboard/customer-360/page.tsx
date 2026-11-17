"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function Customer360Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer 360 View</h1>
          <p className="text-sm text-slate-400">Omnichannel customer timeline combining phone calls, WhatsApp messages, CRM notes, and appointments.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Unified Contact Profile
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
        Unified customer timeline is populated automatically as calls, appointments, and WhatsApp interactions occur.
      </div>
    
    </div>
  )
}
