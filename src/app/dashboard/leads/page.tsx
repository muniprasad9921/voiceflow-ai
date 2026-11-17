"use client"

import { useState } from "react"
import { Target, Star, Filter, ArrowRight, PhoneCall, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const STAGES = ["New Inquiries", "Contacted", "AI Qualified", "Site Visit Booked"]

const LEADS = [
  { id: "1", name: "Ramesh Rao", phone: "+91 98765 43210", stage: "AI Qualified", score: 92, budget: "₹1.8 Cr", time: "2 hours ago" },
  { id: "2", name: "Suresh Kumar", phone: "+91 98123 45678", stage: "Contacted", score: 68, budget: "₹90 Lakhs", time: "4 hours ago" },
  { id: "3", name: "Ananya Sharma", phone: "+91 97654 32109", stage: "Site Visit Booked", score: 95, budget: "₹2.2 Cr", time: "Yesterday" },
  { id: "4", name: "Kavita Reddy", phone: "+91 95432 10987", stage: "New Inquiries", score: 55, budget: "₹1.4 Cr", time: "Just now" },
  { id: "5", name: "Deepak Patel", phone: "+91 91234 56780", stage: "AI Qualified", score: 88, budget: "₹1.5 Cr", time: "1 day ago" },
]

export default function LeadsPipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Lead Scoring & Pipeline</h1>
          <p className="text-sm text-slate-400">
            Real-time stage progression automated by AI conversation insights and intent scoring.
          </p>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageLeads = LEADS.filter(l => l.stage === stage)
          return (
            <div key={stage} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col h-[520px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-xs text-white">{stage}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-400">
                  {stageLeads.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5">
                {stageLeads.map((lead) => (
                  <Card key={lead.id} className="bg-slate-800/80 border-slate-700 text-white p-3 shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="font-semibold text-xs text-white">{lead.name}</div>
                      <Badge className={`text-[10px] ${
                        lead.score >= 85
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : lead.score >= 60
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-slate-700 text-slate-300 border-slate-600"
                      }`}>
                        <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                        {lead.score} pts
                      </Badge>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">{lead.phone}</div>

                    <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-700/60 text-slate-400">
                      <span>Budget: <strong className="text-slate-200">{lead.budget}</strong></span>
                      <span>{lead.time}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
