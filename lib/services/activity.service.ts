import { prisma } from "@/lib/prisma";

/**
 * Activity Service
 * Handles all activity-related database operations
 */

export interface Activity {
  id?: string;
  userId: string;
  date: Date;
  steps: number;
  activeMinutes: number;
  caloriesBurned: number | null;
  distance: number | null;
}

export interface ActivityUpdate {
  steps?: number;
  activeMinutes?: number;
  caloriesBurned?: number | null;
  distance?: number | null;
}

export interface WeeklyActivityData {
  date: string;
  dayName: string;
  steps: number;
  activeMinutes: number;
}

export interface WeeklyActivitySummary {
  totalSteps: number;
  totalActiveMinutes: number;
  totalCalories: number;
  weekData: WeeklyActivityData[];
  startDate: string;
  endDate: string;
}

/**
 * Get activity for a specific date
 */
export async function getActivityByDate(
  userId: string,
  date: Date
): Promise<Activity | null> {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const activity = await prisma.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
    });

    return activity;
  } catch (error) {
    console.error("Error fetching activity:", error);
    throw new Error("Failed to fetch activity");
  }
}

/**
 * Get today's activity
 */
export async function getTodayActivity(userId: string): Promise<Activity> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activity = await getActivityByDate(userId, today);

    // Return default values if no activity exists
    if (!activity) {
      return {
        userId,
        date: today,
        steps: 0,
        activeMinutes: 0,
        caloriesBurned: null,
        distance: null,
      };
    }

    return activity;
  } catch (error) {
    console.error("Error fetching today's activity:", error);
    throw new Error("Failed to fetch today's activity");
  }
}

/**
 * Create or update activity for a specific date
 */
export async function upsertActivity(
  userId: string,
  date: Date,
  data: ActivityUpdate
): Promise<Activity> {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Build update data object, only including defined fields
    const updateData: any = {};
    if (data.steps !== undefined) updateData.steps = data.steps;
    if (data.activeMinutes !== undefined) updateData.activeMinutes = data.activeMinutes;
    if (data.caloriesBurned !== undefined) updateData.caloriesBurned = data.caloriesBurned;
    if (data.distance !== undefined) updateData.distance = data.distance;

    const activity = await prisma.activity.upsert({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
      update: updateData,
      create: {
        userId,
        date: targetDate,
        steps: data.steps ?? 0,
        activeMinutes: data.activeMinutes ?? 0,
        caloriesBurned: data.caloriesBurned ?? null,
        distance: data.distance ?? null,
      },
    });

    return activity;
  } catch (error) {
    console.error("Error upserting activity:", error);
    throw new Error("Failed to save activity");
  }
}

/**
 * Get weekly activity summary (last 7 days including today)
 */
export async function getWeeklyActivitySummary(
  userId: string
): Promise<WeeklyActivitySummary> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days ago + today = 7 days

    // Get all activities in the range
    const activities = await prisma.activity.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calculate totals
    const totalSteps = activities.reduce((sum, a) => sum + a.steps, 0);
    const totalActiveMinutes = activities.reduce((sum, a) => sum + a.activeMinutes, 0);
    const totalCalories = activities.reduce(
      (sum, a) => sum + (a.caloriesBurned || 0),
      0
    );

    // Create a map of activities by date for easy lookup
    const activityMap = new Map<string, { steps: number; activeMinutes: number }>();
    activities.forEach((a) => {
      const dateKey = a.date.toISOString().split("T")[0];
      activityMap.set(dateKey, {
        steps: a.steps,
        activeMinutes: a.activeMinutes,
      });
    });

    // Generate data for each day of the week
    const weekData: WeeklyActivityData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const activity = activityMap.get(dateKey) || { steps: 0, activeMinutes: 0 };

      weekData.push({
        date: dateKey,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        steps: activity.steps,
        activeMinutes: activity.activeMinutes,
      });
    }

    return {
      totalSteps,
      totalActiveMinutes,
      totalCalories,
      weekData,
      startDate: sevenDaysAgo.toISOString(),
      endDate: today.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching weekly activity:", error);
    throw new Error("Failed to fetch weekly activity");
  }
}
