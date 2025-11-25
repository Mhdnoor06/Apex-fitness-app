import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  completeWorkout,
} from "@/lib/services/workout.service";

// GET - Get workout by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const workout = await getWorkoutById(id, session.user.id);

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    return NextResponse.json({ workout });
  } catch (error) {
    console.error("Get workout error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout" },
      { status: 500 }
    );
  }
}

// PUT - Update workout
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = await params;

    const workout = await updateWorkout(id, session.user.id, body);

    return NextResponse.json({ workout });
  } catch (error) {
    console.error("Update workout error:", error);
    const message = error instanceof Error ? error.message : "Failed to update workout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete workout
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteWorkout(id, session.user.id);

    return NextResponse.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Delete workout error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete workout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH - Update workout (mark as complete or update other fields)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // If isCompleted is in body, use completeWorkout, otherwise use updateWorkout
    if (body.isCompleted !== undefined) {
      const workout = await completeWorkout(id, session.user.id);
      return NextResponse.json({ workout });
    } else {
      const workout = await updateWorkout(id, session.user.id, body);
      return NextResponse.json({ workout });
    }
  } catch (error) {
    console.error("Update workout error:", error);
    const message = error instanceof Error ? error.message : "Failed to update workout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
