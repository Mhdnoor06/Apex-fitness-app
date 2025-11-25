import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getWorkoutsByDate,
  getWorkoutsByDateRange,
  createWorkout,
} from "@/lib/services/workout.service";
import { startOfDay, subDays } from "date-fns";

// GET - Get workouts by date or date range
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const daysParam = searchParams.get("days");

    let workouts;

    if (dateParam) {
      // Get workouts for specific date
      const date = new Date(dateParam);
      workouts = await getWorkoutsByDate(session.user.id, date);
    } else if (startDateParam && endDateParam) {
      // Get workouts for date range
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      workouts = await getWorkoutsByDateRange(session.user.id, startDate, endDate);
    } else if (daysParam) {
      // Get workouts for last N days
      const days = parseInt(daysParam, 10);
      const startDate = subDays(new Date(), days - 1);
      workouts = await getWorkoutsByDateRange(session.user.id, startDate, new Date());
    } else {
      // Default: today's workouts
      workouts = await getWorkoutsByDate(session.user.id, new Date());
    }

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error("Get workouts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

// POST - Create new workout
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, date, duration, caloriesBurned, notes, exercises } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Workout name is required" },
        { status: 400 }
      );
    }

    const workout = await createWorkout({
      userId: session.user.id,
      name,
      description,
      date: date ? new Date(date) : undefined,
      duration,
      caloriesBurned,
      notes,
      exercises,
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error("Create workout error:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}
