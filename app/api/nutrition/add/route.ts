import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { addNutrition } from "@/lib/services/nutrition.service"

// POST - Add nutrition values to daily total (for logging individual meals)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed, date } = await req.json()

    // Use provided date or today
    const targetDate = date ? new Date(date) : new Date()

    const nutrition = await addNutrition(session.user.id, targetDate, {
      caloriesConsumed: caloriesConsumed ? parseInt(caloriesConsumed) : 0,
      proteinConsumed: proteinConsumed ? parseInt(proteinConsumed) : 0,
      carbsConsumed: carbsConsumed ? parseInt(carbsConsumed) : 0,
      fatConsumed: fatConsumed ? parseInt(fatConsumed) : 0,
    })

    return NextResponse.json({ message: "Nutrition added successfully", nutrition })
  } catch (error) {
    console.error("Nutrition add error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
