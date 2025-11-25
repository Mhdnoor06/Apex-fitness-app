import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays } from "date-fns";

export interface CreateWorkoutInput {
  userId: string;
  name: string;
  description?: string;
  date?: Date;
  duration?: number;
  caloriesBurned?: number;
  notes?: string;
  exercises?: WorkoutExerciseInput[];
}

export interface WorkoutExerciseInput {
  exerciseId: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
  order?: number;
}

export interface UpdateWorkoutInput {
  name?: string;
  description?: string;
  date?: Date;
  duration?: number;
  caloriesBurned?: number;
  notes?: string;
  isCompleted?: boolean;
}

// Get workouts for a specific date
export async function getWorkoutsByDate(userId: string, date: Date) {
  const start = startOfDay(date);
  const end = endOfDay(date);

  return await prisma.workout.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

// Get workouts for a date range
export async function getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date) {
  return await prisma.workout.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay(startDate),
        lte: endOfDay(endDate),
      },
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

// Get workout by ID
export async function getWorkoutById(id: string, userId: string) {
  return await prisma.workout.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          ...(typeof (prisma as any).workoutSet !== 'undefined' && {
            workoutSets: {
              orderBy: {
                setNumber: "asc",
              },
            },
          }),
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

// Create workout
export async function createWorkout(data: CreateWorkoutInput) {
  return await prisma.workout.create({
    data: {
      userId: data.userId,
      name: data.name,
      description: data.description,
      date: data.date || new Date(),
      duration: data.duration,
      caloriesBurned: data.caloriesBurned,
      notes: data.notes,
      exercises: data.exercises
        ? {
            create: data.exercises.map((ex, index) => ({
              exerciseId: ex.exerciseId,
              sets: ex.sets || 3,
              reps: ex.reps,
              weight: ex.weight,
              duration: ex.duration,
              restTime: ex.restTime,
              notes: ex.notes,
              order: ex.order ?? index,
            })),
          }
        : undefined,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
      },
    },
  });
}

// Update workout
export async function updateWorkout(id: string, userId: string, data: UpdateWorkoutInput) {
  // Verify ownership
  const workout = await prisma.workout.findFirst({
    where: { id, userId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  return await prisma.workout.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date && { date: data.date }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.caloriesBurned !== undefined && { caloriesBurned: data.caloriesBurned }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
      },
    },
  });
}

// Delete workout
export async function deleteWorkout(id: string, userId: string) {
  // Verify ownership
  const workout = await prisma.workout.findFirst({
    where: { id, userId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  return await prisma.workout.delete({
    where: { id },
  });
}

// Add exercise to workout
export async function addExerciseToWorkout(
  workoutId: string,
  userId: string,
  exercise: WorkoutExerciseInput
) {
  // Verify workout ownership
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  // Get the current max order
  const maxOrder = await prisma.workoutExercise.findFirst({
    where: { workoutId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return await prisma.workoutExercise.create({
    data: {
      workoutId,
      exerciseId: exercise.exerciseId,
      sets: exercise.sets || 3,
      reps: exercise.reps,
      weight: exercise.weight,
      duration: exercise.duration,
      restTime: exercise.restTime,
      notes: exercise.notes,
      order: exercise.order ?? (maxOrder ? maxOrder.order + 1 : 0),
    },
    include: {
      exercise: true,
    },
  });
}

// Update workout exercise
export async function updateWorkoutExercise(
  id: string,
  workoutId: string,
  userId: string,
  data: Partial<WorkoutExerciseInput> & { isCompleted?: boolean }
) {
  // Verify workout ownership
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  return await prisma.workoutExercise.update({
    where: { id },
    data: {
      ...(data.sets !== undefined && { sets: data.sets }),
      ...(data.reps !== undefined && { reps: data.reps }),
      ...(data.weight !== undefined && { weight: data.weight }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.restTime !== undefined && { restTime: data.restTime }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    },
    include: {
      exercise: true,
    },
  });
}

// Remove exercise from workout
export async function removeExerciseFromWorkout(
  id: string,
  workoutId: string,
  userId: string
) {
  // Verify workout ownership
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!workout) {
    throw new Error("Workout not found");
  }

  return await prisma.workoutExercise.delete({
    where: { id },
  });
}

// Get workout statistics for date range
export async function getWorkoutStats(userId: string, days: number = 7) {
  const startDate = subDays(new Date(), days - 1);
  const workouts = await getWorkoutsByDateRange(userId, startDate, new Date());

  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter((w) => w.isCompleted).length;
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  return {
    totalWorkouts,
    completedWorkouts,
    totalDuration,
    totalCalories,
    avgDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
    avgCalories: totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0,
    completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0,
  };
}

// Mark workout as complete
export async function completeWorkout(id: string, userId: string) {
  return await updateWorkout(id, userId, { isCompleted: true });
}
