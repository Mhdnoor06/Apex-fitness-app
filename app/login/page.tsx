"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const onboardingParam = searchParams.get("onboarding")
    
    if (emailParam) {
      setEmail(emailParam)
    }
    
    if (onboardingParam === "complete") {
      setOnboardingComplete(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCM5kQzxx3U0AoarNMnmrCFXQkTIU1iTAREO52u_ybKEeEQbramnFy8SdDcQ0tkh_V1Z1VUCOIdQo9mTL3_is0x9ZK4xUqABTPWhaaxEQJSJXlSn1nXFApBEP4CU_9pgaFUrnmjLFJmdKbpfqPaWaq63ptw9jfKuuWmJkGU09-IqSQ7acp-moIYN2GGEFPcdECFRVhgHKwmQOBQCIaqVBbJerb8Suhq4PQ7FZRS-Qcq6vN2uFd0EdAcEF1ilGxoF7yyt82vHScn9iI")'}}
        />
        <div className="absolute inset-0 bg-gradient-overlay"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="material-symbols-outlined text-primary text-5xl mb-2">fitness_center</span>
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">FitFlow</h1>
          <p className="text-white/80 text-base font-normal leading-normal pt-1">Your Fitness Journey Starts Here</p>
        </div>

        {/* Login Form */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center mb-2">Login</h2>

          {onboardingComplete && (
            <div className="w-full p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
              🎉 Onboarding complete! Please login to access your dashboard.
            </div>
          )}

          {error && (
            <div className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-white text-base font-medium leading-normal pb-2" htmlFor="email">Email Address</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-white/20 bg-white/5 focus:border-primary h-14 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal"
                id="email"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white text-base font-medium leading-normal pb-2" htmlFor="password">Password</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-white/20 bg-white/5 focus:border-primary h-14 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal"
                id="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="text-right mt-1">
              <a className="text-primary-start/80 hover:text-primary-start text-sm font-medium" href="/forgot-password">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center whitespace-nowrap h-14 w-full rounded-lg bg-gradient-primary text-white text-base font-bold leading-normal mt-4 transition-transform duration-200 ease-in-out hover:scale-[1.02] shadow-[0_4px_15px_0_rgba(244,92,67,0.3)] hover:shadow-[0_4px_20px_0_rgba(235,51,73,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Social Login Divider */}
        <div className="flex w-full items-center gap-4 my-8">
          <div className="h-px flex-1 bg-white/20"></div>
          <p className="text-white/60 text-sm font-medium">Or continue with</p>
          <div className="h-px flex-1 bg-white/20"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <button className="flex h-14 w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_3037_504)">
                <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.48H18.18C17.92 15.99 17.11 17.31 15.82 18.22V21.09H19.62C21.55 19.31 22.56 16.25 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.45 22.04 19.26 20.39L15.47 17.52C14.49 18.2 13.34 18.64 12 18.64C9.27 18.64 6.94 16.89 6.13 14.43H2.21V17.39C3.99 20.81 7.69 23 12 23Z" fill="#34A853" />
                <path d="M6.13 14.43C5.87 13.66 5.73 12.84 5.73 12C5.73 11.16 5.87 10.34 6.13 9.57V6.61H2.21C1.47 8.22 1 10.06 1 12C1 13.94 1.47 15.78 2.21 17.39L6.13 14.43Z" fill="#FBBC05" />
                <path d="M12 5.36C13.84 5.36 15.14 6.16 15.81 6.82L18.67 4.04C16.92 2.42 14.61 1 12 1C7.69 1 3.99 3.19 2.21 6.61L6.13 9.57C6.94 7.11 9.27 5.36 12 5.36Z" fill="#EA4335" />
              </g>
              <defs>
                <clipPath id="clip0_3037_504">
                  <rect fill="white" height="24" width="24" />
                </clipPath>
              </defs>
            </svg>
          </button>

          <button className="flex h-14 w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.228 5.798C14.448 5.778 13.118 6.218 12.188 7.028C11.188 7.858 10.518 9.008 10.558 10.378C10.538 11.798 11.318 12.988 12.308 13.668C13.298 14.338 14.508 14.658 15.348 14.438C15.388 14.438 15.428 14.438 15.458 14.438C15.458 14.438 15.458 14.438 15.468 14.438C16.278 14.228 17.208 13.788 18.018 13.008C18.028 12.998 18.038 12.988 18.048 12.988C18.108 12.928 18.898 11.978 18.898 10.238C18.898 8.018 17.438 6.748 17.398 6.708C16.548 5.868 15.468 5.798 15.228 5.798ZM14.468 3.488C15.388 3.498 16.278 3.828 17.008 4.418C17.758 5.028 18.258 5.928 18.338 6.898C18.338 6.898 18.338 6.898 18.338 6.898C18.338 6.898 18.338 6.908 18.338 6.908C17.518 6.968 16.548 7.368 15.828 8.038C15.118 8.688 14.738 9.688 14.718 10.638C15.548 10.368 16.488 10.618 17.248 11.148C17.998 11.668 18.428 12.438 18.448 13.318C18.468 14.238 17.988 15.118 17.208 15.688C16.428 16.258 15.488 16.518 14.598 16.348C12.018 15.888 10.668 13.568 10.668 11.368C10.638 9.178 12.208 7.158 12.208 7.138C12.228 7.108 13.308 5.828 14.938 5.828C14.938 5.828 14.948 5.828 14.948 5.828C14.288 4.508 14.288 3.488 14.468 3.488ZM9.408 10.158C11.158 9.328 12.008 7.828 12.008 7.788C11.128 6.518 9.538 5.888 8.248 5.888C6.118 5.888 4.098 7.298 4.098 10.028C4.098 11.518 4.718 13.918 5.998 15.408C6.678 16.218 7.428 16.588 8.168 16.588C8.898 16.588 9.478 16.308 10.348 15.758C10.398 15.728 10.428 15.698 10.468 15.678C9.528 15.088 8.978 14.078 9.008 13.008C9.028 11.698 9.878 10.748 10.798 10.238C10.398 10.388 10.008 10.518 9.618 10.618L9.408 10.158Z" />
            </svg>
          </button>

          <button className="flex h-14 w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
            <svg className="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-white/60">
            Don&apos;t have an account?{' '}
            <a className="font-bold text-primary-start hover:underline" href="/signup">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-pulse">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
