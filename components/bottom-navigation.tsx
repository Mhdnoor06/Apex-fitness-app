"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <Link
          href="/"
          className={`inline-flex flex-col items-center justify-center px-5 transition-colors ${
            isActive("/")
              ? "text-gradient-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-primary-start"
          }`}
        >
          <span className="material-symbols-outlined text-2xl mb-1">home</span>
          <span className={`text-xs ${isActive("/") ? "font-bold" : "font-medium"}`}>Home</span>
        </Link>
        <Link
          href="/workouts"
          className={`inline-flex flex-col items-center justify-center px-5 transition-colors ${
            isActive("/workouts")
              ? "text-gradient-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-primary-start"
          }`}
        >
          <span className="material-symbols-outlined text-2xl mb-1">fitness_center</span>
          <span className={`text-xs ${isActive("/workouts") ? "font-bold" : "font-medium"}`}>Workouts</span>
        </Link>
        <Link
          href="/progress"
          className={`inline-flex flex-col items-center justify-center px-5 transition-colors ${
            isActive("/progress")
              ? "text-gradient-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-primary-start"
          }`}
        >
          <span className="material-symbols-outlined text-2xl mb-1">bar_chart</span>
          <span className={`text-xs ${isActive("/progress") ? "font-bold" : "font-medium"}`}>Progress</span>
        </Link>
        <Link
          href="/exercises"
          className={`inline-flex flex-col items-center justify-center px-5 transition-colors ${
            isActive("/exercises")
              ? "text-gradient-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-primary-start"
          }`}
        >
          <span className="material-symbols-outlined text-2xl mb-1">import_contacts</span>
          <span className={`text-xs ${isActive("/exercises") ? "font-bold" : "font-medium"}`}>Exercises</span>
        </Link>
        <Link
          href="/profile"
          className={`inline-flex flex-col items-center justify-center px-5 transition-colors ${
            isActive("/profile")
              ? "text-gradient-primary"
              : "text-slate-500 dark:text-slate-400 hover:text-primary-start"
          }`}
        >
          <span className="material-symbols-outlined text-2xl mb-1">person</span>
          <span className={`text-xs ${isActive("/profile") ? "font-bold" : "font-medium"}`}>Profile</span>
        </Link>
      </div>
    </div>
  )
}

