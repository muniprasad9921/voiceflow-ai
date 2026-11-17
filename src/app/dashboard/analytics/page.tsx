"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Reporting</h1>
          <p className="text-sm text-slate-400">Deep analytics across answer rates, campaign conversion funnels, calling duration, and agent performance.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          98.4% Telephony Uptime
        </Badge>
      </div>

      
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
    
    </div>
  )
}
