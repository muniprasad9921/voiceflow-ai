"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function AiRevenueIntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Revenue Intelligence</h1>
          <p className="text-sm text-slate-400">Predictive revenue forecasting, deal velocity scoring, and automated pipeline risk detection.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          Machine Learning Forecasting
        </Badge>
      </div>

      
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="font-bold text-white text-sm">Key Insights This Week</div>
        <ul className="space-y-2 text-xs text-slate-300">
          <li>• Leads called between 11:00 AM and 01:00 PM convert 34% higher than evening calls.</li>
          <li>• Customers mentioning "clubhouse" have a 92% site visit confirmation rate.</li>
          <li>• Estimated pipeline value this month: ₹1.8 Cr based on current qualification trajectory.</li>
        </ul>
      </div>
    
    </div>
  )
}
