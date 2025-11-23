import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { email },
      data: {
        gender,
        age: age ? parseInt(age) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        goal,
        activityLevel,
        bmi: bmi ? parseFloat(bmi) : null,
        tdee: tdee ? parseInt(tdee) : null,
        targetCalories: targetCalories ? parseInt(targetCalories) : null,
        targetProtein: targetProtein ? parseInt(targetProtein) : null,
        onboardingCompleted: true,
      },
    })

    return NextResponse.json(
      { message: "Onboarding data saved successfully", user },
      { status: 200 }
    )
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

