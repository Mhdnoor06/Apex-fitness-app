import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Settings - FitFlow",
  description: "Manage your profile and app settings",
};

export default function Profile() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <div className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </div>
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
                Jane Doe
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal text-center">
                @janedoe
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Section */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Account
            </h3>
            <div className="bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
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
              </div>
              <div className="flex items-center gap-4 px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-800">
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
              </div>
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
                    <input checked className="peer sr-only" type="checkbox" />
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
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 px-4 py-3 text-base font-medium text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined">logout</span>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
