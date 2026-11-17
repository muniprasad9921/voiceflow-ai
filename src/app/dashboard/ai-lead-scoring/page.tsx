"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AiLeadScoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Lead Scoring Engine</h1>
          <p className="text-sm text-slate-400">Autonomous lead scoring using sentiment analysis, budget signals, and urgency indicators.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Intent Model v2.4
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="text-sm font-bold text-white">Scoring Weights Matrix</div>
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Budget Match (&gt;₹1.5 Cr)</span><strong className="text-emerald-400">+40 pts</strong></div>
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Weekend Site Visit Confirmed</span><strong className="text-emerald-400">+35 pts</strong></div>
          <div className="flex justify-between py-1 border-b border-slate-800"><span>Positive Sentiment in Telugu/English</span><strong className="text-indigo-400">+15 pts</strong></div>
          <div className="flex justify-between py-1"><span>Objections Resolved Successfully</span><strong className="text-indigo-400">+10 pts</strong></div>
        </div>
      </div>
    
    </div>
  )
}
