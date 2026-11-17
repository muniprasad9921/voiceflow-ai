import Link from "next/link"
import {
  PhoneCall,
  Users,
  Target,
  Clock,
  ArrowUpRight,
  Bot,
  Play,
  Calendar,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardOverviewPage() {
  const stats = [
    { title: "Total AI Calls", value: "2,847", change: "+18.2%", icon: PhoneCall, subtitle: "This month" },
    { title: "Qualified Leads", value: "612", change: "+24.5%", icon: Target, subtitle: "Conversion: 21.5%" },
    { title: "Appointments Booked", value: "184", change: "+12.0%", icon: Calendar, subtitle: "Site visits & calls" },
    { title: "Calling Expenses", value: "₹4,270.50", change: "-8.4%", icon: TrendingUp, subtitle: "Avg ₹1.50/min" },
  ]

  const recentCalls = [
    { id: "1", name: "Ramesh Rao", phone: "+91 98765 43210", agent: "Priya (Telugu)", duration: "2m 22s", status: "Qualified", score: 92, time: "10 mins ago" },
    { id: "2", name: "Suresh Kumar", phone: "+91 98123 45678", agent: "Priya (Telugu)", duration: "1m 45s", status: "Follow-up", score: 68, time: "35 mins ago" },
    { id: "3", name: "Ananya Sharma", phone: "+91 97654 32109", agent: "Dr. Ravi (Hindi)", duration: "3m 10s", status: "Booked", score: 95, time: "1 hour ago" },
    { id: "4", name: "Vikram Malhotra", phone: "+91 99887 76655", agent: "Priya (Telugu)", duration: "45s", status: "Not Interested", score: 25, time: "2 hours ago" },
    { id: "5", name: "Deepak Patel", phone: "+91 91234 56780", agent: "Priya (Telugu)", duration: "2m 04s", status: "Qualified", score: 88, time: "3 hours ago" },
  ]

  const activeAgents = [
    { name: "Priya", role: "Real Estate Sales Representative", langs: "Telugu · English", status: "Active", callsToday: 84, successRate: "76%" },
    { name: "Dr. Ravi", role: "Healthcare & Clinic Scheduler", langs: "Hindi · English", status: "Active", callsToday: 42, successRate: "88%" },
  ]

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 p-6 rounded-2xl border border-indigo-800/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, Acme Realty</h1>
            <Badge className="bg-indigo-600/30 text-indigo-300 border-indigo-500/30 text-xs">
              Autonomous B2B AI Voice
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            Your 2 AI voice employees are active and dialing leads in Telugu, Hindi & English.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/campaigns"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Campaign
          </Link>
          <Link
            href="/dashboard/agent-studio"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            Create AI Agent
          </Link>
        </div>
      </div>

      {/* ── Metric Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <Card key={item.title} className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-emerald-400 font-semibold">{item.change}</span>
                <span className="text-xs text-slate-500">{item.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Active Campaigns & Agents ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent AI Calls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent AI Call Activity</h2>
            <Link href="/dashboard/call-history" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              View All Calls <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
            <div className="divide-y divide-slate-800 text-xs">
              {recentCalls.map((call) => (
                <div key={call.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs">
                      {call.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{call.name}</div>
                      <div className="text-slate-400 text-xs">{call.phone} · {call.agent}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-slate-300 font-medium">{call.duration}</div>
                      <div className="text-[11px] text-slate-500">{call.time}</div>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        call.status === "Qualified" || call.status === "Booked"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : call.status === "Follow-up"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {call.status} ({call.score} pts)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Active AI Employees */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your AI Employees</h2>
            <Link href="/dashboard/ai-employees" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {activeAgents.map((ag) => (
              <Card key={ag.name} className="bg-slate-900 border-slate-800 text-white p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white">
                      {ag.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{ag.name}</div>
                      <div className="text-xs text-slate-400">{ag.role}</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    {ag.status}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Languages: <strong className="text-slate-300 font-medium">{ag.langs}</strong></span>
                  <span>Dialed: <strong className="text-white font-semibold">{ag.callsToday} calls</strong></span>
                </div>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/30 text-white p-4 text-center">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="font-bold text-sm mb-1">Hire a New AI Voice Agent</div>
              <p className="text-xs text-slate-400 mb-3">
                Train an agent with custom qualification scripts and CRM actions in 3 minutes.
              </p>
              <Link
                href="/dashboard/ai-employees"
                className="inline-block w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                + Add Agent
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
