import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserProfile } from "@/lib/services/user.service";
import { getTodayActivity, getWeeklyActivitySummary } from "@/lib/services/activity.service";
import { getTodayNutritionSummary } from "@/lib/services/nutrition.service";
import { HomeHeader } from "@/components/home-header";

export default async function Home() {
  const session = await auth();

  // Fetch data using service layer
  const user = session?.user?.id ? await getUserProfile(session.user.id) : null;
  const todayActivity = session?.user?.id ? await getTodayActivity(session.user.id) : { steps: 0, activeMinutes: 0, caloriesBurned: null, distance: null, userId: '', date: new Date() };
  const weeklyActivityData = session?.user?.id ? await getWeeklyActivitySummary(session.user.id) : null;
  const nutritionSummary = session?.user?.id ? await getTodayNutritionSummary(session.user.id) : null;

  // Transform weekly activity data for the chart
  const weeklyActivity = weeklyActivityData
    ? (() => {
        const maxMinutes = Math.max(...weeklyActivityData.weekData.map(d => d.activeMinutes), 1);
        return {
          totalMinutes: weeklyActivityData.totalActiveMinutes,
          weekData: weeklyActivityData.weekData.map((day, index) => ({
            dayName: day.dayName,
            minutes: day.activeMinutes,
            percentage: maxMinutes > 0 ? (day.activeMinutes / maxMinutes) * 100 : 0,
            isToday: index === weeklyActivityData.weekData.length - 1,
          })),
        };
      })()
    : { totalMinutes: 0, weekData: [] };
  
  const userName = user?.name || session?.user?.name || "User";
  const targetCalories = user?.targetCalories || 0;
  const targetProtein = user?.targetProtein || 0;
  const steps = todayActivity.steps || 0;
  const activeMinutes = todayActivity.activeMinutes || 0;
  
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
        <HomeHeader userName={userName} />
      </div>

      {/* Nutrition Cards */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold">Today&apos;s Nutrition</h2>
          <Link
            href="/nutrition"
            className="text-primary-start text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        <Link href="/nutrition" className="block">
          <div className="grid grid-cols-1 gap-4">
            {/* Calories Card */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-start text-3xl">restaurant</span>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-semibold">Calories</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {nutritionSummary?.caloriesConsumed || 0} / {nutritionSummary?.targetCalories || 0} kcal
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 dark:text-white text-2xl font-bold">
                    {nutritionSummary?.caloriesRemaining || 0}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">remaining</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(nutritionSummary?.caloriesProgress || 0, 100)}%` }}
                ></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {nutritionSummary?.caloriesProgress.toFixed(0) || 0}% of daily goal
              </p>
            </div>

            {/* Protein Card */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-start text-3xl">fitness_center</span>
                  <div>
                    <p className="text-slate-900 dark:text-white text-base font-semibold">Protein</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {nutritionSummary?.proteinConsumed || 0} / {nutritionSummary?.targetProtein || 0} g
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 dark:text-white text-2xl font-bold">
                    {nutritionSummary?.proteinRemaining || 0}g
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">remaining</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(nutritionSummary?.proteinProgress || 0, 100)}%` }}
                ></div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {nutritionSummary?.proteinProgress.toFixed(0) || 0}% of daily goal
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-3 rounded-xl p-4 sm:p-6 bg-slate-800/50 dark:bg-slate-800/50 min-w-0">
          <span className="material-symbols-outlined text-primary-start text-2xl sm:text-3xl">footprint</span>
          <p className="text-white text-sm sm:text-base font-normal">Steps</p>
          <p className="text-white text-xl sm:text-2xl font-bold leading-tight">{steps.toLocaleString()}</p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl p-4 sm:p-6 bg-slate-800/50 dark:bg-slate-800/50 min-w-0">
          <span className="material-symbols-outlined text-primary-start text-2xl sm:text-3xl">timer</span>
          <p className="text-white text-sm sm:text-base font-normal">Active Time</p>
          <p className="text-white text-xl sm:text-2xl font-bold leading-tight">{activeMinutes} min</p>
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
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gradient-primary text-white text-sm font-medium leading-normal shadow-[0_4px_15px_0_rgba(244,92,67,0.3)] hover:shadow-[0_4px_20px_0_rgba(235,51,73,0.4)] transition-shadow duration-300">
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
          <p className="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
            {weeklyActivity.totalMinutes} min
          </p>
          <div className="flex gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Last 7 Days</p>
          </div>
          <div className="grid min-h-[180px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
            {weeklyActivity.weekData.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1 w-full">
                <div 
                  className={`w-full rounded-t-lg ${
                    day.isToday 
                      ? "bg-gradient-primary-t" 
                      : "bg-gradient-primary-t opacity-20 dark:opacity-30"
                  }`}
                  style={{height: `${Math.max(day.percentage, 5)}%`}}
                ></div>
                <p className={`text-[13px] font-bold leading-normal ${
                  day.isToday 
                    ? "text-gradient-primary" 
                    : "text-slate-500 dark:text-slate-400"
                }`}>
                  {day.dayName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
