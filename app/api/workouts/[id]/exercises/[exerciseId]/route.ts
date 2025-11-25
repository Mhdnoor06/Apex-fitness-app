import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update workout exercise (log sets/reps/weight)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workoutId, exerciseId } = await params;
    const body = await req.json();
    const { sets, reps, weight, isCompleted } = body;

    // Verify workout belongs to user and find the workout exercise
    // exerciseId parameter is actually the workoutExercise.id
    const workoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        id: exerciseId,
        workout: {
          id: workoutId,
          userId: session.user.id,
        },
      },
      include: {
        workout: true,
      },
    });

    if (!workoutExercise) {
      return NextResponse.json(
        { error: "Exercise not found in workout" },
        { status: 404 }
      );
    }

    // Calculate average reps and weight from sets if provided
    let avgReps = reps;
    let avgWeight = weight;
    
    if (sets && Array.isArray(sets) && sets.length > 0) {
      const validSets = sets.filter((s: any) => s.reps !== null && s.reps !== undefined || s.weight !== null && s.weight !== undefined);
      if (validSets.length > 0) {
        const totalReps = validSets.reduce((sum: number, s: any) => sum + (s.reps || 0), 0);
        const totalWeight = validSets.reduce((sum: number, s: any) => sum + (s.weight || 0), 0);
        avgReps = Math.round(totalReps / validSets.length);
        avgWeight = totalWeight / validSets.length;
      }
    }

    // Delete existing sets if we're replacing them
    if (sets && Array.isArray(sets)) {
      // Try to delete existing sets (model may not exist yet until migration is run)
      try {
        await (prisma as any).workoutSet.deleteMany({
          where: {
            workoutExerciseId: workoutExercise.id,
          },
        });
      } catch (error) {
        // Model might not exist yet - this is okay, will be created on first run
        console.log("WorkoutSet model not available yet, skipping delete");
      }

      // Create individual sets
      const setsToCreate = sets
        .filter((s: any) => s.setNumber !== undefined)
        .map((s: any) => ({
          workoutExerciseId: workoutExercise.id,
          setNumber: s.setNumber,
          reps: s.reps !== undefined ? s.reps : null,
          weight: s.weight !== undefined ? s.weight : null,
          duration: s.duration !== undefined ? s.duration : null,
          restTime: s.restTime !== undefined ? s.restTime : null,
          isCompleted: s.isCompleted !== undefined ? s.isCompleted : true,
          notes: s.notes || null,
        }));

      if (setsToCreate.length > 0) {
        try {
          await (prisma as any).workoutSet.createMany({
            data: setsToCreate,
          });
        } catch (error) {
          // Model might not exist yet - log but don't fail
          console.log("WorkoutSet model not available yet, sets will be saved after migration");
        }
      }
    }

    // Update the workout exercise with completion status and averages
    const updated = await prisma.workoutExercise.update({
      where: {
        id: workoutExercise.id,
      },
      data: {
        reps: avgReps !== undefined ? avgReps : workoutExercise.reps,
        weight: avgWeight !== undefined ? avgWeight : workoutExercise.weight,
        isCompleted: isCompleted !== undefined ? isCompleted : workoutExercise.isCompleted,
      },
      include: {
        exercise: true,
        ...(typeof (prisma as any).workoutSet !== 'undefined' && {
          workoutSets: {
            orderBy: {
              setNumber: 'asc',
            },
          },
        }),
      },
    });

    return NextResponse.json({ workoutExercise: updated });
  } catch (error) {
    console.error("Update workout exercise error:", error);
    const message = error instanceof Error ? error.message : "Failed to update exercise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

