import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST - Save user's workout plan
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId, planName, schedule } = body;

    if (!planId || !planName || !schedule) {
      return NextResponse.json(
        { error: "Plan ID, name, and schedule are required" },
        { status: 400 }
      );
    }

    // Store plan info in User model (we'll add these fields later or use a JSON field)
    // For now, we'll just generate the workouts based on the schedule
    const userPlan = {
      userId: session.user.id,
      planId,
      planName,
      schedule,
    };

    // Generate workouts for the current week based on the plan
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    // Helper function to map workout name to exercise categories
    const getExerciseCategoriesForWorkout = (workoutName: string): string[] => {
      const name = workoutName.toLowerCase();
      if (name.includes("push") || name.includes("chest") || name.includes("shoulders") || name.includes("triceps")) {
        return ["chest", "shoulders", "arms"];
      }
      if (name.includes("pull") || name.includes("back") || name.includes("biceps")) {
        return ["back", "arms"];
      }
      if (name.includes("legs") || name.includes("lower")) {
        return ["legs"];
      }
      if (name.includes("upper")) {
        return ["chest", "back", "shoulders", "arms"];
      }
      if (name.includes("full body") || name.includes("5x5")) {
        return ["chest", "back", "legs", "shoulders", "arms", "core"];
      }
      if (name.includes("cardio")) {
        return ["cardio"];
      }
      if (name.includes("strength")) {
        return ["chest", "back", "legs", "shoulders", "arms"];
      }
      // Default: return all categories
      return ["chest", "back", "legs", "shoulders", "arms", "core"];
    };

    // Create workouts for the week based on schedule
    const workoutsToCreate = [];
    
    // Normalize schedule keys - convert all keys to numbers for consistent lookup
    const normalizedSchedule: { [key: number]: string } = {};
    for (const [key, value] of Object.entries(schedule)) {
      const numKey = parseInt(key, 10);
      if (!isNaN(numKey)) {
        normalizedSchedule[numKey] = value as string;
      }
    }
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0); // Set to start of day
      const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, etc.
      
      // Schedule uses 1=Monday, 2=Tuesday, etc. (no Sunday=0)
      // Check if schedule has workout for this day
      let workoutName = null;
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        workoutName = normalizedSchedule[dayOfWeek];
      }
      
      if (workoutName) {
        workoutsToCreate.push({
          userId: session.user.id,
          name: workoutName,
          date: date,
          duration: 45, // Default duration
          description: `Part of ${planName} plan`,
        });
      }
    }

    // Delete existing workouts for this week and create new ones
    const weekStart = new Date(monday);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    await prisma.workout.deleteMany({
      where: {
        userId: session.user.id,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Create workouts and assign exercises
    for (const workoutData of workoutsToCreate) {
      const workout = await prisma.workout.create({
        data: workoutData,
      });

      // Get exercise categories for this workout
      const categories = getExerciseCategoriesForWorkout(workoutData.name);
      
      // Get exercises from those categories (limit to 6-8 exercises per workout)
      const exercises = await prisma.exercise.findMany({
        where: {
          category: { in: categories },
          isCustom: false, // Only use system exercises
        },
        take: 8, // Limit exercises per workout
        orderBy: {
          name: "asc",
        },
      });

      // Create WorkoutExercise records
      if (exercises.length > 0) {
        const workoutExercises = exercises.map((exercise: { id: string; category: string }, index: number) => ({
          workoutId: workout.id,
          exerciseId: exercise.id,
          sets: exercise.category === "cardio" ? 1 : 3,
          reps: exercise.category === "cardio" ? null : 10,
          order: index,
          isCompleted: false,
        }));

        await prisma.workoutExercise.createMany({
          data: workoutExercises,
        });
      }
    }

    return NextResponse.json({ plan: userPlan }, { status: 201 });
  } catch (error) {
    console.error("Save workout plan error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save workout plan";
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : String(error) },
      { status: 500 }
    );
  }
}

// GET - Get user's current workout plan (inferred from existing workouts)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return null - plan info can be stored client-side
    // In the future, we can add planId to User model or create UserWorkoutPlan model
    return NextResponse.json({ plan: null });
  } catch (error) {
    console.error("Get workout plan error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout plan" },
      { status: 500 }
    );
  }
}

