import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import {
  updateMealTemplate,
  deleteMealTemplate,
  toggleFavoriteMealTemplate,
} from "@/lib/services/meal.service"

// PUT - Update a meal template
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { id } = await params
    const template = await updateMealTemplate(session.user.id, id, data)

    return NextResponse.json({ message: "Template updated successfully", template })
  } catch (error) {
    console.error("Template update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a meal template
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
    await deleteMealTemplate(session.user.id, id)

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("Template delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
