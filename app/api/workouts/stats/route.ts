import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWorkoutStats } from "@/lib/services/workout.service";

// GET - Get workout statistics
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const days = searchParams.get("days");

    const daysNum = days ? parseInt(days, 10) : 7;

    const stats = await getWorkoutStats(session.user.id, daysNum);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get workout stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout statistics" },
      { status: 500 }
    );
  }
}
