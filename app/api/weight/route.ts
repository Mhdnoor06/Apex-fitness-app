import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getRecentWeightLogs,
  getLatestWeight,
  logWeight,
  getWeightStats,
  getWeightTrend,
  getWeightProgress,
} from "@/lib/services/weight.service";

// GET - Get weight logs or stats
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type"); // stats, trend, progress, latest
    const days = searchParams.get("days");

    const daysNum = days ? parseInt(days, 10) : 30;

    if (type === "stats") {
      const stats = await getWeightStats(session.user.id, daysNum);
      return NextResponse.json({ stats });
    }

    if (type === "trend") {
      const trend = await getWeightTrend(session.user.id, daysNum);
      return NextResponse.json({ trend });
    }

    if (type === "progress") {
      const progress = await getWeightProgress(session.user.id);
      return NextResponse.json({ progress });
    }

    if (type === "latest") {
      const latest = await getLatestWeight(session.user.id);
      return NextResponse.json({ weight: latest });
    }

    // Default: get recent logs
    const logs = await getRecentWeightLogs(session.user.id, daysNum);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Get weight error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight data" },
      { status: 500 }
    );
  }
}

// POST - Log weight
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { weight, date, notes } = body;

    if (!weight || weight <= 0) {
      return NextResponse.json(
        { error: "Valid weight is required" },
        { status: 400 }
      );
    }

    const log = await logWeight({
      userId: session.user.id,
      weight: parseFloat(weight),
      date: date ? new Date(date) : undefined,
      notes,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Log weight error:", error);
    return NextResponse.json(
      { error: "Failed to log weight" },
      { status: 500 }
    );
  }
}
