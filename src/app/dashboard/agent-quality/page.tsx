"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AgentQualityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agent Quality & Compliance</h1>
          <p className="text-sm text-slate-400">Audit AI conversations for TRAI DLT guidelines, polite etiquette, prompt compliance, and hallucination prevention.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          TRAI & DLT Compliant
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="text-sm font-bold text-white">Automated Quality Checks</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">100%</span> AI Identity Disclosed</div>
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">0%</span> Hallucinated Facts</div>
          <div className="p-3 bg-slate-800/40 rounded border border-slate-700/40"><span className="text-emerald-400 font-bold block">99.2%</span> Polite Sentiment Score</div>
        </div>
      </div>
    
    </div>
  )
}
