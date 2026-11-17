import React from "react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          We are here to help
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Get in Touch</h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">Have questions about enterprise deployment, custom language models, or high-volume calling? Talk to our team.</p>
        
      <div className="max-w-lg mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 pt-6">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
          <input className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="Ramesh Varma" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
          <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="ramesh@company.com" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
          <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white" placeholder="Tell us about your team and calling volume..." />
        </div>
        <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all">Send Inquiry</button>
      </div>
    
      </div>
    </div>
  )
}
