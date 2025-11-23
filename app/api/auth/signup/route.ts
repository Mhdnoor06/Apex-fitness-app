import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/services/user.service"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    const user = await createUser({ name, email, password })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)

    // Handle validation errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

