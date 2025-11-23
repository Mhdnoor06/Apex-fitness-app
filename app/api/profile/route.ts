import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserProfile, updateUserProfile } from "@/lib/services/user.service"

// GET - Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await getUserProfile(session.user.id)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      name,
      gender,
      age,
      height,
      weight,
      goal,
      activityLevel,
    } = body

    const updatedUser = await updateUserProfile(session.user.id, {
      name,
      gender,
      age: age !== undefined ? (age ? parseInt(age) : undefined) : undefined,
      height: height !== undefined ? (height ? parseFloat(height) : undefined) : undefined,
      weight: weight !== undefined ? (weight ? parseFloat(weight) : undefined) : undefined,
      goal,
      activityLevel,
    })

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

