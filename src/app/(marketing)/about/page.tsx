import React from "react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">About VoiceFlow AI</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">We build autonomous, human-sounding AI voice employees that help Indian and global businesses close deals while they sleep.</p>
        
      <div className="max-w-3xl mx-auto space-y-4 pt-6 text-sm text-slate-300 leading-relaxed">
        <p>VoiceFlow AI was founded to bridge the gap between high-volume customer inquiries and human sales capacity. By combining low-latency voice synthesis with multilingual conversational models, we enable businesses to speak to every lead in their native language within seconds of inquiry.</p>
        <p>Our platform enforces strict telecom compliance under TRAI DLT regulations in India and adheres to enterprise data isolation principles with dedicated Row Level Security.</p>
      </div>
    
      </div>
    </div>
  )
}
