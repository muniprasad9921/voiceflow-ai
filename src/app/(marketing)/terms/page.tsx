import React from "react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Legal & Usage Agreement
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Terms of Service</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Terms governing the use of VoiceFlow AI platform, telephony carriage, and autonomous voice agents.</p>
        
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-xs text-slate-300 leading-relaxed">
        <p><strong>1. Permitted Calling:</strong> Users may only call leads and customers who have given proper opt-in consent. Spam, harassment, and unauthorized robocalling are strictly prohibited.</p>
        <p><strong>2. Calling Hours:</strong> Outbound calling must strictly comply with authorized telemarketing windows (typically 09:00 AM to 07:00 PM local time).</p>
        <p><strong>3. AI Identity Disclosure:</strong> Every AI voice agent must state its artificial identity clearly during the call initiation.</p>
      </div>
    
      </div>
    </div>
  )
}
