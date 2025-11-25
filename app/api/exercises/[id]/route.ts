import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "@/lib/services/exercise.service";

// GET - Get exercise by ID
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
    const exercise = await getExerciseById(id);

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Get exercise error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}

// PUT - Update custom exercise
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

    const exercise = await updateExercise(id, session.user.id, body);

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Update exercise error:", error);
    const message = error instanceof Error ? error.message : "Failed to update exercise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete custom exercise
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
    await deleteExercise(id, session.user.id);

    return NextResponse.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Delete exercise error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete exercise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
