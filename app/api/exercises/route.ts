import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getAllExercises,
  createExercise,
  searchExercises,
  getExercisesByCategory,
} from "@/lib/services/exercise.service";

// GET - Get all exercises or search
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    let exercises;

    if (query) {
      exercises = await searchExercises(query, session.user.id);
    } else if (category) {
      exercises = await getExercisesByCategory(category, session.user.id);
    } else {
      exercises = await getAllExercises(session.user.id, category || undefined);
    }

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Get exercises error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}

// POST - Create custom exercise
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      category,
      difficulty,
      equipment,
      instructions,
      imageUrl,
      videoUrl,
      muscleGroups,
    } = body;

    if (!name || !category || !difficulty) {
      return NextResponse.json(
        { error: "Name, category, and difficulty are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
      return NextResponse.json(
        { error: "At least one muscle group is required" },
        { status: 400 }
      );
    }

    const exercise = await createExercise({
      name,
      description,
      category,
      difficulty,
      equipment,
      instructions,
      imageUrl,
      videoUrl,
      muscleGroups,
      isCustom: true,
      userId: session.user.id,
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    console.error("Create exercise error:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}
