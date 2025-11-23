"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { profileService, ApiError } from "@/lib/api"

type Gender = "Male" | "Female"
type Goal = "cut" | "bulk" | "recomp" | "maintain"
type ActivityLevel = "sedentary" | "light" | "moderate" | "very"

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [name, setName] = useState("")
  const [gender, setGender] = useState<Gender>("Male")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [goal, setGoal] = useState<Goal>("cut")
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("sedentary")

  useEffect(() => {
    // Fetch current user data
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile()
        const user = response.user

        if (user) {
          setName(user.name || "")
          setGender((user.gender as Gender) || "Male")
          setAge(user.age?.toString() || "")
          setHeight(user.height?.toString() || "")
          setWeight(user.weight?.toString() || "")
          setGoal((user.goal as Goal) || "cut")
          setActivityLevel((user.activityLevel as ActivityLevel) || "sedentary")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        if (error instanceof ApiError) {
          setError(error.message)
        } else {
          setError("Failed to load profile")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSaving(true)

    try {
      await profileService.updateProfile({
        name,
        gender,
        age,
        height,
        weight,
        goal,
        activityLevel,
      })

      // Redirect back to profile
      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError("An error occurred. Please try again.")
      }
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
        <p className="text-slate-900 dark:text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link href="/profile" className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Edit Profile
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

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="name">
              Name
            </label>
            <input
              className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Gender
            </label>
            <div className="flex h-12 w-full items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800 p-1">
              <label
                className={`flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal transition-all ${
                  gender === "Male"
                    ? "bg-background-light text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                <span className="truncate">Male</span>
                <input
                  className="invisible size-0"
                  name="gender-selection"
                  type="radio"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                />
              </label>
              <label
                className={`flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal transition-all ${
                  gender === "Female"
                    ? "bg-background-light text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                <span className="truncate">Female</span>
                <input
                  className="invisible size-0"
                  name="gender-selection"
                  type="radio"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                />
              </label>
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="age">
              Age
            </label>
            <input
              className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
              id="age"
              placeholder="e.g., 25"
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="height">
                Height (cm)
              </label>
              <input
                className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
                id="height"
                placeholder="e.g., 180"
                type="number"
                min="50"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                className="h-12 w-full rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-primary dark:focus:ring-primary"
                id="weight"
                placeholder="e.g., 75"
                type="number"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Goal */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Goal
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "cut" as Goal, icon: "local_fire_department", label: "Cut", desc: "Lose weight and reduce body fat." },
                { value: "bulk" as Goal, icon: "fitness_center", label: "Bulk", desc: "Build muscle and gain mass." },
                { value: "recomp" as Goal, icon: "autorenew", label: "Recomp", desc: "Build muscle and lose fat." },
                { value: "maintain" as Goal, icon: "balance", label: "Maintain", desc: "Keep your current physique." },
              ].map((goalOption) => (
                <label
                  key={goalOption.value}
                  className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-all ${
                    goal === goalOption.value
                      ? "border-primary bg-neutral-200 dark:bg-neutral-800"
                      : "border-transparent bg-neutral-200 dark:bg-neutral-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-primary">{goalOption.icon}</span>
                  <span className="font-bold text-neutral-800 dark:text-white">{goalOption.label}</span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">{goalOption.desc}</span>
                  <input
                    className="invisible size-0"
                    name="goal-selection"
                    type="radio"
                    value={goalOption.value}
                    checked={goal === goalOption.value}
                    onChange={() => setGoal(goalOption.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Activity Level
            </label>
            <div className="flex flex-col gap-2">
              {[
                { value: "sedentary" as ActivityLevel, label: "Sedentary", desc: "Office job with little exercise." },
                { value: "light" as ActivityLevel, label: "Lightly Active", desc: "Light exercise 1-3 days/week." },
                { value: "moderate" as ActivityLevel, label: "Moderately Active", desc: "Moderate exercise 3-5 days/week." },
                { value: "very" as ActivityLevel, label: "Very Active", desc: "Intense exercise 6-7 days/week." },
              ].map((level) => (
                <label
                  key={level.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                    activityLevel === level.value
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                >
                  <input
                    className="mt-1 size-4 shrink-0 cursor-pointer accent-primary"
                    name="activity-level"
                    type="radio"
                    value={level.value}
                    checked={activityLevel === level.value}
                    onChange={() => setActivityLevel(level.value)}
                  />
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-white">{level.label}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{level.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 mt-8 w-full bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80 -mx-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

