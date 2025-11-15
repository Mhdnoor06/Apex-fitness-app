import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - FitFlow",
  description: "Reset your FitFlow account password",
};

export default function ForgotPassword() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCM5kQzxx3U0AoarNMnmrCFXQkTIU1iTAREO52u_ybKEeEQbramnFy8SdDcQ0tkh_V1Z1VUCOIdQo9mTL3_is0x9ZK4xUqABTPWhaaxEQJSJXlSn1nXFApBEP4CU_9pgaFUrnmjLFJmdKbpfqPaWaq63ptw9jfKuuWmJkGU09-IqSQ7acp-moIYN2GGEFPcdECFRVhgHKwmQOBQCIaqVBbJerb8Suhq4PQ7FZRS-Qcq6vN2uFd0EdAcEF1ilGxoF7yyt82vHScn9iI")'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="material-symbols-outlined text-primary-start text-5xl mb-2">fitness_center</span>
          <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">FitFlow</h1>
          <p className="text-white/80 text-base font-normal leading-normal pt-1">Your Fitness Journey Starts Here</p>
        </div>

        {/* Forgot Password Form */}
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center mb-2">Forgot Password</h2>
          <p className="text-white/60 text-center text-base leading-normal mb-2">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <div className="flex flex-col">
            <label className="text-white text-base font-medium leading-normal pb-2" htmlFor="email-forgot">
              Email Address
            </label>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-white/20 bg-white/5 focus:border-primary-start h-14 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal"
              id="email-forgot"
              placeholder="Enter your email address"
              type="email"
            />
          </div>

          <button className="flex items-center justify-center whitespace-nowrap h-14 w-full rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white text-base font-bold leading-normal mt-4 transition-transform duration-200 ease-in-out hover:scale-[1.02] shadow-[0_4px_15px_0_rgba(244,92,67,0.3)] hover:shadow-[0_4px_20px_0_rgba(235,51,73,0.4)]">
            Send Reset Link
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center flex flex-col gap-4 w-full">
          <p className="text-white/60">
            Remember your password?{' '}
            <a className="font-bold text-primary-start hover:underline" href="/login">
              Login
            </a>
          </p>
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
