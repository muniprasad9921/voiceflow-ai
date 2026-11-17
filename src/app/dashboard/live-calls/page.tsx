"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function LiveCallsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Live Calls Monitor</h1>
          <p className="text-sm text-slate-400">Real-time telemetry of concurrent outbound calls, audio streams, and sentiment.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Real-time WebSocket Ready
        </Badge>
      </div>

      
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping mx-auto" />
        <div className="text-base font-bold text-white">Telephony Gateway Idle</div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">No live calls in progress right now. Outbound calls initiate automatically when campaigns are launched.</p>
      </div>
    
    </div>
  )
}
