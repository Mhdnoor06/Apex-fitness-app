"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MealTemplate {
  id: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string | null;
  isFavorite: boolean;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLogMeal, setShowLogMeal] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [servingSize, setServingSize] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/meal-templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/meal-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
          calories: parseInt(calories),
          protein: parseInt(protein),
          carbs: parseInt(carbs),
          fat: parseInt(fat),
          servingSize: servingSize || undefined,
        }),
      });

      if (response.ok) {
        // Reset form
        setName("");
        setDescription("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        setServingSize("");
        setShowAddForm(false);
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await fetch(`/api/meal-templates/${templateId}/favorite`, {
        method: "POST",
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Delete this template?")) return;

    try {
      const response = await fetch(`/api/meal-templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleLogFromTemplate = async (templateId: string, mealType: string) => {
    try {
      const response = await fetch(`/api/meal-templates/${templateId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType }),
      });

      if (response.ok) {
        setShowLogMeal(null);
        alert("Meal logged successfully!");
      }
    } catch (error) {
      console.error("Error logging meal:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const favoriteTemplates = templates.filter((t) => t.isFavorite);
  const otherTemplates = templates.filter((t) => !t.isFavorite);

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-24">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <Link
          href="/nutrition"
          className="flex size-10 shrink-0 items-center justify-center text-slate-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">
          Meal Templates
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Add Template Button */}
      <div className="px-4 pt-2">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white px-4 py-3 text-base font-medium shadow-lg"
        >
          <span className="material-symbols-outlined">add</span>
          Create Template
        </button>
      </div>

      {/* Add Template Form */}
      {showAddForm && (
        <div className="px-4 pt-4">
          <form
            onSubmit={handleAddTemplate}
            className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm space-y-4"
          >
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold">
              New Template
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., Protein Shake"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., Post-workout shake"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Serving Size (optional)
              </label>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., 1 scoop, 200g"
              />
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
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Favorites */}
      {favoriteTemplates.length > 0 && (
        <div className="px-4 pt-6">
          <h3 className="text-slate-900 dark:text-white text-base font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">star</span>
            Favorites
          </h3>
          <div className="space-y-3">
            {favoriteTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteTemplate}
                onLog={handleLogFromTemplate}
                showLogMeal={showLogMeal}
                setShowLogMeal={setShowLogMeal}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="px-4 pt-6">
        <h3 className="text-slate-900 dark:text-white text-base font-bold mb-3">
          {favoriteTemplates.length > 0 ? "Other Templates" : "All Templates"}
        </h3>

        {templates.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-2">
              bookmark
            </span>
            <p className="text-slate-500 dark:text-slate-400">No templates yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Create templates for meals you eat often
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {otherTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteTemplate}
                onLog={handleLogFromTemplate}
                showLogMeal={showLogMeal}
                setShowLogMeal={setShowLogMeal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Template Card Component
function TemplateCard({
  template,
  onToggleFavorite,
  onDelete,
  onLog,
  showLogMeal,
  setShowLogMeal,
}: {
  template: MealTemplate;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onLog: (id: string, mealType: string) => void;
  showLogMeal: string | null;
  setShowLogMeal: (id: string | null) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-slate-900 dark:text-white font-semibold">{template.name}</h4>
            <button
              onClick={() => onToggleFavorite(template.id)}
              className={`${
                template.isFavorite ? "text-yellow-500" : "text-slate-300 dark:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {template.isFavorite ? "star" : "star_border"}
              </span>
            </button>
          </div>
          {template.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {template.description}
            </p>
          )}
          {template.servingSize && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {template.servingSize}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(template.id)}
          className="text-red-500 hover:text-red-600"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center py-3 border-y border-slate-200 dark:border-slate-700 my-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Cal</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{template.calories}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pro</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{template.protein}g</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{template.carbs}g</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{template.fat}g</p>
        </div>
      </div>

      {showLogMeal === template.id ? (
        <div className="grid grid-cols-2 gap-2">
          {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
            <button
              key={mealType}
              onClick={() => onLog(template.id, mealType)}
              className="px-3 py-2 rounded-lg bg-gradient-primary text-white text-sm font-medium capitalize"
            >
              {mealType}
            </button>
          ))}
          <button
            onClick={() => setShowLogMeal(null)}
            className="col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLogMeal(template.id)}
          className="w-full px-4 py-2 rounded-lg bg-gradient-primary text-white text-sm font-medium"
        >
          Log This Meal
        </button>
      )}
    </div>
  );
}
