import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTodayNutritionSummary } from "@/lib/services/nutrition.service"

// GET - Get today's nutrition summary with targets and progress
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const summary = await getTodayNutritionSummary(session.user.id)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Nutrition summary fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
