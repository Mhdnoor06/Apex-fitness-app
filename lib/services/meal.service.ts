import { prisma } from "@/lib/prisma";
import { addNutrition } from "./nutrition.service";

/**
 * Meal Service
 * Handles meal logging, templates, and nutrition calculations
 */

export interface Meal {
  id: string;
  userId: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string | null;
  notes: string | null;
  barcode: string | null;
  loggedAt: Date;
}

export interface MealInput {
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  notes?: string;
  barcode?: string;
  loggedAt?: Date;
}

export interface MealTemplate {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string | null;
  isFavorite: boolean;
}

export interface MealTemplateInput {
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  isFavorite?: boolean;
}

export interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export interface WeeklyNutritionTrend {
  date: string;
  dayName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Log a meal and automatically update daily nutrition totals
 */
export async function logMeal(userId: string, data: MealInput): Promise<Meal> {
  try {
    const loggedAt = data.loggedAt || new Date();

    // Create the meal entry
    const meal = await prisma.meal.create({
      data: {
        userId,
        name: data.name,
        mealType: data.mealType,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        servingSize: data.servingSize || null,
        notes: data.notes || null,
        barcode: data.barcode || null,
        loggedAt,
      },
    });

    // Automatically add to daily nutrition totals
    const mealDate = new Date(loggedAt);
    mealDate.setHours(0, 0, 0, 0);

    await addNutrition(userId, mealDate, {
      caloriesConsumed: data.calories,
      proteinConsumed: data.protein,
      carbsConsumed: data.carbs,
      fatConsumed: data.fat,
    });

    return meal;
  } catch (error) {
    console.error("Error logging meal:", error);
    throw new Error("Failed to log meal");
  }
}

/**
 * Get meals for a specific date
 */
export async function getMealsByDate(userId: string, date: Date): Promise<Meal[]> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    });

    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    throw new Error("Failed to fetch meals");
  }
}

/**
 * Get today's meals
 */
export async function getTodayMeals(userId: string): Promise<Meal[]> {
  return getMealsByDate(userId, new Date());
}

/**
 * Delete a meal and update daily nutrition totals
 */
export async function deleteMeal(userId: string, mealId: string): Promise<void> {
  try {
    // Get the meal first to subtract from nutrition
    const meal = await prisma.meal.findUnique({
      where: { id: mealId, userId },
    });

    if (!meal) {
      throw new Error("Meal not found");
    }

    // Delete the meal
    await prisma.meal.delete({
      where: { id: mealId, userId },
    });

    // Subtract from daily nutrition totals
    const { getNutritionByDate, upsertNutrition } = await import("./nutrition.service");
    const mealDate = new Date(meal.loggedAt);
    mealDate.setHours(0, 0, 0, 0);

    const currentNutrition = await getNutritionByDate(userId, mealDate);
    if (currentNutrition) {
      await upsertNutrition(userId, mealDate, {
        caloriesConsumed: Math.max(0, currentNutrition.caloriesConsumed - meal.calories),
        proteinConsumed: Math.max(0, currentNutrition.proteinConsumed - meal.protein),
        carbsConsumed: Math.max(0, (currentNutrition.carbsConsumed || 0) - meal.carbs),
        fatConsumed: Math.max(0, (currentNutrition.fatConsumed || 0) - meal.fat),
      });
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw new Error("Failed to delete meal");
  }
}

/**
 * Get macro breakdown for today
 */
export async function getTodayMacroBreakdown(userId: string): Promise<MacroBreakdown> {
  try {
    const { getTodayNutrition } = await import("./nutrition.service");
    const nutrition = await getTodayNutrition(userId);

    const calories = nutrition.caloriesConsumed || 0;
    const protein = nutrition.proteinConsumed || 0;
    const carbs = nutrition.carbsConsumed || 0;
    const fat = nutrition.fatConsumed || 0;

    // Calculate calories from macros (protein=4cal/g, carbs=4cal/g, fat=9cal/g)
    const proteinCalories = protein * 4;
    const carbsCalories = carbs * 4;
    const fatCalories = fat * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

    // Calculate percentages
    const proteinPercentage = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
    const carbsPercentage = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
    const fatPercentage = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;

    return {
      calories,
      protein,
      carbs,
      fat,
      proteinPercentage,
      carbsPercentage,
      fatPercentage,
    };
  } catch (error) {
    console.error("Error getting macro breakdown:", error);
    throw new Error("Failed to get macro breakdown");
  }
}

/**
 * Get weekly nutrition trends
 */
export async function getWeeklyNutritionTrends(userId: string): Promise<WeeklyNutritionTrend[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const nutritionData = await prisma.nutrition.findMany({
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

    // Create a map for easy lookup
    const nutritionMap = new Map();
    nutritionData.forEach((n) => {
      const dateKey = n.date.toISOString().split("T")[0];
      nutritionMap.set(dateKey, n);
    });

    // Generate data for each day
    const trends: WeeklyNutritionTrend[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const nutrition = nutritionMap.get(dateKey);

      trends.push({
        date: dateKey,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        calories: nutrition?.caloriesConsumed || 0,
        protein: nutrition?.proteinConsumed || 0,
        carbs: nutrition?.carbsConsumed || 0,
        fat: nutrition?.fatConsumed || 0,
      });
    }

    return trends;
  } catch (error) {
    console.error("Error getting weekly trends:", error);
    throw new Error("Failed to get weekly nutrition trends");
  }
}

// ============= MEAL TEMPLATES =============

/**
 * Create a meal template
 */
export async function createMealTemplate(
  userId: string,
  data: MealTemplateInput
): Promise<MealTemplate> {
  try {
    const template = await prisma.mealTemplate.create({
      data: {
        userId,
        name: data.name,
        description: data.description || null,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        servingSize: data.servingSize || null,
        isFavorite: data.isFavorite || false,
      },
    });

    return template;
  } catch (error) {
    console.error("Error creating meal template:", error);
    throw new Error("Failed to create meal template");
  }
}

/**
 * Get all meal templates for a user
 */
export async function getMealTemplates(userId: string): Promise<MealTemplate[]> {
  try {
    const templates = await prisma.mealTemplate.findMany({
      where: { userId },
      orderBy: [{ isFavorite: "desc" }, { name: "asc" }],
    });

    return templates;
  } catch (error) {
    console.error("Error fetching meal templates:", error);
    throw new Error("Failed to fetch meal templates");
  }
}

/**
 * Get a specific meal template
 */
export async function getMealTemplate(userId: string, templateId: string): Promise<MealTemplate | null> {
  try {
    const template = await prisma.mealTemplate.findUnique({
      where: { id: templateId, userId },
    });

    return template;
  } catch (error) {
    console.error("Error fetching meal template:", error);
    throw new Error("Failed to fetch meal template");
  }
}

/**
 * Update a meal template
 */
export async function updateMealTemplate(
  userId: string,
  templateId: string,
  data: Partial<MealTemplateInput>
): Promise<MealTemplate> {
  try {
    const template = await prisma.mealTemplate.update({
      where: { id: templateId, userId },
      data: {
        name: data.name,
        description: data.description,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        servingSize: data.servingSize,
        isFavorite: data.isFavorite,
      },
    });

    return template;
  } catch (error) {
    console.error("Error updating meal template:", error);
    throw new Error("Failed to update meal template");
  }
}

/**
 * Delete a meal template
 */
export async function deleteMealTemplate(userId: string, templateId: string): Promise<void> {
  try {
    await prisma.mealTemplate.delete({
      where: { id: templateId, userId },
    });
  } catch (error) {
    console.error("Error deleting meal template:", error);
    throw new Error("Failed to delete meal template");
  }
}

/**
 * Toggle favorite status of a meal template
 */
export async function toggleFavoriteMealTemplate(
  userId: string,
  templateId: string
): Promise<MealTemplate> {
  try {
    const template = await prisma.mealTemplate.findUnique({
      where: { id: templateId, userId },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    const updated = await prisma.mealTemplate.update({
      where: { id: templateId, userId },
      data: {
        isFavorite: !template.isFavorite,
      },
    });

    return updated;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw new Error("Failed to toggle favorite");
  }
}

/**
 * Log a meal from a template
 */
export async function logMealFromTemplate(
  userId: string,
  templateId: string,
  mealType: string
): Promise<Meal> {
  try {
    const template = await getMealTemplate(userId, templateId);

    if (!template) {
      throw new Error("Template not found");
    }

    return await logMeal(userId, {
      name: template.name,
      mealType,
      calories: template.calories,
      protein: template.protein,
      carbs: template.carbs,
      fat: template.fat,
      servingSize: template.servingSize || undefined,
    });
  } catch (error) {
    console.error("Error logging meal from template:", error);
    throw new Error("Failed to log meal from template");
  }
}
