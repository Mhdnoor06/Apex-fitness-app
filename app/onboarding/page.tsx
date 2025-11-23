"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onboardingService, ApiError } from "@/lib/api"

type Gender = "Male" | "Female"
type Goal = "cut" | "bulk" | "recomp" | "maintain"
type ActivityLevel = "sedentary" | "light" | "moderate" | "very"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  // Step 1 data
  const [gender, setGender] = useState<Gender>("Male")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  
  // Step 2 data
  const [goal, setGoal] = useState<Goal>("cut")
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("sedentary")
  
  // Get email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("onboardingEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email found, redirect to signup
      router.push("/signup")
    }
  }, [router])
  
  // Calculations
  const calculateBMI = () => {
    if (!height || !weight) return 0
    const heightInMeters = parseFloat(height) / 100
    const weightInKg = parseFloat(weight)
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
  }
  
  const calculateTDEE = () => {
    if (!age || !height || !weight) return 0
    
    const ageNum = parseFloat(age)
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)
    
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr: number
    if (gender === "Male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725
    }
    
    return Math.round(bmr * activityMultipliers[activityLevel])
  }
  
  const calculateTargetCalories = () => {
    const tdee = calculateTDEE()
    if (!tdee) return 0
    
    const goalMultipliers = {
      cut: 0.8,      // 20% deficit
      bulk: 1.2,     // 20% surplus
      recomp: 0.95,  // 5% deficit
      maintain: 1.0  // Maintenance
    }
    
    return Math.round(tdee * goalMultipliers[goal])
  }
  
  const calculateTargetProtein = () => {
    if (!weight) return 0
    const weightNum = parseFloat(weight)
    // 2g per kg of bodyweight for muscle building
    return Math.round(weightNum * 2)
  }
  
  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!age || !height || !weight) {
        alert("Please fill in all fields")
        return
      }
      setStep(2)
    }
  }
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      router.push("/signup")
    }
  }
  
  const handleContinue = async () => {
    if (!email) {
      alert("Email not found. Please sign up again.")
      router.push("/signup")
      return
    }
    
    setIsSaving(true)
    
    try {
      const bmiValue = calculateBMI()
      const tdeeValue = calculateTDEE()
      const targetCaloriesValue = calculateTargetCalories()
      const targetProteinValue = calculateTargetProtein()
      
      await onboardingService.saveOnboarding({
        email,
        gender,
        age,
        height,
        weight,
        goal,
        activityLevel,
        bmi: bmiValue,
        tdee: tdeeValue,
        targetCalories: targetCaloriesValue,
        targetProtein: targetProteinValue,
      })
      
      // Clear email from localStorage
      localStorage.removeItem("onboardingEmail")
      
      // Redirect to dashboard (user should already be logged in from signup)
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      console.error("Error saving onboarding data:", error)
      if (error instanceof ApiError) {
        alert(error.message)
      } else {
        alert("An error occurred. Please try again.")
      }
      setIsSaving(false)
    }
  }
  
  const bmi = calculateBMI()
  const tdee = calculateTDEE()
  const targetCalories = calculateTargetCalories()
  const targetProtein = calculateTargetProtein()
  
  return (
    <div className="relative flex w-full flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80 justify-between">
        <button
          onClick={handleBack}
          className="text-neutral-800 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-neutral-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Personalize Your Plan
        </h2>
        <div className="flex size-10 shrink-0 items-center"></div>
      </div>
      
      {/* Progress Bar */}
      <div className="flex flex-col gap-3 px-4 pt-2">
        <div className="flex gap-6 justify-between">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm font-medium leading-normal">
            Step {step} of 2
          </p>
        </div>
        <div className="rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="flex flex-1 flex-col p-4 gap-6">
          <div>
            <h1 className="text-neutral-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left">
              Tell Us About Yourself
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal leading-normal pt-1">
              This helps us create a plan tailored to your body and goals.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
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
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Goals and Activity */}
      {step === 2 && (
        <div className="flex flex-col p-4 gap-6 flex-grow">
          {/* Goal Selection */}
          <div className="flex flex-col gap-3">
            <h1 className="text-neutral-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left">
              What&apos;s Your Goal?
            </h1>
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
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Your Activity Level</h3>
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
          
          {/* Results Card */}
          <div className="flex flex-col gap-4 rounded-xl bg-neutral-200 p-4 dark:bg-neutral-900 mt-2">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center">
              Here&apos;s Your Starting Point!
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light p-4 dark:bg-background-dark">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">BMI</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">{bmi || "—"}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light p-4 dark:bg-background-dark">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">TDEE</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {tdee ? `${tdee.toLocaleString()}` : "—"} <span className="text-base font-medium">kcal</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light p-4 dark:bg-background-dark">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Target Calories</p>
                <p className="text-3xl font-bold text-primary">
                  {targetCalories ? `${targetCalories.toLocaleString()}` : "—"} <span className="text-base font-medium">kcal</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light p-4 dark:bg-background-dark">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Target Protein</p>
                <p className="text-3xl font-bold text-primary">
                  {targetProtein || "—"} <span className="text-base font-medium">g</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Button */}
      <div className="sticky bottom-0 mt-auto w-full bg-background-light/80 p-4 backdrop-blur-sm dark:bg-background-dark/80">
        <button
          onClick={step === 1 ? handleNext : handleContinue}
          disabled={isSaving}
          className="w-full h-14 flex items-center justify-center rounded-xl bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400"
        >
          {isSaving ? "Saving..." : step === 1 ? "Next" : "Continue"}
        </button>
      </div>
    </div>
  )
}

