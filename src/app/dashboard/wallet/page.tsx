"use client"

import { useState } from "react"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, CreditCard, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const TRANSACTIONS = [
  { id: "tx_1", type: "debit", desc: "Outbound AI Call (142s) - Cyber Hills Launch", amount: "₹3.55", date: "16 Nov 2026, 10:47 AM" },
  { id: "tx_2", type: "debit", desc: "Outbound AI Call (105s) - Cyber Hills Launch", amount: "₹2.62", date: "16 Nov 2026, 10:15 AM" },
  { id: "tx_3", type: "credit", desc: "Wallet Recharge via Razorpay (Test Mode)", amount: "+₹5,000.00", date: "15 Nov 2026, 04:30 PM" },
  { id: "tx_4", type: "credit", desc: "Welcome Bonus Signup Credits", amount: "+₹100.00", date: "14 Nov 2026, 09:00 AM" },
]

export default function WalletBillingPage() {
  const [balance, setBalance] = useState("4,850.50")
  const [added, setAdded] = useState(false)

  const handleAddCredits = () => {
    setBalance("5,850.50")
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Wallet & Calling Expenses</h1>
          <p className="text-sm text-slate-400">
            Real-time per-second calling deductions, recharge history, and Razorpay payment integration.
          </p>
        </div>

        <Button
          onClick={handleAddCredits}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add ₹1,000 Credits (Demo)
        </Button>
      </div>

      {added && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Credits added successfully! Updated balance reflected in real-time.</span>
        </div>
      )}

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-800/40 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">₹{balance}</div>
          <div className="text-xs text-slate-400 mt-2">
            Approx. <strong className="text-white font-medium">3,233 calling minutes</strong> remaining.
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pricing Rate
          </div>
          <div className="text-2xl font-bold text-white">₹1.50 <span className="text-xs text-slate-400 font-normal">/ minute</span></div>
          <div className="text-xs text-slate-400 mt-2">
            Includes AI voice generation, ASR, LLM tokens & telecom carriage. No hidden platform markups.
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Active Plan
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">Growth Tier</span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
              Active
            </Badge>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Unlimited AI voice agents, TRAI compliance logs, and priority call routes.
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Wallet Activity & Deduction History</h3>
          <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
            Export Invoices
          </Badge>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === "credit"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-semibold text-white">{tx.desc}</div>
                  <div className="text-[11px] text-slate-400">{tx.date}</div>
                </div>
              </div>

              <div className={`font-mono font-bold text-sm ${
                tx.type === "credit" ? "text-emerald-400" : "text-slate-200"
              }`}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
