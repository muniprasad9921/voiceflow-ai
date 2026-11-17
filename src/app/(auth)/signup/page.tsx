"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccess(true)
        // If email confirmation is off, proceed to onboarding
        if (data.session) {
          router.push("/onboarding")
          router.refresh()
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl text-center p-6">
        <CardHeader>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Account Created!</CardTitle>
          <CardDescription className="text-slate-400">
            Welcome to VoiceFlow AI. Check your email inbox to verify your account or proceed directly to onboarding.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Link
            href="/onboarding"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-lg text-center transition-all"
          >
            Continue to Onboarding →
          </Link>
          <Link href="/login" className="text-xs text-slate-400 hover:text-white">
            Already verified? Sign In
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create Free Account</CardTitle>
        <CardDescription className="text-slate-400">
          Deploy your first AI voice employee in minutes. No credit card required.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g. Ramesh Varma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-200">Company / Organization</Label>
            <Input
              id="companyName"
              placeholder="e.g. Acme Realty"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 transition-all shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
