"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Base & RAG Vector Store</h1>
          <p className="text-sm text-slate-400">Upload business brochures, price lists, and PDFs. Vector embeddings empower the AI agent with ground truth.</p>
        </div>
        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
          pgvector Enabled
        </Badge>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Cyber Hills Luxury Villas Brochure.pdf</div>
          <div className="text-xs text-slate-400">142 vector chunks indexed · 1536-dim embeddings</div>
          <div className="text-xs text-emerald-400 font-medium">Ready for real-time RAG</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="font-bold text-white text-sm">Property Pricing & Payment Milestones.xlsx</div>
          <div className="text-xs text-slate-400">58 vector chunks indexed · 1536-dim embeddings</div>
          <div className="text-xs text-emerald-400 font-medium">Ready for real-time RAG</div>
        </div>
      </div>
    
    </div>
  )
}
