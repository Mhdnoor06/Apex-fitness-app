import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { changePassword } from "@/lib/services/user.service"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    await changePassword(session.user.id, currentPassword, newPassword)

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password change error:", error)

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

