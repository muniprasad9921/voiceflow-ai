"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setErrorMsg(error.message)
      } else {
        router.push("/login?message=Password updated successfully")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-white shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">New Password</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleUpdate}>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-slate-800/80 border-slate-700 text-white"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
