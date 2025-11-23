import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { logMealFromTemplate } from "@/lib/services/meal.service"

// POST - Log a meal from a template
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { mealType } = await req.json()

    if (!mealType) {
      return NextResponse.json({ error: "mealType is required" }, { status: 400 })
    }

    const { id } = await params
    const meal = await logMealFromTemplate(session.user.id, id, mealType)

    return NextResponse.json({ message: "Meal logged successfully", meal }, { status: 201 })
  } catch (error) {
    console.error("Template log error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
