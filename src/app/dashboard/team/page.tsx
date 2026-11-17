"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & Permissions</h1>
          <p className="text-sm text-slate-400">Invite sales managers, call center supervisors, and agents with granular role-based access control.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Enterprise RBAC
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-slate-800">
          <div><strong className="text-white">Admin User</strong> <span className="text-slate-500">(admin@acmerealty.com)</span></div>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold">Owner</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <div><strong className="text-white">Sales Supervisor</strong> <span className="text-slate-500">(sales@acmerealty.com)</span></div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">Manager</span>
        </div>
      </div>
    
    </div>
  )
}
