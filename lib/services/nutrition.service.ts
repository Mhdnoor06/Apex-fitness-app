import { prisma } from "@/lib/prisma";

/**
 * Nutrition Service
 * Handles all nutrition/meal tracking database operations
 */

export interface Nutrition {
  id?: string;
  userId: string;
  date: Date;
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number | null;
  fatConsumed: number | null;
}

export interface NutritionUpdate {
  caloriesConsumed?: number;
  proteinConsumed?: number;
  carbsConsumed?: number | null;
  fatConsumed?: number | null;
}

export interface NutritionSummary {
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  targetCalories: number;
  targetProtein: number;
  caloriesRemaining: number;
  proteinRemaining: number;
  caloriesProgress: number; // percentage
  proteinProgress: number; // percentage
}

/**
 * Get nutrition data for a specific date
 */
export async function getNutritionByDate(
  userId: string,
  date: Date
): Promise<Nutrition | null> {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nutrition = await prisma.nutrition.findUnique({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
    });

    return nutrition;
  } catch (error) {
    console.error("Error fetching nutrition:", error);
    throw new Error("Failed to fetch nutrition data");
  }
}

/**
 * Get today's nutrition data
 */
export async function getTodayNutrition(userId: string): Promise<Nutrition> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nutrition = await getNutritionByDate(userId, today);

    // Return default values if no nutrition exists
    if (!nutrition) {
      return {
        userId,
        date: today,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatConsumed: 0,
      };
    }

    return nutrition;
  } catch (error) {
    console.error("Error fetching today's nutrition:", error);
    throw new Error("Failed to fetch today's nutrition");
  }
}

/**
 * Get today's nutrition summary with targets and progress
 */
export async function getTodayNutritionSummary(
  userId: string
): Promise<NutritionSummary> {
  try {
    // Get today's nutrition data
    const nutrition = await getTodayNutrition(userId);

    // Get user's targets
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        targetCalories: true,
        targetProtein: true,
      },
    });

    const targetCalories = user?.targetCalories || 2000;
    const targetProtein = user?.targetProtein || 150;

    const caloriesConsumed = nutrition.caloriesConsumed || 0;
    const proteinConsumed = nutrition.proteinConsumed || 0;
    const carbsConsumed = nutrition.carbsConsumed || 0;
    const fatConsumed = nutrition.fatConsumed || 0;

    const caloriesRemaining = Math.max(0, targetCalories - caloriesConsumed);
    const proteinRemaining = Math.max(0, targetProtein - proteinConsumed);

    const caloriesProgress = targetCalories > 0
      ? Math.min(100, (caloriesConsumed / targetCalories) * 100)
      : 0;
    const proteinProgress = targetProtein > 0
      ? Math.min(100, (proteinConsumed / targetProtein) * 100)
      : 0;

    return {
      caloriesConsumed,
      proteinConsumed,
      carbsConsumed,
      fatConsumed,
      targetCalories,
      targetProtein,
      caloriesRemaining,
      proteinRemaining,
      caloriesProgress,
      proteinProgress,
    };
  } catch (error) {
    console.error("Error fetching nutrition summary:", error);
    throw new Error("Failed to fetch nutrition summary");
  }
}

/**
 * Create or update nutrition for a specific date
 */
export async function upsertNutrition(
  userId: string,
  date: Date,
  data: NutritionUpdate
): Promise<Nutrition> {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Build update data object, only including defined fields
    const updateData: any = {};
    if (data.caloriesConsumed !== undefined) updateData.caloriesConsumed = data.caloriesConsumed;
    if (data.proteinConsumed !== undefined) updateData.proteinConsumed = data.proteinConsumed;
    if (data.carbsConsumed !== undefined) updateData.carbsConsumed = data.carbsConsumed;
    if (data.fatConsumed !== undefined) updateData.fatConsumed = data.fatConsumed;

    const nutrition = await prisma.nutrition.upsert({
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
        caloriesConsumed: data.caloriesConsumed ?? 0,
        proteinConsumed: data.proteinConsumed ?? 0,
        carbsConsumed: data.carbsConsumed ?? 0,
        fatConsumed: data.fatConsumed ?? 0,
      },
    });

    return nutrition;
  } catch (error) {
    console.error("Error upserting nutrition:", error);
    throw new Error("Failed to save nutrition data");
  }
}

/**
 * Add nutrition values to existing daily total (useful for logging individual meals)
 */
export async function addNutrition(
  userId: string,
  date: Date,
  data: NutritionUpdate
): Promise<Nutrition> {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Get current nutrition data
    const current = await getNutritionByDate(userId, targetDate);

    // Calculate new totals by adding to existing values
    const newData: NutritionUpdate = {
      caloriesConsumed: (current?.caloriesConsumed || 0) + (data.caloriesConsumed || 0),
      proteinConsumed: (current?.proteinConsumed || 0) + (data.proteinConsumed || 0),
      carbsConsumed: (current?.carbsConsumed || 0) + (data.carbsConsumed || 0),
      fatConsumed: (current?.fatConsumed || 0) + (data.fatConsumed || 0),
    };

    return await upsertNutrition(userId, targetDate, newData);
  } catch (error) {
    console.error("Error adding nutrition:", error);
    throw new Error("Failed to add nutrition data");
  }
}
