"use client"

import { useState } from "react"
import { Megaphone, Play, Pause, Plus, Users, PhoneCall, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const INITIAL_CAMPAIGNS = [
  {
    id: "1",
    name: "Cyber Hills Luxury Villas Launch",
    agent: "Priya (Telugu + English)",
    status: "Running",
    progress: 45,
    totalLeads: 100,
    completedCalls: 45,
    qualifiedLeads: 38,
    callingHours: "09:30 AM - 06:30 PM IST",
    spend: "₹1,120.00",
  },
  {
    id: "2",
    name: "Apollo Clinic Health Checkup Follow-up",
    agent: "Dr. Ravi (Hindi + English)",
    status: "Completed",
    progress: 100,
    totalLeads: 250,
    completedCalls: 250,
    qualifiedLeads: 184,
    callingHours: "10:00 AM - 05:00 PM IST",
    spend: "₹3,450.00",
  },
  {
    id: "3",
    name: "Prestige Motors Weekend Test Drive Inquiries",
    agent: "Priya (Telugu + English)",
    status: "Draft",
    progress: 0,
    totalLeads: 75,
    completedCalls: 0,
    qualifiedLeads: 0,
    callingHours: "10:00 AM - 07:00 PM IST",
    spend: "₹0.00",
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS)

  const toggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === "Running" ? "Paused" : "Running" }
      }
      return c
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bulk Calling Campaigns</h1>
          <p className="text-sm text-slate-400">
            Schedule and automate outbound AI calling campaigns across thousands of verified leads.
          </p>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Campaign
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns.map((camp) => (
          <Card key={camp.id} className="bg-slate-900 border-slate-800 text-white p-5 hover:border-slate-700 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{camp.name}</h3>
                  <Badge className={`text-[10px] ${
                    camp.status === "Running"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : camp.status === "Completed"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {camp.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Assigned Agent: <strong className="text-slate-300">{camp.agent}</strong></span>
                  <span>Calling Hours: <strong className="text-slate-300">{camp.callingHours}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Qualified Leads</div>
                  <div className="text-lg font-bold text-emerald-400">{camp.qualifiedLeads}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Spend</div>
                  <div className="text-lg font-bold text-white">{camp.spend}</div>
                </div>

                {camp.status !== "Completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCampaign(camp.id)}
                    className="border-slate-700 text-slate-200 text-xs"
                  >
                    {camp.status === "Running" ? (
                      <><Pause className="w-3.5 h-3.5 mr-1 text-amber-400" /> Pause</>
                    ) : (
                      <><Play className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Start</>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Progress: {camp.completedCalls} / {camp.totalLeads} calls completed</span>
                <span>{camp.progress}%</span>
              </div>
              <Progress value={camp.progress} className="h-1.5 bg-slate-800" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
