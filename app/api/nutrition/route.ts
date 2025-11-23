import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getTodayNutrition, upsertNutrition } from "@/lib/services/nutrition.service"

// GET - Get today's nutrition or nutrition for a specific date
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")

    if (dateParam) {
      const { getNutritionByDate } = await import("@/lib/services/nutrition.service")
      const targetDate = new Date(dateParam)
      const nutrition = await getNutritionByDate(session.user.id, targetDate)

      // If no nutrition exists, return default values
      if (!nutrition) {
        targetDate.setHours(0, 0, 0, 0)
        return NextResponse.json({
          caloriesConsumed: 0,
          proteinConsumed: 0,
          carbsConsumed: 0,
          fatConsumed: 0,
          date: targetDate.toISOString(),
        })
      }
      return NextResponse.json(nutrition)
    } else {
      const nutrition = await getTodayNutrition(session.user.id)
      return NextResponse.json(nutrition)
    }
  } catch (error) {
    console.error("Nutrition fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create or update nutrition data
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed, date } = await req.json()

    // Use provided date or today
    const targetDate = date ? new Date(date) : new Date()

    const nutrition = await upsertNutrition(session.user.id, targetDate, {
      caloriesConsumed: caloriesConsumed !== undefined ? parseInt(caloriesConsumed) : undefined,
      proteinConsumed: proteinConsumed !== undefined ? parseInt(proteinConsumed) : undefined,
      carbsConsumed: carbsConsumed !== undefined ? parseInt(carbsConsumed) : undefined,
      fatConsumed: fatConsumed !== undefined ? parseInt(fatConsumed) : undefined,
    })

    return NextResponse.json({ message: "Nutrition updated successfully", nutrition })
  } catch (error) {
    console.error("Nutrition update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
