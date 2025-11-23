import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getWeeklyActivitySummary } from "@/lib/services/activity.service"

// GET - Get weekly activity summary (last 7 days)
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const summary = await getWeeklyActivitySummary(session.user.id)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Weekly activity fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

