import React from "react"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Industry Trends & Updates
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">VoiceFlow AI Insights & Case Studies</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Read about the latest developments in conversational AI, Indian language voice synthesis, and sales automation.</p>
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-indigo-400 font-semibold uppercase">Case Study</span>
          <h3 className="font-bold text-white text-base">How Acme Realty Scaled Weekend Site Visits by 340% Using Telugu AI Agents</h3>
          <p className="text-xs text-slate-400">Discover how autonomous outbound follow-up calls within 60 seconds of portal inquiries transformed conversion rates.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] text-indigo-400 font-semibold uppercase">Technical Guide</span>
          <h3 className="font-bold text-white text-base">Achieving Under-600ms Conversational Latency in Regional Indian Accents</h3>
          <p className="text-xs text-slate-400">An in-depth breakdown of our streaming pipeline connecting regional ASR with neural synthesis.</p>
        </div>
      </div>
    
      </div>
    </div>
  )
}
