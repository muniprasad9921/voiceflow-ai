import React from "react"

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          Tailored Workflows
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Industry-Specific AI Voice Solutions</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Pre-configured voice agents with industry-specific vocabulary, objection matrices, and compliance guardrails.</p>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Real Estate</h3>
          <p className="text-xs text-slate-400">Qualify prospective property buyers, verify budget ranges, and schedule weekend site visits with Google Maps dispatch.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Healthcare & Clinics</h3>
          <p className="text-xs text-slate-400">Handle patient appointment bookings, collect initial symptoms, send reminders, and reduce no-show rates.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-2">Automobile Dealerships</h3>
          <p className="text-xs text-slate-400">Call web test drive inquiries, verify driver preferences, schedule dealership showroom visits, and follow up.</p>
        </div>
      </div>
    
      </div>
    </div>
  )
}
