import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Workout Plan - FitFlow",
  description: "View and manage your daily workout plan",
};

export default function Workouts() {
  return (
    <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark pb-28">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">
            menu
          </span>
        </div>
        <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">My Plan</h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-gray-800 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
            <span className="material-symbols-outlined">
              calendar_today
            </span>
          </button>
        </div>
      </div>

      {/* Date Picker */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">MON</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">11</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">TUE</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">12</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-gradient-primary-br px-2 text-white shadow-lg">
            <p className="text-sm font-bold leading-normal">WED</p>
            <p className="text-sm font-bold leading-normal">13</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">THU</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">14</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">FRI</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">15</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">SAT</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">16</p>
          </div>
          <div className="flex h-10 shrink-0 basis-1/7 grow flex-col items-center justify-center gap-y-1 rounded-full bg-transparent px-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">SUN</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">17</p>
          </div>
        </div>
      </div>

      <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-2">Today&apos;s Workouts</h2>

      {/* Featured Workout */}
      <div className="px-4 pb-4">
        <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-gray-800/50 p-4 shadow-sm">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-gray-900 dark:text-white text-base font-bold leading-tight">Full Body Strength</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">45 min • Full Body</p>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 flex-row-reverse bg-gradient-primary-br text-white text-sm font-medium leading-normal w-fit shadow-md">
              <span className="truncate">Start</span>
            </button>
          </div>
          <div
            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-1"
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzJS11W-MN1l7GI7_9WxK6GlEG51RyG--SJFxavHwc7s3KWt5eCTf_jHNuOCgRY2CYh9DIOdq5ul8r4VqxjILaFTkgrlWZksLHwcPipmM0Ap4RvFn7wrD-7diHA9SFnobBmjLpDIpJLV6dA_Hp9AAePBfN7FsX2CRWAUQXzpLXXvDJ68ctLhQXVOzF1kKt1gP-ML7Ij_aNU-FzMarIeseevnmlWR1taSjUSKu-AxfNugi1d9VX7GGnsobehvRrKGKFb9AaFeRqE0Y")'}}
          />
        </div>
      </div>

      {/* Workout List Items */}
      <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="text-gray-900 dark:text-white flex items-center justify-center rounded-lg bg-white dark:bg-gray-800/50 shrink-0 size-12">
            <span className="material-symbols-outlined text-gradient-primary">directions_run</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Morning Cardio</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">30 min • Cardio</p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center justify-center rounded-full size-8 bg-green-500/20">
            <span className="material-symbols-outlined text-green-500 text-base">check</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="text-gray-900 dark:text-white flex items-center justify-center rounded-lg bg-white dark:bg-gray-800/50 shrink-0 size-12">
            <span className="material-symbols-outlined text-gradient-primary">self_improvement</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">Cool Down Yoga</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">15 min • Flexibility</p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="flex items-center justify-center rounded-full size-8 border-2 border-gray-300 dark:border-gray-600"></div>
        </div>
      </div>

      {/* Add Workout Section */}
      <div className="px-4 pt-6">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 p-8 text-center">
          <div className="flex items-center justify-center rounded-full size-16 bg-gradient-primary-br opacity-20">
            <span className="material-symbols-outlined text-gradient-primary text-3xl">add</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-900 dark:text-white text-base font-bold leading-tight">No more workouts today</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Add a new workout or enjoy your rest!</p>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 mt-2 bg-gradient-primary-br opacity-20 text-primary-start text-sm font-medium leading-normal">
            <span className="truncate">+ Add Workout</span>
          </button>
        </div>
      </div>

    </div>
  );
}
