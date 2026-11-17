"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowRight, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.")
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail("demo@voiceflow.ai")
    setPassword("DemoUser@2026!")
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your email and password to access your AI employee dashboard
        </CardDescription>
        {/* Quick Demo Access Banner */}
        <div className="mt-3 p-3 bg-indigo-950/60 border border-indigo-700/50 rounded-xl text-left">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-300">Quick Demo Access</div>
              <div className="text-[11px] text-slate-400 font-mono">demo@voiceflow.ai</div>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-md font-semibold transition-colors"
            >
              Autofill
            </button>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email Address</Label>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
