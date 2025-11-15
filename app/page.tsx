import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden pb-24">
      {/* Header Section */}
      <div className="flex flex-col gap-2 bg-background-light dark:bg-background-dark p-4 pb-2 sticky top-0 z-10">
        <div className="flex items-center h-12 justify-between">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgqF1UxaoQ-3s8YjhUOHsmb8VW-QsRuTGuPYaqhUfsw6ByYhYeVekrgxSMmS6F13SP5ek2BB55rU_z3QxcSo2v4dM75q8KX6LNDVfSEzarwA-UMI4XQqpsYQHPzcM5LwWk-BzsGgce9u-SiWhZi18YsET4U66Pr3W7yXTrwRIjvnrFOBg7mrJ4MswFKxwEdq4cGl_YMzO5G0cNNljT4aW7MyV1QoUl3-GK3PIWIjO97vIsEwMogLRGRcFZwvhORQZ_JERdhpwjCl8")'}}
            />
          </div>
          <div className="flex w-auto items-center justify-end gap-2">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/10 text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/10 text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
          </div>
        </div>
        <p className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight">Good Morning, Alex</p>
        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-1">Tuesday, 28 May</p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800/50 shadow-sm">
          <span className="material-symbols-outlined text-primary-start text-3xl">footprint</span>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">Steps</p>
            <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">6,540</p>
          </div>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800/50 shadow-sm">
          <span className="material-symbols-outlined text-primary-start text-3xl">local_fire_department</span>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">Calories</p>
            <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">350 kcal</p>
          </div>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-800/50 shadow-sm">
          <span className="material-symbols-outlined text-primary-start text-3xl">timer</span>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">Active Time</p>
            <p className="text-slate-900 dark:text-white tracking-light text-2xl font-bold leading-tight">45 min</p>
          </div>
        </div>
      </div>

      {/* Today's Plan Card */}
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800/50">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover"
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_Gp03KjIh1T_PXrsNMl1DeJkELS3l-QVbcByxJ8ebnfVgO2Tl827a6ZkdkKJoYIqqhNjWpIB19QS_lc9JQtIZfeqrTJGQwrwtFZ4n2T9Jmfj0faXJ9BrWg_Fu29lbSR09rHuLZ7t3fI0K4pf2-X5H1KZ93iHqZJhbcRsC0PDxEfDfAXuVJPqS1ohw85ld1_UT4_Q2IRVj81nTsjQHz8Omk5ZCVUEHIhKzV3_MdOJN9uDcCowopIxF9_pp8CdkdMKAcvYtfGaXCDk")'}}
          />
          <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Today&apos;s Plan</p>
            <p className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Full Body Strength</p>
            <div className="flex items-end gap-3 justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">35 min • Intermediate</p>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-to-r from-primary-start to-primary-end text-white text-sm font-medium leading-normal shadow-[0_4px_15px_0_rgba(244,92,67,0.3)] hover:shadow-[0_4px_20px_0_rgba(235,51,73,0.4)] transition-shadow duration-300">
                <span className="truncate">Start Workout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="flex flex-wrap gap-4 px-4 py-2">
        <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl bg-white dark:bg-slate-800/50 p-6 shadow-sm">
          <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Weekly Activity</p>
          <p className="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">320 min</p>
          <div className="flex gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Last 7 Days</p>
            <p className="text-green-500 dark:text-green-400 text-base font-medium leading-normal">+15%</p>
          </div>
          <div className="grid min-h-[180px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '40%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Mon</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '70%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Tue</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '50%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Wed</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start to-primary-end" style={{height: '85%'}}></div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-primary-end text-[13px] font-bold leading-normal">Thu</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '50%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Fri</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '60%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Sat</p>
            <div className="w-full rounded-t-lg bg-gradient-to-t from-primary-start/20 to-primary-end/20 dark:from-primary-start/30 dark:to-primary-end/30" style={{height: '30%'}}></div>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-bold leading-normal">Sun</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
          <button className="inline-flex flex-col items-center justify-center px-5 text-transparent bg-clip-text bg-gradient-to-r from-primary-start to-primary-end" type="button">
            <span className="material-symbols-outlined text-2xl mb-1">home</span>
            <span className="text-xs font-bold">Home</span>
          </button>
          <button className="inline-flex flex-col items-center justify-center px-5 text-slate-500 dark:text-slate-400 hover:text-primary-start" type="button">
            <span className="material-symbols-outlined text-2xl mb-1">fitness_center</span>
            <span className="text-xs font-medium">Workouts</span>
          </button>
          <button className="inline-flex flex-col items-center justify-center px-5 text-slate-500 dark:text-slate-400 hover:text-primary-start" type="button">
            <span className="material-symbols-outlined text-2xl mb-1">bar_chart</span>
            <span className="text-xs font-medium">Progress</span>
          </button>
          <button className="inline-flex flex-col items-center justify-center px-5 text-slate-500 dark:text-slate-400 hover:text-primary-start" type="button">
            <span className="material-symbols-outlined text-2xl mb-1">groups</span>
            <span className="text-xs font-medium">Community</span>
          </button>
          <button className="inline-flex flex-col items-center justify-center px-5 text-slate-500 dark:text-slate-400 hover:text-primary-start" type="button">
            <span className="material-symbols-outlined text-2xl mb-1">person</span>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
