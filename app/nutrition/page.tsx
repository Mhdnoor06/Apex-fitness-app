"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Meal {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
}

interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

function NutritionPageContent() {
  const searchParams = useSearchParams();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [macros, setMacros] = useState<MacroBreakdown | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  useEffect(() => {
    fetchData();

    // Check for scanned barcode data in URL params
    const name = searchParams.get("name");
    const scannedCalories = searchParams.get("calories");
    const scannedProtein = searchParams.get("protein");
    const scannedCarbs = searchParams.get("carbs");
    const scannedFat = searchParams.get("fat");

    if (name && scannedCalories) {
      setMealName(name);
      setCalories(scannedCalories);
      setProtein(scannedProtein || "");
      setCarbs(scannedCarbs || "");
      setFat(scannedFat || "");
      setShowAddMeal(true); // Auto-open the form with pre-filled data
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [mealsRes, macrosRes] = await Promise.all([
        fetch("/api/meals"),
        fetch("/api/meals/macro-breakdown"),
      ]);

      const mealsData = await mealsRes.json();
      const macrosData = await macrosRes.json();

      setMeals(mealsData.meals || []);
      setMacros(macrosData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mealName,
          mealType,
          calories: parseInt(calories),
          protein: parseInt(protein),
          carbs: parseInt(carbs),
          fat: parseInt(fat),
        }),
      });

      if (response.ok) {
        // Reset form
        setMealName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setShowAddMeal(false);

        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error("Error logging meal:", error);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm("Delete this meal?")) return;

    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return "breakfast_dining";
      case "lunch":
        return "lunch_dining";
      case "dinner":
        return "dinner_dining";
      case "snack":
        return "cookie";
      default:
        return "restaurant";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-24">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link
          href="/"
          className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">
          Nutrition Tracker
        </h2>
        <Link
          href="/nutrition/templates"
          className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">bookmark</span>
        </Link>
      </div>

      {/* Macro Breakdown */}
      {macros && (
        <div className="px-4 pt-2">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-900 dark:text-white text-base font-semibold mb-4">
              Today&apos;s Macros
            </h3>

            {/* Macro Circles */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(macros.proteinPercentage / 100) * 176} 176`}
                      className="text-blue-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {macros.proteinPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Protein</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{macros.protein}g</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(macros.carbsPercentage / 100) * 176} 176`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {macros.carbsPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Carbs</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{macros.carbs}g</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(macros.fatPercentage / 100) * 176} 176`}
                      className="text-orange-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {macros.fatPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Fat</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{macros.fat}g</p>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{macros.calories}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Calories</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddMeal(!showAddMeal)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white px-4 py-3 text-base font-medium shadow-lg"
          >
            <span className="material-symbols-outlined">add</span>
            Log Meal
          </button>
          <Link
            href="/nutrition/scanner"
            className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-primary-start text-primary-start px-4 py-3 text-base font-medium shadow-lg"
          >
            <span className="material-symbols-outlined">qr_code_scanner</span>
            Scan
          </Link>
        </div>
      </div>

      {/* Add Meal Form */}
      {showAddMeal && (
        <div className="px-4 pt-4">
          <form onSubmit={handleAddMeal} className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold">Add Meal</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., Grilled Chicken"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddMeal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium"
              >
                Add Meal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals List */}
      <div className="px-4 pt-4">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-3">Today&apos;s Meals</h3>

        {meals.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-2">
              restaurant
            </span>
            <p className="text-slate-500 dark:text-slate-400">No meals logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-start text-2xl">
                      {getMealTypeIcon(meal.mealType)}
                    </span>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold">{meal.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                        {meal.mealType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calories</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{meal.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{meal.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{meal.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{meal.fat}g</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Trends Link */}
      <div className="px-4 pt-4">
        <Link
          href="/nutrition/trends"
          className="block bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-start text-2xl">
                trending_up
              </span>
              <div>
                <p className="text-slate-900 dark:text-white font-semibold">Weekly Trends</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">View your nutrition over time</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function NutritionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    }>
      <NutritionPageContent />
    </Suspense>
  );
}
