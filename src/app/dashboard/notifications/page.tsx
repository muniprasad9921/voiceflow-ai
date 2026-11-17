"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications & Alerts</h1>
          <p className="text-sm text-slate-400">Real-time alerts for hot qualified leads, low wallet balance, and completed campaigns.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          3 New Alerts
        </Badge>
      </div>

      
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
          <span className="text-slate-200">Hot Lead: Ramesh Rao booked site visit for Cyber Hills Luxury Villas</span>
          <span className="text-slate-500">10 mins ago</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
          <span className="text-slate-200">Campaign "Cyber Hills Launch" completed 45 calls</span>
          <span className="text-slate-500">1 hour ago</span>
        </div>
      </div>
    
    </div>
  )
}
