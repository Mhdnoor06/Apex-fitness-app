import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getMealTemplates, createMealTemplate } from "@/lib/services/meal.service"

// GET - Get all meal templates
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await getMealTemplates(session.user.id)

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Templates fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new meal template
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const template = await createMealTemplate(session.user.id, data)

    return NextResponse.json(
      { message: "Template created successfully", template },
      { status: 201 }
    )
  } catch (error) {
    console.error("Template create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
