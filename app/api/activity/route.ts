import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getActivityByDate, getTodayActivity, upsertActivity } from "@/lib/services/activity.service"

// GET - Get today's activity or activity for a specific date
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get("date")

    let activity
    if (dateParam) {
      const targetDate = new Date(dateParam)
      activity = await getActivityByDate(session.user.id, targetDate)

      // If no activity exists, return default values
      if (!activity) {
        targetDate.setHours(0, 0, 0, 0)
        return NextResponse.json({
          steps: 0,
          activeMinutes: 0,
          caloriesBurned: null,
          distance: null,
          date: targetDate.toISOString(),
        })
      }
    } else {
      activity = await getTodayActivity(session.user.id)
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Activity fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST/PUT - Create or update activity for today
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { steps, activeMinutes, caloriesBurned, distance, date } = await req.json()

    // Use provided date or today
    const targetDate = date ? new Date(date) : new Date()

    const activity = await upsertActivity(session.user.id, targetDate, {
      steps: steps !== undefined ? parseInt(steps) : undefined,
      activeMinutes: activeMinutes !== undefined ? parseInt(activeMinutes) : undefined,
      caloriesBurned: caloriesBurned !== undefined ? (caloriesBurned ? parseInt(caloriesBurned) : null) : undefined,
      distance: distance !== undefined ? (distance ? parseFloat(distance) : null) : undefined,
    })

    return NextResponse.json({ message: "Activity updated successfully", activity })
  } catch (error) {
    console.error("Activity update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

