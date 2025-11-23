import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        goal: true,
        activityLevel: true,
        bmi: true,
        tdee: true,
        targetCalories: true,
        targetProtein: true,
      },
    })

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

    // Recalculate metrics if height/weight/age/gender/activityLevel changed
    let updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (gender !== undefined) updateData.gender = gender
    if (age !== undefined) updateData.age = age ? parseInt(age) : null
    if (height !== undefined) updateData.height = height ? parseFloat(height) : null
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null
    if (goal !== undefined) updateData.goal = goal
    if (activityLevel !== undefined) updateData.activityLevel = activityLevel

    // Recalculate BMI, TDEE, target calories, and protein if relevant fields changed
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gender: true,
        age: true,
        height: true,
        weight: true,
        activityLevel: true,
        goal: true,
      },
    })

    const finalGender = gender !== undefined ? gender : currentUser?.gender
    const finalAge = age !== undefined ? (age ? parseInt(age) : null) : currentUser?.age
    const finalHeight = height !== undefined ? (height ? parseFloat(height) : null) : currentUser?.height
    const finalWeight = weight !== undefined ? (weight ? parseFloat(weight) : null) : currentUser?.weight
    const finalActivityLevel = activityLevel !== undefined ? activityLevel : currentUser?.activityLevel
    const finalGoal = goal !== undefined ? goal : currentUser?.goal

    // Calculate BMI
    if (finalHeight && finalWeight) {
      const heightInMeters = finalHeight / 100
      updateData.bmi = parseFloat((finalWeight / (heightInMeters * heightInMeters)).toFixed(1))
    }

    // Calculate TDEE
    if (finalAge && finalHeight && finalWeight && finalGender && finalActivityLevel) {
      let bmr: number
      if (finalGender === "Male") {
        bmr = 10 * finalWeight + 6.25 * finalHeight - 5 * finalAge + 5
      } else {
        bmr = 10 * finalWeight + 6.25 * finalHeight - 5 * finalAge - 161
      }

      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
      }

      const tdee = Math.round(bmr * (activityMultipliers[finalActivityLevel] || 1.2))
      updateData.tdee = tdee

      // Calculate target calories based on goal
      const goalMultipliers: Record<string, number> = {
        cut: 0.8,
        bulk: 1.2,
        recomp: 0.95,
        maintain: 1.0,
      }

      updateData.targetCalories = Math.round(tdee * (goalMultipliers[finalGoal] || 1.0))
    }

    // Calculate target protein (2g per kg)
    if (finalWeight) {
      updateData.targetProtein = Math.round(finalWeight * 2)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        goal: true,
        activityLevel: true,
        bmi: true,
        tdee: true,
        targetCalories: true,
        targetProtein: true,
      },
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

