import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { toggleFavoriteMealTemplate } from "@/lib/services/meal.service"

// POST - Toggle favorite status
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const template = await toggleFavoriteMealTemplate(session.user.id, id)

    return NextResponse.json({ message: "Favorite toggled successfully", template })
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
