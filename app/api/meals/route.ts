import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { logMeal, getTodayMeals, getMealsByDate } from "@/lib/services/meal.service"

// GET - Get today's meals or meals for a specific date
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")

    if (dateParam) {
      const meals = await getMealsByDate(session.user.id, new Date(dateParam))
      return NextResponse.json({ meals })
    } else {
      const meals = await getTodayMeals(session.user.id)
      return NextResponse.json({ meals })
    }
  } catch (error) {
    console.error("Meals fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Log a new meal
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const meal = await logMeal(session.user.id, data)

    return NextResponse.json({ message: "Meal logged successfully", meal }, { status: 201 })
  } catch (error) {
    console.error("Meal log error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
