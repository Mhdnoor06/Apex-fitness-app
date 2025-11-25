"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  instructions?: string;
}

interface WorkoutSet {
  id?: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  isCompleted?: boolean;
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  order: number;
  isCompleted: boolean;
  exercise: Exercise;
  workoutSets?: WorkoutSet[];
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  date: string;
  duration?: number;
  isCompleted: boolean;
  exercises: WorkoutExercise[];
}

export default function StartWorkout() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params.id as string;
  const isEditMode = searchParams?.get('edit') === 'true';

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<{ [key: string]: { sets: number; reps: number | null; weight: number | null }[] }>({});

  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  const fetchWorkout = async () => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`);
      if (!response.ok) throw new Error("Failed to fetch workout");
      
      const data = await response.json();
      setWorkout(data.workout);
      
      // Initialize exercise logs - use workoutSets if available (for edit mode), otherwise use defaults
      const logs: { [key: string]: { sets: number; reps: number | null; weight: number | null }[] } = {};
      data.workout.exercises.forEach((ex: WorkoutExercise) => {
        logs[ex.id] = [];
        // If workout has sets data, use it; otherwise initialize with defaults
        if (ex.workoutSets && ex.workoutSets.length > 0) {
          ex.workoutSets.forEach((set) => {
            logs[ex.id].push({
              sets: set.setNumber,
              reps: set.reps,
              weight: set.weight,
            });
          });
        } else {
          // Initialize with default sets
          for (let i = 0; i < ex.sets; i++) {
            logs[ex.id].push({ sets: i + 1, reps: ex.reps, weight: ex.weight });
          }
        }
      });
      setExerciseLogs(logs);
    } catch (error) {
      console.error("Error fetching workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = workout?.exercises[currentExerciseIndex];
  const currentLogs = currentExercise ? exerciseLogs[currentExercise.id] || [] : [];

  const updateLog = (exerciseId: string, setIndex: number, field: "reps" | "weight", value: number | null) => {
    setExerciseLogs(prev => {
      const newLogs = { ...prev };
      if (!newLogs[exerciseId]) newLogs[exerciseId] = [];
      if (!newLogs[exerciseId][setIndex]) {
        newLogs[exerciseId][setIndex] = { sets: setIndex + 1, reps: null, weight: null };
      }
      newLogs[exerciseId][setIndex][field] = value;
      return newLogs;
    });
  };

  const saveExercise = async () => {
    if (!currentExercise) return;

    try {
      // Get logs for this exercise - all individual sets
      const logs = exerciseLogs[currentExercise.id] || [];
      
      // Prepare sets data with set numbers
      const sets = logs.map((log, index) => ({
        setNumber: log.sets || index + 1,
        reps: log.reps !== null && log.reps !== undefined ? log.reps : null,
        weight: log.weight !== null && log.weight !== undefined ? log.weight : null,
        isCompleted: log.reps !== null || log.weight !== null, // Mark as completed if has data
      }));

      // Calculate average values for backward compatibility
      const validLogs = logs.filter(log => log.reps !== null || log.weight !== null);
      const avgReps = validLogs.length > 0 
        ? Math.round(validLogs.reduce((sum, log) => sum + (log.reps || 0), 0) / validLogs.length)
        : null;
      const avgWeight = validLogs.length > 0
        ? validLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / validLogs.length
        : null;

      // Save all individual sets and mark exercise as completed
      const response = await fetch(`/api/workouts/${workoutId}/exercises/${currentExercise.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sets, // Send all individual sets
          reps: avgReps, // Also send averages for backward compatibility
          weight: avgWeight,
          isCompleted: true 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save exercise");
      }

      // In edit mode, save all exercises and return
      if (isEditMode) {
        // Save all remaining exercises
        for (let i = currentExerciseIndex + 1; i < (workout?.exercises.length || 0); i++) {
          const ex = workout?.exercises[i];
          if (!ex) continue;
          
          const exLogs = exerciseLogs[ex.id] || [];
          const exSets = exLogs.map((log, idx) => ({
            setNumber: log.sets || idx + 1,
            reps: log.reps !== null && log.reps !== undefined ? log.reps : null,
            weight: log.weight !== null && log.weight !== undefined ? log.weight : null,
            isCompleted: log.reps !== null || log.weight !== null,
          }));

          const validExLogs = exLogs.filter(log => log.reps !== null || log.weight !== null);
          const exAvgReps = validExLogs.length > 0 
            ? Math.round(validExLogs.reduce((sum, log) => sum + (log.reps || 0), 0) / validExLogs.length)
            : null;
          const exAvgWeight = validExLogs.length > 0
            ? validExLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / validExLogs.length
            : null;

          await fetch(`/api/workouts/${workoutId}/exercises/${ex.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sets: exSets,
              reps: exAvgReps,
              weight: exAvgWeight,
              isCompleted: true,
            }),
          });
        }
        
        router.push("/workouts");
        return;
      }

      // Normal mode: Move to next exercise or complete workout
      if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        // Complete workout
        const workoutResponse = await fetch(`/api/workouts/${workoutId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isCompleted: true }),
        });
        
        if (!workoutResponse.ok) {
          throw new Error("Failed to complete workout");
        }
        
        router.push("/workouts");
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      alert(error instanceof Error ? error.message : "Failed to save exercise. Please try again.");
    }
  };

  // Alias for backward compatibility
  const completeExercise = saveExercise;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 animate-pulse">
            fitness_center
          </span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workout || !currentExercise) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Workout not found</p>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

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
          {isEditMode ? 'Edit Workout' : workout.name}
        </h1>
        <div className="flex w-12 items-center justify-end gap-2">
          {isEditMode && workout.exercises.length > 1 && (
            <>
              <button
                onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                disabled={currentExerciseIndex === 0}
                className="flex items-center justify-center rounded-lg size-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentExerciseIndex(Math.min(workout.exercises.length - 1, currentExerciseIndex + 1))}
                disabled={currentExerciseIndex === workout.exercises.length - 1}
                className="flex items-center justify-center rounded-lg size-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </>
          )}
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {currentExerciseIndex + 1}/{workout.exercises.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4 shrink-0">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 py-4 pb-52">
          {/* Exercise Info */}
          <div className="mb-6">
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-2">
              {currentExercise.exercise.name}
            </h2>
            {currentExercise.exercise.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {currentExercise.exercise.description}
              </p>
            )}
            {currentExercise.exercise.imageUrl && (
              <div
                className="w-full h-64 rounded-xl bg-cover bg-center mb-4"
                style={{ backgroundImage: `url("${currentExercise.exercise.imageUrl}")` }}
              />
            )}
          </div>

          {/* Sets Logging */}
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
              Log Your Sets
            </h3>
            {currentLogs.map((log, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-900 dark:text-white font-medium">
                    Set {log.sets}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-xs mb-1 block">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={log.reps || ""}
                      onChange={(e) =>
                        updateLog(
                          currentExercise.id,
                          index,
                          "reps",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-start"
                      />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-xs mb-1 block">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={log.weight || ""}
                      onChange={(e) =>
                        updateLog(
                          currentExercise.id,
                          index,
                          "weight",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-start"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Button - Positioned above bottom navigation (80px) */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pt-4 pb-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 z-40 shadow-lg">
        <button
          onClick={completeExercise}
          className="w-full bg-gradient-primary-br text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">check</span>
          <span>
            {isEditMode
              ? "Save Changes"
              : currentExerciseIndex < workout.exercises.length - 1
              ? "Complete & Next Exercise"
              : "Complete Workout"}
          </span>
        </button>
      </div>
    </div>
  );
}

