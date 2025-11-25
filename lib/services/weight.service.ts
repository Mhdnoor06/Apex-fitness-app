import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export interface CreateWeightLogInput {
  userId: string;
  weight: number;
  date?: Date;
  notes?: string;
}

export interface UpdateWeightLogInput {
  weight?: number;
  notes?: string;
}

// Get weight log for a specific date
export async function getWeightByDate(userId: string, date: Date) {
  return await prisma.weightLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: startOfDay(date),
      },
    },
  });
}

// Get weight logs for date range
export async function getWeightLogs(userId: string, startDate: Date, endDate: Date) {
  return await prisma.weightLog.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay(startDate),
        lte: startOfDay(endDate),
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

// Get recent weight logs
export async function getRecentWeightLogs(userId: string, days: number = 30) {
  const startDate = subDays(new Date(), days - 1);
  return await getWeightLogs(userId, startDate, new Date());
}

// Get latest weight log
export async function getLatestWeight(userId: string) {
  return await prisma.weightLog.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

// Create or update weight log
export async function logWeight(data: CreateWeightLogInput) {
  const date = startOfDay(data.date || new Date());

  return await prisma.weightLog.upsert({
    where: {
      userId_date: {
        userId: data.userId,
        date,
      },
    },
    update: {
      weight: data.weight,
      notes: data.notes,
    },
    create: {
      userId: data.userId,
      weight: data.weight,
      date,
      notes: data.notes,
    },
  });
}

// Update weight log
export async function updateWeightLog(
  userId: string,
  date: Date,
  data: UpdateWeightLogInput
) {
  const log = await prisma.weightLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: startOfDay(date),
      },
    },
  });

  if (!log) {
    throw new Error("Weight log not found");
  }

  return await prisma.weightLog.update({
    where: {
      userId_date: {
        userId,
        date: startOfDay(date),
      },
    },
    data: {
      ...(data.weight !== undefined && { weight: data.weight }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
}

// Delete weight log
export async function deleteWeightLog(userId: string, date: Date) {
  const log = await prisma.weightLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: startOfDay(date),
      },
    },
  });

  if (!log) {
    throw new Error("Weight log not found");
  }

  return await prisma.weightLog.delete({
    where: {
      userId_date: {
        userId,
        date: startOfDay(date),
      },
    },
  });
}

// Get weight statistics
export async function getWeightStats(userId: string, days: number = 30) {
  const logs = await getRecentWeightLogs(userId, days);

  if (logs.length === 0) {
    return {
      currentWeight: null,
      startWeight: null,
      weightChange: null,
      avgWeight: null,
      minWeight: null,
      maxWeight: null,
      trend: "stable" as const,
    };
  }

  const weights = logs.map((log) => log.weight);
  const currentWeight = weights[weights.length - 1];
  const startWeight = weights[0];
  const weightChange = currentWeight - startWeight;
  const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  // Calculate trend (simple linear regression)
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (logs.length >= 2) {
    const recentChange = currentWeight - startWeight;
    if (recentChange > 0.5) trend = "increasing";
    else if (recentChange < -0.5) trend = "decreasing";
  }

  return {
    currentWeight: Number(currentWeight.toFixed(1)),
    startWeight: Number(startWeight.toFixed(1)),
    weightChange: Number(weightChange.toFixed(1)),
    avgWeight: Number(avgWeight.toFixed(1)),
    minWeight: Number(minWeight.toFixed(1)),
    maxWeight: Number(maxWeight.toFixed(1)),
    trend,
  };
}

// Get weight trend data for charts
export async function getWeightTrend(userId: string, days: number = 30) {
  const logs = await getRecentWeightLogs(userId, days);

  return logs.map((log) => ({
    date: format(log.date, "MMM dd"),
    weight: Number(log.weight.toFixed(1)),
    notes: log.notes,
  }));
}

// Get weight progress towards goal
export async function getWeightProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { weight: true, goal: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const latest = await getLatestWeight(userId);

  if (!latest || !user.weight) {
    return {
      startingWeight: user.weight,
      currentWeight: latest?.weight || user.weight,
      goalWeight: null,
      progress: 0,
      remaining: 0,
    };
  }

  // Calculate goal weight based on user's fitness goal
  let goalWeight = user.weight;
  if (user.goal === "cut") {
    goalWeight = user.weight * 0.9; // 10% weight loss
  } else if (user.goal === "bulk") {
    goalWeight = user.weight * 1.1; // 10% weight gain
  }

  const startingWeight = user.weight;
  const currentWeight = latest.weight;
  const totalChange = goalWeight - startingWeight;
  const currentChange = currentWeight - startingWeight;
  const progress = totalChange !== 0 ? (currentChange / totalChange) * 100 : 0;
  const remaining = goalWeight - currentWeight;

  return {
    startingWeight: Number(startingWeight.toFixed(1)),
    currentWeight: Number(currentWeight.toFixed(1)),
    goalWeight: Number(goalWeight.toFixed(1)),
    progress: Number(Math.min(100, Math.max(0, progress)).toFixed(1)),
    remaining: Number(remaining.toFixed(1)),
  };
}
