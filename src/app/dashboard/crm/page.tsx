"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRM Deals & Pipeline</h1>
          <p className="text-sm text-slate-400">Comprehensive customer relationship management tracking deal stages from first AI call to closed revenue.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Revenue Pipeline: ₹12.4 Cr
        </Badge>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Discovery / Cold</div>
          <div className="text-2xl font-bold text-white mt-1">₹4.2 Cr</div>
          <div className="text-xs text-slate-500 mt-1">42 open prospects</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Site Visits Booked</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">₹5.8 Cr</div>
          <div className="text-xs text-slate-500 mt-1">28 qualified buyers</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400 uppercase font-semibold">Negotiation / Token</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹2.4 Cr</div>
          <div className="text-xs text-slate-500 mt-1">12 closed / ready deals</div>
        </div>
      </div>
    
    </div>
  )
}
