"use client"

import { useState } from "react"
import { History, Play, FileText, CheckCircle2, XCircle, Clock, Volume2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const CALL_RECORDS = [
  {
    id: "1",
    customer: "Ramesh Rao",
    phone: "+91 98765 43210",
    agent: "Priya (Telugu + English)",
    direction: "Outbound",
    duration: "2m 22s",
    outcome: "Qualified (Site Visit Booked)",
    cost: "₹3.55",
    sentiment: "Positive",
    date: "16 Nov 2026, 10:45 AM",
    transcript: "Agent: Namaskaram! I am Priya calling from Acme Realty. We have launched Cyber Hills luxury villas.\nUser: Yes, I am looking for a 3BHK around 1.8 Cr.\nAgent: We have booked your site visit for Saturday 11 AM.",
  },
  {
    id: "2",
    customer: "Suresh Kumar",
    phone: "+91 98123 45678",
    agent: "Priya (Telugu + English)",
    direction: "Outbound",
    duration: "1m 45s",
    outcome: "Follow-up Needed",
    cost: "₹2.62",
    sentiment: "Neutral",
    date: "16 Nov 2026, 10:15 AM",
    transcript: "Agent: Namaste! Calling from Acme Realty regarding your query.\nUser: I am busy in meeting, please call back tomorrow.",
  },
  {
    id: "3",
    customer: "Ananya Sharma",
    phone: "+91 97654 32109",
    agent: "Dr. Ravi (Hindi + English)",
    direction: "Inbound",
    duration: "3m 10s",
    outcome: "Appointment Booked",
    cost: "₹4.75",
    sentiment: "Positive",
    date: "16 Nov 2026, 09:30 AM",
    transcript: "User: Hello, I want to book doctor appointment.\nAgent: Main Dr. Ravi ka assistant bol raha hoon. Kaunsa time slot chahiye?",
  },
]

export default function CallHistoryPage() {
  const [selectedCall, setSelectedCall] = useState<typeof CALL_RECORDS[0] | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Call History & Transcripts</h1>
        <p className="text-sm text-slate-400">
          Browse call recordings, complete bilingual dialogue transcripts, AI summaries, and cost tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Agent</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {CALL_RECORDS.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCall(c)}
                      className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                        selectedCall?.id === c.id ? "bg-indigo-950/40" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.customer}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{c.agent}</td>
                      <td className="py-3 px-4 text-slate-300">{c.duration}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${
                          c.sentiment === "Positive"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}>
                          {c.outcome}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-white">{c.cost}</td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="ghost" className="text-xs text-indigo-400 hover:text-white p-1">
                          <FileText className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Call Details & Transcript Preview */}
        <div>
          <Card className="bg-slate-900 border-slate-800 text-white p-5 sticky top-20">
            {selectedCall ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-xs text-slate-400">{selectedCall.date}</div>
                  <h3 className="text-lg font-bold text-white">{selectedCall.customer}</h3>
                  <div className="text-xs text-slate-400 font-mono">{selectedCall.phone}</div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-slate-300">Voice Recording</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-indigo-300 border-indigo-500/30">
                    MP3 · {selectedCall.duration}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Call Transcript
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-56 overflow-y-auto">
                    {selectedCall.transcript}
                  </div>
                </div>

                <div className="pt-2 text-xs flex justify-between text-slate-400">
                  <span>Telecom Deducted: <strong className="text-white">{selectedCall.cost}</strong></span>
                  <span>Sentiment: <strong className="text-emerald-400">{selectedCall.sentiment}</strong></span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Select a call from the list to preview transcript, audio recording, and AI notes.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
