import { NextRequest, NextResponse } from "next/server"
import { completeOnboarding } from "@/lib/services/user.service"

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      gender,
      age,
      height,
      weight,
      goal,
      activityLevel,
      bmi,
      tdee,
      targetCalories,
      targetProtein,
    } = await req.json()

    const user = await completeOnboarding({
      email,
      gender,
      age,
      height,
      weight,
      goal,
      activityLevel,
      bmi,
      tdee,
      targetCalories,
      targetProtein,
    })

    return NextResponse.json(
      { message: "Onboarding data saved successfully", user },
      { status: 200 }
    )
  } catch (error) {
    console.error("Onboarding error:", error)

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

