"use client"

import { useState } from "react"
import { Users, Plus, Download, Upload, Search, Phone, Mail, MapPin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const INITIAL_CONTACTS = [
  { id: "1", name: "Ramesh Rao", phone: "+91 98765 43210", email: "ramesh.rao@example.com", company: "Tech Innovators", location: "Hyderabad", status: "Qualified", budget: "₹1.8 Cr", source: "CSV Import" },
  { id: "2", name: "Suresh Kumar", phone: "+91 98123 45678", email: "suresh.k@example.com", company: "Kolkata Traders", location: "Bangalore", status: "Contacted", budget: "₹90 Lakhs", source: "Website Form" },
  { id: "3", name: "Ananya Sharma", phone: "+91 97654 32109", email: "ananya.s@example.com", company: "Sharma Healthcare", location: "Delhi NCR", status: "Booked", budget: "₹2.2 Cr", source: "Meta Ads" },
  { id: "4", name: "Vikram Malhotra", phone: "+91 99887 76655", email: "vikram.m@example.com", company: "Malhotra Enterprises", location: "Mumbai", status: "Inactive", budget: "₹1 Cr", source: "Meta Ads" },
  { id: "5", name: "Deepak Patel", phone: "+91 91234 56780", email: "deepak.p@example.com", company: "Patel Agro", location: "Ahmedabad", status: "Qualified", budget: "₹1.5 Cr", source: "CSV Import" },
]

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRM Contacts</h1>
          <p className="text-sm text-slate-400">
            Manage your customer database, call readiness, consent, and custom CRM attributes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-slate-700 text-xs text-slate-300">
            <Upload className="w-3.5 h-3.5 mr-1" /> Import CSV
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-xs text-slate-300">
            <Download className="w-3.5 h-3.5 mr-1" /> Export
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Contact
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or location..."
            className="pl-9 bg-slate-900 border-slate-800 text-xs text-white"
          />
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{c.phone}</td>
                  <td className="py-3 px-4 text-slate-300">{c.location}</td>
                  <td className="py-3 px-4 font-medium text-white">{c.budget}</td>
                  <td className="py-3 px-4">
                    <Badge className={`text-[10px] ${
                      c.status === "Qualified" || c.status === "Booked"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : c.status === "Contacted"
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
