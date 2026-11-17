"use client"

import { useState } from "react"
import { Wand2, Bot, Sparkles, Volume2, Save, Play, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AgentStudioPage() {
  const [prompt, setPrompt] = useState(
    "You are Priya, a polite real estate sales agent calling from Acme Realty. Speak in natural Telugu and Indian English. Your objective is to introduce Cyber Hills villas, ask for budget range, and book a Saturday site visit."
  )
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Agent Studio</h1>
          <p className="text-sm text-slate-400">
            Craft custom voice personas, conversation guardrails, qualification checklists, and multilingual prompts.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
            <Save className="w-3.5 h-3.5 mr-1.5" /> {saved ? "Changes Saved!" : "Save Agent Configuration"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-white p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">System Instructions & Persona</label>
              <Textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs text-white leading-relaxed"
              />
              <span className="text-[10px] text-slate-500">Supports prompt injection guardrails & TRAI compliance disclaimers.</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Language</label>
                <select className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2.5">
                  <option>Telugu (te-IN)</option>
                  <option>Hindi (hi-IN)</option>
                  <option>Tamil (ta-IN)</option>
                  <option>Kannada (kn-IN)</option>
                  <option>Indian English (en-IN)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Voice Provider Model</label>
                <select className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2.5">
                  <option>Retell AI - Neural Indian Accent (Female)</option>
                  <option>Retell AI - Deep Professional (Male)</option>
                  <option>ElevenLabs - Multilingual v2</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-slate-900 border-slate-800 text-white p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Qualification Criteria</h3>
            <div className="space-y-2 text-xs">
              {["Budget Qualification (> ₹1 Cr)", "Preferred Location (Gachibowli / Financial Dist)", "Site Visit Availability (Weekend)"].map((q, i) => (
                <div key={i} className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300">
                  {q}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
