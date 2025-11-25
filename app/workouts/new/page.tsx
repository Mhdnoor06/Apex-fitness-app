"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  schedule: {
    [key: number]: string; // 0 = Sunday, 1 = Monday, etc.
  };
  icon: string;
  gradient: string;
}

const workoutPlans: WorkoutPlan[] = [
  {
    id: "push-pull-legs",
    name: "Push/Pull/Legs",
    description: "Classic 6-day split focusing on pushing, pulling, and leg movements",
    duration: "6 days/week",
    difficulty: "Intermediate",
    schedule: {
      1: "Push (Chest, Shoulders, Triceps)",
      2: "Pull (Back, Biceps)",
      3: "Legs (Quads, Hamstrings, Glutes)",
      4: "Push (Chest, Shoulders, Triceps)",
      5: "Pull (Back, Biceps)",
      6: "Legs (Quads, Hamstrings, Glutes)",
    },
    icon: "fitness_center",
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: "full-body",
    name: "Full Body",
    description: "Complete body workout 3-4 times per week",
    duration: "3-4 days/week",
    difficulty: "Beginner",
    schedule: {
      1: "Full Body Strength",
      3: "Full Body Strength",
      5: "Full Body Strength",
    },
    icon: "accessibility_new",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "upper-lower",
    name: "Upper/Lower Split",
    description: "Alternate between upper and lower body workouts",
    duration: "4 days/week",
    difficulty: "Intermediate",
    schedule: {
      1: "Upper Body",
      2: "Lower Body",
      4: "Upper Body",
      5: "Lower Body",
    },
    icon: "sports_gymnastics",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "bro-split",
    name: "Bro Split",
    description: "One muscle group per day, 5-6 days per week",
    duration: "5-6 days/week",
    difficulty: "Advanced",
    schedule: {
      1: "Chest",
      2: "Back",
      3: "Shoulders",
      4: "Arms",
      5: "Legs",
    },
    icon: "sports_martial_arts",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    id: "cardio-strength",
    name: "Cardio + Strength",
    description: "Balanced mix of cardio and strength training",
    duration: "5 days/week",
    difficulty: "Beginner",
    schedule: {
      1: "Cardio",
      2: "Strength Training",
      3: "Cardio",
      4: "Strength Training",
      5: "Cardio",
    },
    icon: "directions_run",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "5x5",
    name: "5x5 Stronglifts",
    description: "Simple and effective strength program with 5 sets of 5 reps",
    duration: "3 days/week",
    difficulty: "Beginner",
    schedule: {
      1: "5x5 Workout A (Squat, Bench, Row)",
      3: "5x5 Workout B (Squat, Overhead Press, Deadlift)",
      5: "5x5 Workout A (Squat, Bench, Row)",
    },
    icon: "weight",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function NewWorkoutPlan() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  const handleSelectPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;

    try {
      // Save the selected plan to user's profile/workout plan
      const response = await fetch("/api/workouts/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          schedule: selectedPlan.schedule,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save workout plan");
      }

      // Redirect back to workouts page
      router.push("/workouts");
    } catch (error) {
      console.error("Error saving workout plan:", error);
      alert("Failed to save workout plan. Please try again.");
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex size-12 shrink-0 items-center justify-start"
        >
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">
            arrow_back
          </span>
        </button>
        <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Select Workout Plan
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 py-4 pb-40">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Choose a workout plan that fits your goals and schedule. We'll create a personalized workout schedule based on your selection.
          </p>

          {/* Workout Plan Cards */}
          <div className="space-y-3 pb-4">
            {workoutPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                  selectedPlan?.id === plan.id
                    ? "border-primary-start bg-primary-start/10 dark:bg-primary-start/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-primary-start/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} size-12 shrink-0`}>
                    <span className="material-symbols-outlined text-white text-2xl">
                      {plan.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-gray-900 dark:text-white text-base font-bold leading-tight">
                        {plan.name}
                      </h3>
                      {selectedPlan?.id === plan.id && (
                        <span className="material-symbols-outlined text-primary-start text-xl shrink-0">
                          check_circle
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                      {plan.description}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {plan.duration}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {plan.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schedule Preview */}
                {selectedPlan?.id === plan.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Weekly Schedule:
                    </p>
                    <div className="space-y-1">
                      {Object.entries(plan.schedule).map(([day, workout]) => (
                        <div key={day} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">
                            {getDayName(parseInt(day))}:
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {workout}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Button */}
      {selectedPlan && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 z-10">
          <button
            onClick={handleConfirm}
            className="w-full bg-gradient-primary-br text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check</span>
            <span>Start {selectedPlan.name} Plan</span>
          </button>
        </div>
      )}
    </div>
  );
}

