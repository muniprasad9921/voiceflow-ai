import { Building2, Users, CreditCard, Activity, PhoneCall, AlertTriangle, LifeBuoy, Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminChatManager } from "@/components/admin/admin-chat-manager"

export default function SuperAdminPage() {
  const metrics = [
    { title: "Total Organizations", value: "128", change: "+14 this week", icon: Building2 },
    { title: "Active AI Voice Agents", value: "312", change: "99.4% uptime", icon: Activity },
    { title: "Platform Calls Today", value: "8,940", change: "₹13,410 telecom rev", icon: PhoneCall },
    { title: "Monthly Recurring Revenue", value: "₹6,39,872", change: "+22% MoM", icon: CreditCard },
  ]

  const tenants = [
    { id: "1", name: "Acme Realty & Automations", plan: "Growth (₹4,999)", agents: 2, callsToday: 142, spend: "₹4,850.50", status: "Active" },
    { id: "2", name: "Apollo Clinic Network", plan: "Enterprise", agents: 8, callsToday: "1,240", spend: "₹38,200.00", status: "Active" },
    { id: "3", name: "Prestige Motors Dealerships", plan: "Growth (₹4,999)", agents: 3, callsToday: 412, spend: "₹12,450.00", status: "Active" },
    { id: "4", name: "Star Insurance Advisory", plan: "Starter (₹1,999)", agents: 1, callsToday: 88, spend: "₹2,100.00", status: "Active" },
    { id: "5", name: "EduVantage Admissions", plan: "Growth (₹4,999)", agents: 4, callsToday: 620, spend: "₹18,900.00", status: "Active" },
  ]

  const systemHealth = [
    { service: "PostgreSQL Database (Supabase)", status: "Operational", ping: "24ms" },
    { service: "Vector Store (pgvector 1536-dim)", status: "Operational", ping: "38ms" },
    { service: "Telephony ASR / TTS Gateway", status: "Operational", ping: "85ms" },
    { service: "WhatsApp Cloud Webhook Handler", status: "Operational", ping: "42ms" },
    { service: "Razorpay Payment Webhooks", status: "Operational", ping: "31ms" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Super Admin Overview</h1>
        <p className="text-xs text-slate-400">Master tenant monitoring, global calling traffic, multi-organization billing, and infrastructure telemetry.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.title} className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.title}</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center">
                <m.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{m.value}</div>
              <div className="text-xs text-emerald-400 font-medium mt-1">{m.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm font-bold">Active Customer Organizations</CardTitle>
              <CardDescription className="text-xs text-slate-400">All registered enterprise tenants and their current platform usage.</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Agents</th>
                    <th className="py-3 px-4">Calls Today</th>
                    <th className="py-3 px-4">Wallet Spend</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{t.name}</td>
                      <td className="py-3 px-4 text-slate-300">{t.plan}</td>
                      <td className="py-3 px-4 font-mono">{t.agents}</td>
                      <td className="py-3 px-4 font-mono text-slate-200">{t.callsToday}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">{t.spend}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div>
          <Card className="bg-slate-900 border-slate-800 text-white p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Platform Service Health</span>
            </div>
            <div className="space-y-3">
              {systemHealth.map((sh) => (
                <div key={sh.service} className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-200">{sh.service}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Latency: {sh.ping}</div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    {sh.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Chat Support & Visitor Intelligence */}
      <AdminChatManager />
    </div>
  )
}
