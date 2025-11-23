import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { deleteMeal } from "@/lib/services/meal.service"

// DELETE - Delete a meal
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await deleteMeal(session.user.id, id)

    return NextResponse.json({ message: "Meal deleted successfully" })
  } catch (error) {
    console.error("Meal delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
