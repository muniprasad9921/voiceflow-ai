"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function PhoneNumbersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Phone Numbers & SIP Trunks</h1>
          <p className="text-sm text-slate-400">Manage virtual DID numbers, toll-free lines, caller ID, and telecom routing.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          TRAI Registered
        </Badge>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-base font-bold text-white">+91 40 4567 8900</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Assigned Agent: <strong className="text-white">Priya (Telugu + English)</strong></div>
          <div className="text-xs text-slate-400">Location: Hyderabad (Local DID) · ₹450 / month</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-base font-bold text-white">+91 80 9876 5432</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Assigned Agent: <strong className="text-white">Dr. Ravi (Hindi + English)</strong></div>
          <div className="text-xs text-slate-400">Location: Bangalore (Local DID) · ₹450 / month</div>
        </div>
      </div>
    
    </div>
  )
}
