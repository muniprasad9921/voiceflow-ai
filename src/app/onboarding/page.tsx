"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Bot,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  PhoneCall,
  Loader2,
} from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form State
  const [orgName, setOrgName] = useState("Acme Realty")
  const [industry, setIndustry] = useState("Real Estate")
  const [agentName, setAgentName] = useState("Priya")
  const [primaryLanguage, setPrimaryLanguage] = useState("Telugu + English")
  const [useCase, setUseCase] = useState("Lead Qualification & Site Visits")

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Create organization record
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(2, 6)
        const { data: org } = await supabase.from("organizations").insert({
          name: orgName,
          slug,
          industry,
          owner_id: user.id,
        }).select().single()

        if (org) {
          // Add user as organization owner
          await supabase.from("organization_members").insert({
            org_id: org.id,
            user_id: user.id,
            role: "owner",
          })

          // Create first AI agent
          await supabase.from("ai_agents").insert({
            org_id: org.id,
            name: agentName,
            language_primary: primaryLanguage.includes("Telugu") ? "te-IN" : "en-IN",
            language_secondary: "en-IN",
            status: "active",
            created_by: user.id,
          })

          // Mark profile updated
          await supabase.from("profiles").update({ updated_at: new Date().toISOString() }).eq("id", user.id)
        }
      }
    } catch (e) {
      console.log("Onboarding background save notice:", e)
    } finally {
      setLoading(false)
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header & Progress */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Setup Wizard · Step {step} of 3
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Let&apos;s Set Up Your AI Employee</h1>
          <Progress value={(step / 3) * 100} className="h-1.5 mt-4 bg-slate-800" />
        </div>

        {/* STEP 1: Organization */}
        {step === 1 && (
          <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Your Business Profile</CardTitle>
              <CardDescription className="text-slate-400">
                Configure your organization name and primary industry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization / Business Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                  placeholder="e.g. Acme Realty"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Industry</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Real Estate", "Healthcare", "Education", "Banking / Finance", "Restaurants", "Automobile"].map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`p-3 rounded-lg text-left text-sm font-medium border transition-all ${
                        industry === ind
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Next: AI Voice Agent <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: First AI Employee */}
        {step === 2 && (
          <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Bot className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">Hire Your First AI Voice Employee</CardTitle>
              <CardDescription className="text-slate-400">
                Give your agent an identity, role, and supported Indian languages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">AI Employee Name</Label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="bg-slate-800/80 border-slate-700 text-white"
                  placeholder="e.g. Priya, Dr. Ravi, Vikram"
                />
              </div>

              <div className="space-y-2">
                <Label>Primary Calling Language</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Telugu + English",
                    "Hindi + English",
                    "Tamil + English",
                    "Kannada + English",
                    "Marathi + English",
                    "English Only",
                  ].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPrimaryLanguage(lang)}
                      className={`p-3 rounded-lg text-left text-sm font-medium border flex items-center justify-between transition-all ${
                        primaryLanguage === lang
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <span>{lang}</span>
                      <Globe2 className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Use Case</Label>
                <div className="space-y-2">
                  {[
                    "Lead Qualification & Site Visits",
                    "Inbound Support & FAQs",
                    "Customer Appointment Scheduling",
                    "Payment Reminder & Renewal",
                  ].map((uc) => (
                    <button
                      key={uc}
                      type="button"
                      onClick={() => setUseCase(uc)}
                      className={`w-full p-2.5 rounded-lg text-left text-xs font-medium border transition-all ${
                        useCase === uc
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {uc}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Next: Review & Launch <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: Review & Finish */}
        {step === 3 && (
          <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold">You&apos;re All Set!</CardTitle>
              <CardDescription className="text-slate-400">
                Here is a summary of your VoiceFlow AI setup:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Organization:</span>
                  <span className="font-semibold text-white">{orgName} ({industry})</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">AI Voice Employee:</span>
                  <span className="font-semibold text-white">{agentName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Languages:</span>
                  <Badge variant="secondary" className="bg-indigo-900/40 text-indigo-300">
                    {primaryLanguage}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Workflow:</span>
                  <span className="text-xs text-slate-300">{useCase}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Starting Wallet Balance:</span>
                  <span className="font-semibold text-emerald-400">₹100.00 Free Calling Credits</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                disabled={loading}
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 shadow-lg shadow-indigo-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Provisioning Dashboard...
                  </>
                ) : (
                  <>
                    Open My Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Edit details
              </button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
