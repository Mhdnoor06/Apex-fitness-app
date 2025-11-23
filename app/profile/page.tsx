import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Profile & Settings - FitFlow",
  description: "Manage your profile and app settings",
};

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      gender: true,
      age: true,
      height: true,
      weight: true,
      goal: true,
      activityLevel: true,
      bmi: true,
      tdee: true,
      targetCalories: true,
      targetProtein: true,
      onboardingCompleted: true,
    },
  });
  return user;
}

export default async function Profile() {
  const session = await auth();
  const user = session?.user?.id ? await getUserData(session.user.id) : null;
  
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  
  // Format goal for display
  const goalLabels: Record<string, string> = {
    cut: "Cut",
    bulk: "Bulk",
    recomp: "Recomp",
    maintain: "Maintain",
  };
  
  const activityLabels: Record<string, string> = {
    sedentary: "Sedentary",
    light: "Lightly Active",
    moderate: "Moderately Active",
    very: "Very Active",
  };
  
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link href="/" className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Profile &amp; Settings
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow px-4">
        {/* Profile Header */}
        <div className="flex p-4 @container justify-center">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary-start/20"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCj148qWqIyn-AARVxLt9Z5Px4Pooil4zSrobG-2LjlDMjyUQwFOQZOaXzTGs-hDQbhhns_2zpjBAykZt7gsnuZT_fQNdDTe0BWNT0s4bnEYWP_lY3GzNACYbuwnYzUxcI4ggHgHgKxZ8qBA2FopNUdsaEJnrWUGyCtIvIEjX8pnwW1fV_qjyGUSqYdTEmo6B7P15NHFRfUy7Q6hmFOG2NXxVnuKf0R2YHnaiWQACzvEFeKKoEzFsmEd8fHj7ZWzKovktAkdWcrmGM")'}}
              />
              <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white">
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
                {userName}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal text-center">
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Fitness Stats Section */}
          {user?.onboardingCompleted && (
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                Fitness Stats
              </h3>
              <div className="bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {user.bmi && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light dark:bg-background-dark p-4">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">BMI</p>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">{user.bmi.toFixed(1)}</p>
                    </div>
                  )}
                  {user.tdee && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light dark:bg-background-dark p-4">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">TDEE</p>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {user.tdee.toLocaleString()} <span className="text-sm font-medium">kcal</span>
                      </p>
                    </div>
                  )}
                  {user.targetCalories && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light dark:bg-background-dark p-4">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Target Calories</p>
                      <p className="text-2xl font-bold text-primary">
                        {user.targetCalories.toLocaleString()} <span className="text-sm font-medium">kcal</span>
                      </p>
                    </div>
                  )}
                  {user.targetProtein && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-background-light dark:bg-background-dark p-4">
                      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Target Protein</p>
                      <p className="text-2xl font-bold text-primary">
                        {user.targetProtein} <span className="text-sm font-medium">g</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-4 pb-4 space-y-2">
                  {user.gender && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Gender</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{user.gender}</p>
                    </div>
                  )}
                  {user.age && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Age</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{user.age} years</p>
                    </div>
                  )}
                  {user.height && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Height</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{user.height} cm</p>
                    </div>
                  )}
                  {user.weight && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Weight</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{user.weight} kg</p>
                    </div>
                  )}
                  {user.goal && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Goal</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{goalLabels[user.goal] || user.goal}</p>
                    </div>
                  )}
                  {user.activityLevel && (
                    <div className="flex justify-between items-center py-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Activity Level</p>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">{activityLabels[user.activityLevel] || user.activityLevel}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Account
            </h3>
            <div className="bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden">
              <Link href="/profile/edit" className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">person</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Edit Profile
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
              <Link href="/profile/change-password" className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">lock</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Change Password
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">link</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Connected Accounts
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App Preferences Section */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Preferences
            </h3>
            <div className="bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">notifications</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Notifications
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">straighten</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Units of Measurement
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">dark_mode</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Dark Mode
                  </p>
                </div>
                <div className="shrink-0">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      defaultChecked 
                      readOnly
                      className="peer sr-only" 
                      type="checkbox" 
                    />
                    <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-to-r peer-checked:from-primary-start peer-checked:to-primary-end peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-slate-600 dark:bg-slate-700"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Legal Section */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Support &amp; Legal
            </h3>
            <div className="bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">help_outline</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Help &amp; Support
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">privacy_tip</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Privacy Policy
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-white flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-start/20 to-primary-end/20 shrink-0 size-10">
                    <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-primary-start to-primary-end">gavel</span>
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate">
                    Terms of Service
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="text-slate-400 dark:text-slate-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Log Out Button */}
          <div className="pt-8 pb-12">
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 px-4 py-3 text-base font-medium text-red-600 dark:text-red-400"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
