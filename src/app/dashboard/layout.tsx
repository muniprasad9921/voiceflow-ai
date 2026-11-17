"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Bot,
  Wand2,
  FlaskConical,
  Phone,
  Radio,
  Megaphone,
  Users,
  Target,
  Building2,
  History,
  BookOpen,
  Plug,
  Workflow,
  BarChart3,
  TrendingUp,
  Star,
  MessageSquare,
  Shield,
  Globe,
  Wallet,
  UsersRound,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react"

const NAV_GROUPS = [
  {
    title: "Core Platform",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "AI Employees", href: "/dashboard/ai-employees", icon: Bot },
      { name: "Agent Studio", href: "/dashboard/agent-studio", icon: Wand2 },
      { name: "Agent Playground", href: "/dashboard/agent-playground", icon: FlaskConical },
      { name: "Phone Numbers", href: "/dashboard/phone-numbers", icon: Phone },
      { name: "Live Calls", href: "/dashboard/live-calls", icon: Radio },
      { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
    ],
  },
  {
    title: "CRM & Customers",
    items: [
      { name: "Contacts", href: "/dashboard/contacts", icon: Users },
      { name: "Leads", href: "/dashboard/leads", icon: Target },
      { name: "CRM Pipeline", href: "/dashboard/crm", icon: Building2 },
      { name: "Call History", href: "/dashboard/call-history", icon: History },
      { name: "Knowledge Base", href: "/dashboard/knowledge-base", icon: BookOpen },
    ],
  },
  {
    title: "AI Intelligence",
    items: [
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Revenue Intelligence", href: "/dashboard/ai-revenue-intelligence", icon: TrendingUp },
      { name: "AI Lead Scoring", href: "/dashboard/ai-lead-scoring", icon: Star },
      { name: "Follow-up Copilot", href: "/dashboard/ai-followup-copilot", icon: MessageSquare },
      { name: "Agent Quality", href: "/dashboard/agent-quality", icon: Shield },
      { name: "Customer 360", href: "/dashboard/customer-360", icon: Globe },
    ],
  },
  {
    title: "Automations & Organization",
    items: [
      { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
      { name: "Automations", href: "/dashboard/automations", icon: Workflow },
      { name: "Wallet & Billing", href: "/dashboard/wallet", icon: Wallet },
      { name: "Team Management", href: "/dashboard/team", icon: UsersRound },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 min-h-screen">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-white text-base">VoiceFlow</span>
            <span className="text-[10px] font-semibold text-indigo-400 tracking-wider uppercase">Enterprise</span>
          </div>
        </div>

        {/* Org Selector Pill */}
        <div className="px-4 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-white truncate">Acme Realty</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-900/60 border border-indigo-700 text-indigo-300 flex items-center justify-center text-xs font-bold">
              AR
            </div>
            <div className="text-xs truncate">
              <div className="text-white font-medium">Acme Admin</div>
              <div className="text-[10px] text-slate-500">₹4,850.50 Credits</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ──────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">VoiceFlow AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm pt-14 overflow-y-auto p-4 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="text-[11px] font-bold uppercase text-slate-500 px-2">{group.title}</div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
          <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
            Sign Out
          </Button>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/40 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live AI Network Ready
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/agent-playground"
              className="text-xs bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-indigo-300 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Test Voice Playground
            </Link>
            <Link
              href="/dashboard/wallet"
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              Wallet: ₹4,850.50
            </Link>
          </div>
        </header>

        {/* Dashboard View Body */}
        <div className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
