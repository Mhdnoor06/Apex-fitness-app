"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { profileService, ApiError } from "@/lib/api"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password")
      return
    }

    setIsSaving(true)

    try {
      await profileService.changePassword({
        currentPassword,
        newPassword,
      })

      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } catch (error) {
      console.error("Error changing password:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("An error occurred. Please try again.")
      }
      setIsSaving(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link href="/profile" className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Change Password
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
              Password changed successfully! Redirecting to profile...
            </div>
          )}

          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isSaving}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isSaving}
            />
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 mt-8 w-full bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80 -mx-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400"
            >
              {isSaving ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

