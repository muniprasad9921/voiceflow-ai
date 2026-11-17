import React from "react"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, Building2, Users, CreditCard, Activity } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-md shadow-red-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">VoiceFlow AI — Platform Super Admin</div>
            <div className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Internal Master Control</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {children}
      </main>
    </div>
  )
}
