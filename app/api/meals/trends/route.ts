import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getWeeklyNutritionTrends } from "@/lib/services/meal.service"

// GET - Get weekly nutrition trends
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trends = await getWeeklyNutritionTrends(session.user.id)

    return NextResponse.json({ trends })
  } catch (error) {
    console.error("Trends fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
