"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Workout {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  category?: string;
  imageUrl?: string;
  completed?: boolean;
  date?: Date;
}

export default function Workouts() {
  const router = useRouter();
  // Initialize selectedDate normalized to start of day
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<{ planId?: string; planName?: string } | null>(null);

  // Generate week dates starting from Monday
  const weekDates = useMemo(() => {
    const today = new Date();
    // Normalize to start of day to avoid timezone issues
    today.setHours(0, 0, 0, 0);
    const currentDay = today.getDay();
    // Get Monday of current week (0 = Sunday, 1 = Monday, etc.)
    // Sunday (0) should go back 6 days, Monday (1) stays same, Tuesday (2) goes back 1, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    // Ensure monday is normalized to start of day
    monday.setHours(0, 0, 0, 0);

    const dates = [];
    // Use milliseconds to add days for more reliable date arithmetic
    const oneDayMs = 24 * 60 * 60 * 1000;
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday.getTime() + i * oneDayMs);
      // Ensure each date is normalized to start of day (should already be at 00:00:00)
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }, []);

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return (
      compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear()
    );
  };

  // Fetch workouts for selected date
  useEffect(() => {
    fetchWorkouts();
  }, [selectedDate]);

  // Fetch current plan on mount
  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/workouts/plan');
      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setCurrentPlan(data.plan);
        } else {
          // Try to infer plan name from workouts description
          // This is a fallback since the API currently returns null
          setCurrentPlan(null);
        }
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
    }
  };

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Format date in local time to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const response = await fetch(`/api/workouts?date=${dateStr}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      
      const data = await response.json();
      // Map isCompleted from API to completed for frontend
      const mappedWorkouts = (data.workouts || []).map((w: any) => ({
        ...w,
        completed: w.isCompleted || false,
      }));
      setWorkouts(mappedWorkouts);
      
      // Try to infer plan name from workout description if available
      if (data.workouts && data.workouts.length > 0) {
        const workout = data.workouts.find((w: any) => w.description && w.description.includes('plan'));
        if (workout && workout.description) {
          const planMatch = workout.description.match(/Part of (.+?) plan/);
          if (planMatch && planMatch[1]) {
            const planName = planMatch[1];
            // Update plan if we don't have one or if it changed
            setCurrentPlan((prev) => {
              if (!prev || prev.planName !== planName) {
                return { planName };
              }
              return prev;
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts');
      // Fallback to sample data for demo
      setWorkouts([
        {
          id: '1',
          name: 'Full Body Strength',
          duration: 45,
          category: 'Full Body',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzJS11W-MN1l7GI7_9WxK6GlEG51RyG--SJFxavHwc7s3KWt5eCTf_jHNuOCgRY2CYh9DIOdq5ul8r4VqxjILaFTkgrlWZksLHwcPipmM0Ap4RvFn7wrD-7diHA9SFnobBmjLpDIpJLV6dA_Hp9AAePBfN7FsX2CRWAUQXzpLXXvDJ68ctLhQXVOzF1kKt1gP-ML7Ij_aNU-FzMarIeseevnmlWR1taSjUSKu-AxfNugi1d9VX7GGnsobehvRrKGKFb9AaFeRqE0Y',
          completed: false,
        },
        {
          id: '2',
          name: 'Morning Cardio',
          duration: 30,
          category: 'Cardio',
          completed: true,
        },
        {
          id: '3',
          name: 'Cool Down Yoga',
          duration: 15,
          category: 'Flexibility',
          completed: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = (workoutId: string) => {
    router.push(`/workouts/${workoutId}/start`);
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to complete workout');
      }

      // Refresh workouts
      fetchWorkouts();
    } catch (err) {
      console.error('Error completing workout:', err);
      alert('Failed to complete workout');
    }
  };

  const handleAddWorkout = () => {
    router.push('/workouts/new');
  };

  const handleChangePlan = () => {
    router.push('/workouts/new');
  };

  const handleEditWorkout = (workoutId: string) => {
    router.push(`/workouts/${workoutId}/start?edit=true`);
  };

  // Listen for focus event to refresh plan when returning from plan selection
  useEffect(() => {
    const handleFocus = () => {
      fetchCurrentPlan();
      // Only refresh workouts if we're on today's date to avoid disrupting user's selection
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      if (selected.getTime() === today.getTime()) {
        fetchWorkouts();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedDate]);
  // Get featured workout (first incomplete workout)
  const featuredWorkout = workouts.find(w => !w.completed);
  const otherWorkouts = workouts.filter(w => w.id !== featuredWorkout?.id);
  return (
    <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between shrink-0 z-10">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">
            menu
          </span>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">My Plan</h1>
          {currentPlan?.planName && (
            <p className="text-gray-500 dark:text-gray-400 text-xs font-normal mt-0.5">{currentPlan.planName}</p>
          )}
        </div>
        <div className="flex w-12 items-center justify-end gap-2">
          <button 
            onClick={handleChangePlan}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-transparent text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Change Plan"
          >
            <span className="material-symbols-outlined text-xl">
              swap_horiz
            </span>
          </button>
        </div>
      </div>

      {/* Date Picker - Fixed */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weekDates.map((date, index) => {
            const selected = isSelected(date);
            const today = isToday(date);
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex h-16 shrink-0 w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-all ${
                  selected
                    ? "bg-gradient-primary-br text-white shadow-lg"
                    : "bg-transparent text-gray-500 dark:text-gray-400"
                } ${today && !selected ? "ring-2 ring-primary-start" : ""}`}
              >
                <p className={`text-xs ${selected ? "font-bold" : "font-medium"}`}>
                  {dayNames[index]}
                </p>
                <p className={`text-base ${selected ? "font-bold" : "font-medium"}`}>
                  {date.getDate()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto min-h-0 pb-24">
        <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-2">
          {isToday(selectedDate) ? "Today's Workouts" : "Workouts"}
        </h2>

        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 animate-pulse">
                fitness_center
              </span>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading workouts...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="px-4 pb-4">
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Featured Workout */}
            {featuredWorkout && (
              <div className="px-4 pb-4">
                <div className={`flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-gray-800/50 p-4 shadow-sm ${featuredWorkout.completed ? 'ring-2 ring-green-500/50' : ''}`}>
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 dark:text-white text-base font-bold leading-tight">{featuredWorkout.name}</p>
                        {featuredWorkout.completed && (
                          <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                        {featuredWorkout.duration} min • {featuredWorkout.category || 'Workout'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {featuredWorkout.completed ? (
                        <button
                          onClick={() => handleEditWorkout(featuredWorkout.id)}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium leading-normal w-fit hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm mr-1">edit</span>
                          <span className="truncate">Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartWorkout(featuredWorkout.id)}
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 flex-row-reverse bg-gradient-primary-br text-white text-sm font-medium leading-normal w-fit shadow-md hover:shadow-lg transition-shadow"
                        >
                          <span className="truncate">Start</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {featuredWorkout.imageUrl && (
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-1"
                      style={{backgroundImage: `url("${featuredWorkout.imageUrl}")`}}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Other Workout List Items */}
            {otherWorkouts.map((workout) => (
              <div
                key={workout.id}
                className={`flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors ${workout.completed ? '' : 'cursor-pointer'}`}
                onClick={() => !workout.completed && handleStartWorkout(workout.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-900 dark:text-white flex items-center justify-center rounded-lg bg-white dark:bg-gray-800/50 shrink-0 size-12">
                    <span className="material-symbols-outlined text-gradient-primary">
                      {workout.category === 'Cardio' ? 'directions_run' : 
                       workout.category === 'Flexibility' ? 'self_improvement' : 
                       'fitness_center'}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{workout.name}</p>
                      {workout.completed && (
                        <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                      {workout.duration} min • {workout.category || 'Workout'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {workout.completed ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkout(workout.id);
                        }}
                        className="flex items-center justify-center rounded-lg size-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Edit workout"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <div className="flex items-center justify-center rounded-full size-8 bg-green-500/20">
                        <span className="material-symbols-outlined text-green-500 text-base">check</span>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteWorkout(workout.id);
                      }}
                      className="flex items-center justify-center rounded-full size-8 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-start transition-colors"
                    >
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Add Workout Section - Show when no workouts or all completed */}
        {(!loading && workouts.length === 0) || (workouts.length > 0 && workouts.every(w => w.completed)) ? (
          <div className="px-4 pt-6 pb-6">
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 p-8 text-center">
              <div className="flex items-center justify-center rounded-full size-16 bg-gradient-primary-br opacity-20">
                <span className="material-symbols-outlined text-gradient-primary text-3xl">add</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-900 dark:text-white text-base font-bold leading-tight">No more workouts {isToday(selectedDate) ? 'today' : 'for this day'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Add a new workout or enjoy your rest!</p>
              </div>
              <button
                onClick={handleAddWorkout}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 mt-2 bg-gradient-primary-br text-white text-sm font-medium leading-normal hover:shadow-lg transition-shadow"
              >
                <span className="truncate">+ Add Workout</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
