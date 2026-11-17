import React from "react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Autonomous B2B Calling
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Enterprise AI Voice Agent Features</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Explore the full spectrum of capabilities that make VoiceFlow AI the leading conversational AI platform.</p>
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">01</div>
          <h3 className="text-lg font-bold text-white mb-2">Multilingual Indian Voice</h3>
          <p className="text-sm text-slate-400">Natural fluency in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English with authentic accents.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">02</div>
          <h3 className="text-lg font-bold text-white mb-2">Sub-second Latency</h3>
          <p className="text-sm text-slate-400">Under 600ms conversational turn-around using streaming ASR, neural synthesis, and edge inference.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">03</div>
          <h3 className="text-lg font-bold text-white mb-2">Automated CRM & Calendars</h3>
          <p className="text-sm text-slate-400">Instant qualification, lead scoring, WhatsApp follow-ups, and calendar appointment scheduling.</p>
        </div>
      </div>
    
      </div>
    </div>
  )
}
