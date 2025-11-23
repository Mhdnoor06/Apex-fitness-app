import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress - FitFlow",
  description: "Track your fitness progress and achievements",
};

export default function Progress() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Progress</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-2xl">person</span>
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800/50 p-1">
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-checked:bg-white has-checked:dark:bg-slate-800 has-checked:shadow-sm has-checked:text-slate-900 has-checked:dark:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-colors duration-200">
            <span className="truncate">Week</span>
            <input checked className="invisible w-0" name="timeframe-selector" type="radio" value="Week" />
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-checked:bg-white has-checked:dark:bg-slate-800 has-checked:shadow-sm has-checked:text-slate-900 has-checked:dark:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-colors duration-200">
            <span className="truncate">Month</span>
            <input className="invisible w-0" name="timeframe-selector" type="radio" value="Month" />
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-checked:bg-white has-checked:dark:bg-slate-800 has-checked:shadow-sm has-checked:text-slate-900 has-checked:dark:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-colors duration-200">
            <span className="truncate">Year</span>
            <input className="invisible w-0" name="timeframe-selector" type="radio" value="Year" />
          </label>
        </div>
      </div>

      {/* Weight Trend Chart */}
      <div className="px-4 py-2">
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Weight Trend</p>
          <p className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight truncate">75.2 kg</p>
          <div className="flex gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">This Week</p>
            <p className="text-red-500 dark:text-red-400 text-base font-medium leading-normal">-1.2%</p>
          </div>
          <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
            <svg fill="none" height="148" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_chart)"></path>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="url(#paint1_linear_chart)" strokeLinecap="round" strokeWidth="3"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chart" x1="236" x2="236" y1="1" y2="149">
                  <stop stopColor="#F45C43" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="#EB3349" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_chart" x1="0" x2="472" y1="75" y2="75">
                  <stop stopColor="#F45C43"></stop>
                  <stop offset="1" stopColor="#EB3349"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-around">
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Mon</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Tue</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Wed</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Thu</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Fri</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Sat</p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal tracking-[0.015em]">Sun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Steps Today</p>
          <p className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">8,450</p>
          <p className="text-green-500 dark:text-green-400 text-sm font-medium leading-normal">+5%</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">Active Calories</p>
          <p className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">320 kcal</p>
          <p className="text-red-500 dark:text-red-400 text-sm font-medium leading-normal">-2%</p>
        </div>
      </div>

      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-2">Daily Goals</h3>

      {/* Daily Goals Circles */}
      <div className="px-4 py-2">
        <div className="flex justify-around items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="stepsGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#F45C43', stopOpacity: 1}}></stop>
                    <stop offset="100%" style={{stopColor: '#EB3349', stopOpacity: 1}}></stop>
                  </linearGradient>
                </defs>
                <circle className="stroke-current text-slate-200 dark:text-slate-700" cx="50" cy="50" fill="transparent" r="45" strokeWidth="10"></circle>
                <circle className="-rotate-90 origin-center transform" cx="50" cy="50" fill="transparent" r="45" stroke="url(#stepsGradient)" strokeDasharray="283" strokeDashoffset="56.6" strokeLinecap="round" strokeWidth="10"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-gradient-primary text-3xl">directions_walk</span>
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-sm font-bold">8,450</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Steps</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-rose-500/20 dark:text-rose-400/20 stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeWidth="10"></circle>
                <circle className="text-rose-500 dark:text-rose-400 -rotate-90 origin-center transform stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="283" strokeDashoffset="99.05" strokeLinecap="round" strokeWidth="10"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-500 dark:text-rose-400 text-3xl">fitness_center</span>
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-sm font-bold">45 min</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Exercise</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-amber-500/20 dark:text-amber-400/20 stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeWidth="10"></circle>
                <circle className="text-amber-500 dark:text-amber-400 -rotate-90 origin-center transform stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="283" strokeDashoffset="28.3" strokeLinecap="round" strokeWidth="10"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-3xl">chair</span>
              </div>
            </div>
            <p className="text-slate-900 dark:text-white text-sm font-bold">10 hrs</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Stand</p>
          </div>
        </div>
      </div>

      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Recent Achievements</h3>

      {/* Achievements List */}
      <div className="flex flex-col gap-3 px-4 py-2">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary-br opacity-20">
            <span className="material-symbols-outlined text-gradient-primary text-3xl">emoji_events</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">New Personal Record: 5k Run</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">24:32 min</p>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">Yesterday</p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 dark:bg-rose-400/20 text-rose-500 dark:text-rose-400">
            <span className="material-symbols-outlined">local_fire_department</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-white">3 Workouts This Week</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Keep the streak going!</p>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">2 days ago</p>
        </div>
      </div>

      <div className="h-24"></div>

    </div>
  );
}
