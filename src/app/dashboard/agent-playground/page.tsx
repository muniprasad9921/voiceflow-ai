"use client"

import { useState } from "react"
import { Bot, Mic, MicOff, Play, RotateCcw, Send, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "agent" | "user"
  text: string
  time: string
}

export default function AgentPlaygroundPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("Telugu + English")
  const [isCalling, setIsCalling] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "Namaskaram! I am Priya calling from Acme Realty. Am I speaking with the property buyer today?",
      time: "00:02",
    },
  ])

  // Simulated AI captured fields
  const [captured, setCaptured] = useState({
    budget: "Not detected",
    location: "Gachibowli",
    propertyType: "3BHK Villa",
    siteVisit: "Pending",
    intentScore: 45,
  })

  const startSimulation = () => {
    setIsCalling(true)
    setMessages([
      {
        role: "agent",
        text: selectedLanguage.includes("Telugu")
          ? "Namaskaram! I am Priya calling from Acme Realty. We have newly launched luxury 3BHK villas. Are you looking to invest in property?"
          : "Hello! This is Priya from Acme Realty. Are you currently exploring residential property options in Hyderabad?",
        time: "00:02",
      },
    ])
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const newMessages = [
      ...messages,
      { role: "user" as const, text: userInput, time: "00:15" },
    ]
    setMessages(newMessages)
    setUserInput("")

    // Simulated responsive agent reply based on user keywords
    setTimeout(() => {
      let agentReply = "That sounds great! Can you share your preferred budget range?"
      if (userInput.toLowerCase().includes("crore") || userInput.toLowerCase().includes("cr") || userInput.toLowerCase().includes("lakh")) {
        agentReply = "Understood. Our luxury Cyber Hills villas start at ₹1.6 Cr with complete clubhouse amenities. Can I book a site visit for you this Saturday?"
        setCaptured(prev => ({ ...prev, budget: "₹1.5 - 2 Cr", intentScore: 88 }))
      } else if (userInput.toLowerCase().includes("saturday") || userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("visit")) {
        agentReply = "Super! I have booked your site visit for Saturday 11:00 AM. Sending the Google Maps location and brochure on WhatsApp right now."
        setCaptured(prev => ({ ...prev, siteVisit: "Saturday 11 AM", intentScore: 96 }))
      }

      setMessages(prev => [
        ...prev,
        { role: "agent", text: agentReply, time: "00:25" },
      ])
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Agent Testing Playground</h1>
            <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px]">
              SIMULATION MODE
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            Simulate customer calls, verify objection handling, and observe real-time qualification without telecom costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-2"
          >
            <option>Telugu + English</option>
            <option>Hindi + English</option>
            <option>Tamil + English</option>
            <option>English Only</option>
          </select>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl flex items-center gap-3 text-amber-300 text-xs">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Testing Sandbox:</strong> Calls generated in this playground run entirely in-browser or via AI mock prompts. No phone credits or real telecom charges are consumed.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulation Chat Window */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white flex flex-col h-[520px]">
          <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">Simulated Call with Priya</CardTitle>
                <CardDescription className="text-[11px] text-slate-400">Voice Model: Retell AI Neural · Language: {selectedLanguage}</CardDescription>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={startSimulation}
              className="text-xs border-slate-700 text-slate-300 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restart Call
            </Button>
          </CardHeader>

          {/* Transcript Scroll Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "agent" ? "items-start" : "items-end"}`}
              >
                <div className="text-[10px] text-slate-500 mb-1">
                  {m.role === "agent" ? "Priya (AI Voice)" : "You (Customer)"} · {m.time}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                    m.role === "agent"
                      ? "bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-sm"
                      : "bg-indigo-600 text-white rounded-tr-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </CardContent>

          {/* User Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response as a customer (e.g. 'Yes, I am looking for 3BHK with budget 1.8 Cr')..."
              className="bg-slate-800 border-slate-700 text-xs text-white"
            />
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </Card>

        {/* Right Col: Live Extracted Fields & Scorecard */}
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>AI Live Lead Scoring</span>
                <span className="text-emerald-400 font-bold">{captured.intentScore} / 100</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${captured.intentScore}%` }}
                />
              </div>

              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Captured Entities
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-medium text-white">{captured.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Property:</span>
                  <span className="font-medium text-white">{captured.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Site Visit:</span>
                  <span className="font-medium text-emerald-400">{captured.siteVisit}</span>
                </div>
              </div>

              <div className="pt-2 text-slate-400 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TRAI AI Disclosure completed at 00:02</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Indian English / Telugu Code-switching active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-white p-4">
            <div className="text-xs font-bold text-white mb-2">Simulate Common Objections</div>
            <div className="flex flex-col gap-2">
              {[
                "Price is too high, do you have discounts?",
                "Is it ready to move or under construction?",
                "Can you call me back next month?",
              ].map((obj, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUserInput(obj)}
                  className="p-2 text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded text-[11px] text-slate-300 transition-colors"
                >
                  &quot;{obj}&quot;
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
