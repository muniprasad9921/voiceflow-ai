"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Plus, Play, Pause, Edit3, Trash2, Globe2, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const INITIAL_AGENTS = [
  {
    id: "1",
    name: "Priya - Luxury Real Estate",
    role: "Senior Sales Representative",
    languages: ["Telugu", "Indian English"],
    status: "Active",
    opening: "Namaskaram! I am Priya calling from Acme Realty. Am I speaking with the property buyer today?",
    callsTotal: 842,
    qualRate: "78%",
    industry: "Real Estate",
  },
  {
    id: "2",
    name: "Dr. Ravi - Clinic Scheduler",
    role: "Patient Intake & Appointments",
    languages: ["Hindi", "Indian English"],
    status: "Active",
    opening: "Namaste! Main Apollo Healthcare clinic se bol raha hoon. Kya main aapka doctor appointment schedule kar sakta hoon?",
    callsTotal: 418,
    qualRate: "89%",
    industry: "Healthcare",
  },
  {
    id: "3",
    name: "Vikram - Auto Dealership Concierge",
    role: "Test Drive & Service Booking",
    languages: ["English", "Hindi"],
    status: "Draft",
    opening: "Hello! Calling from Prestige Motors to confirm your weekend test drive request.",
    callsTotal: 0,
    qualRate: "N/A",
    industry: "Automobile",
  },
]

export default function AiEmployeesPage() {
  const [agents, setAgents] = useState(INITIAL_AGENTS)

  const toggleStatus = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === "Active" ? "Paused" : "Active" }
      }
      return a
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Voice Employees</h1>
          <p className="text-sm text-slate-400">
            Create, configure, and monitor your autonomous calling workforce across Indian languages.
          </p>
        </div>

        <Link
          href="/dashboard/agent-playground"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New AI Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between hover:border-slate-700 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-white">{agent.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-400">{agent.role}</CardDescription>
                  </div>
                </div>

                <Badge className={`text-xs ${
                  agent.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : agent.status === "Draft"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Greeting Script</div>
                <p className="italic text-slate-300 line-clamp-2">&quot;{agent.opening}&quot;</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500">Languages:</span>
                {agent.languages.map(l => (
                  <span key={l} className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-[11px] font-medium">
                    {l}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-400">
                <div>
                  <div className="text-[10px] text-slate-500">Total Calls</div>
                  <div className="text-sm font-bold text-white">{agent.callsTotal}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Qualification Rate</div>
                  <div className="text-sm font-bold text-emerald-400">{agent.qualRate}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleStatus(agent.id)}
                className="text-xs text-slate-300 hover:text-white"
              >
                {agent.status === "Active" ? (
                  <><Pause className="w-3.5 h-3.5 mr-1 text-amber-400" /> Pause</>
                ) : (
                  <><Play className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Activate</>
                )}
              </Button>

              <Link
                href="/dashboard/agent-playground"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded"
              >
                Simulate Voice →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
