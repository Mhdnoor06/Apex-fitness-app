import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTodayMacroBreakdown } from "@/lib/services/meal.service"

// GET - Get today's macro breakdown
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const breakdown = await getTodayMacroBreakdown(session.user.id)

    return NextResponse.json(breakdown)
  } catch (error) {
    console.error("Macro breakdown fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
