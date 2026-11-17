import React from "react"
import Link from "next/link"
import { Bot } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Brand Logo */}
      <div className="mb-8 z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xl font-bold text-white tracking-tight">VoiceFlow</span>
            <span className="text-[10px] font-semibold text-indigo-400 tracking-widest uppercase">AI Voice Platform</span>
          </div>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center text-xs text-slate-500 z-10">
        Protected by Supabase Auth with Row Level Security & TRAI DLT Compliance.
      </div>
    </div>
  )
}
