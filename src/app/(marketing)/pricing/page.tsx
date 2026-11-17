import React from "react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          No Contracts · Pay As You Go
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Start with our generous free tier, then scale seamlessly with predictable pay-as-you-go calling rates.</p>
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-5xl mx-auto">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Starter Free</div>
          <div className="text-4xl font-extrabold text-white mb-2">₹0</div>
          <p className="text-xs text-slate-400 mb-6">Explore Voice Playground & create up to 2 AI employees.</p>
          <a href="/signup" className="block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">Start Free</a>
        </div>
        <div className="p-8 bg-gradient-to-b from-indigo-950 to-slate-900 border-2 border-indigo-500 rounded-2xl relative shadow-2xl shadow-indigo-500/20">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Growth Plan</div>
          <div className="text-4xl font-extrabold text-white mb-2">₹4,999 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
          <p className="text-xs text-slate-300 mb-6">Unlimited AI voice agents, bulk campaigns, CRM pipelines, and priority support.</p>
          <a href="/signup" className="block text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all">Get Started</a>
        </div>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Enterprise</div>
          <div className="text-4xl font-extrabold text-white mb-2">Custom</div>
          <p className="text-xs text-slate-400 mb-6">Dedicated SIP trunks, custom LLM fine-tuning, and on-premise SLA.</p>
          <a href="/contact" className="block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors">Contact Sales</a>
        </div>
      </div>
    
      </div>
    </div>
  )
}
