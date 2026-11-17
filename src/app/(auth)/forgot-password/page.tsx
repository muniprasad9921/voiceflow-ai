"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSent(true)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your email address and we&apos;ll send you a password recovery link
        </CardDescription>
      </CardHeader>

      {sent ? (
        <CardContent className="space-y-4 text-center py-6">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <MailCheck className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-300">
            A password reset email has been sent to <span className="font-semibold text-white">{email}</span>.
          </p>
          <p className="text-xs text-slate-500">
            Please check your spam folder if you do not see it within a few minutes.
          </p>
        </CardContent>
      ) : (
        <form onSubmit={handleReset}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg">
                {errorMsg}
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
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>
      )}

      <div className="p-6 pt-0 text-center">
        <Link href="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
        </Link>
      </div>
    </Card>
  )
}
