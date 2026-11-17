"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Help & Knowledge Center</h1>
          <p className="text-sm text-slate-400">Documentation, API guides, TRAI compliance handbook, and customer support.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          24/7 Enterprise Support
        </Badge>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Getting Started Guide</div>
          <p className="text-slate-400">Step-by-step instructions on training AI voice employees in Telugu, Hindi & English.</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">TRAI DLT & Telecom Regulations</div>
          <p className="text-slate-400">Complete guide to automated voice calling compliance and opt-out workflows in India.</p>
        </div>
      </div>
    
    </div>
  )
}
