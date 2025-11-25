"use client";

import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: string;
  equipment?: string;
  imageUrl?: string;
  muscleGroups: string[];
  instructions?: string;
  videoUrl?: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { value: "chest", label: "Chest", icon: "favorite", gradient: "from-red-500 to-pink-500" },
    { value: "back", label: "Back", icon: "fitness_center", gradient: "from-blue-500 to-cyan-500" },
    { value: "legs", label: "Legs", icon: "directions_run", gradient: "from-green-500 to-emerald-500" },
    { value: "shoulders", label: "Shoulders", icon: "accessibility", gradient: "from-orange-500 to-amber-500" },
    { value: "arms", label: "Arms", icon: "sports_martial_arts", gradient: "from-purple-500 to-violet-500" },
    { value: "core", label: "Core", icon: "emergency", gradient: "from-yellow-500 to-orange-500" },
    { value: "cardio", label: "Cardio", icon: "speed", gradient: "from-red-600 to-rose-500" },
    { value: "flexibility", label: "Flexibility", icon: "self_improvement", gradient: "from-indigo-500 to-purple-500" },
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/exercises");
      const data = await response.json();

      if (response.ok) {
        setExercises(data.exercises);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByCategory = (category: string) => {
    let filtered = exercises.filter((ex) => ex.category === category);

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getCategoryCount = (category: string) => {
    return exercises.filter((ex) => ex.category === category).length;
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when selecting category
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedExercise(null), 300);
  };

  const categoryExercises = selectedCategory ? getExercisesByCategory(selectedCategory) : [];
  const selectedCategoryInfo = categories.find((c) => c.value === selectedCategory);

  return (
    <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between shrink-0 z-10">
        {selectedCategory ? (
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-slate-900 dark:text-white"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] capitalize">
              {selectedCategory}
            </h1>
          </button>
        ) : (
          <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] flex-1">
            Exercise Library
          </h1>
        )}
        <div className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-end">
          <span className="material-symbols-outlined text-2xl">tune</span>
        </div>
      </div>

      {/* Search Bar - Only show when category is selected, Fixed */}
      {selectedCategory && (
        <div className="px-4 py-3 shrink-0">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-slate-400 dark:text-slate-400 flex bg-white dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-slate-800/50 focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-slate-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search exercises..."
              />
            </div>
          </label>
        </div>
      )}

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto min-h-0 pb-20">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 animate-pulse">
                fitness_center
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading exercises...</p>
            </div>
          </div>
        )}

        {/* Category Cards Grid - First Level */}
        {!loading && !selectedCategory && (
          <div className="grid grid-cols-2 gap-4 p-4">
            {categories.map((category) => {
              const count = getCategoryCount(category.value);
              return (
                <button
                  key={category.value}
                  onClick={() => handleCategoryClick(category.value)}
                  className={`bg-gradient-to-br ${category.gradient} flex flex-col gap-3 rounded-xl justify-center items-center p-6 aspect-square relative overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-lg`}
                >
                  <span className="material-symbols-outlined text-white text-6xl">
                    {category.icon}
                  </span>
                  <div className="text-center">
                    <p className="text-white text-lg font-bold leading-tight">
                      {category.label}
                    </p>
                    <p className="text-white/80 text-sm mt-1">
                      {count} exercises
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Exercise Grid - Second Level (After selecting category) */}
        {!loading && selectedCategory && categoryExercises.length > 0 && (
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            {categoryExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square relative overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md"
                style={{
                  backgroundImage: exercise.imageUrl
                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 60%), url("${exercise.imageUrl}")`
                    : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                }}
              >
                {!exercise.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl opacity-30">
                      fitness_center
                    </span>
                  </div>
                )}
                <div className="relative z-10">
                  <p className="text-white text-base font-bold leading-tight line-clamp-2">
                    {exercise.name}
                  </p>
                  <p className="text-white/80 text-xs mt-1 capitalize">
                    {exercise.difficulty}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && selectedCategory && categoryExercises.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
              search_off
            </span>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-2">
              No exercises found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Try adjusting your search
            </p>
          </div>
        )}
      </main>

      {/* Exercise Detail Modal - Tutorial Level */}
      {showModal && selectedExercise && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full sm:max-w-2xl sm:rounded-xl rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                {selectedExercise.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-6">
              {/* Exercise Image */}
              {selectedExercise.imageUrl && (
                <div
                  className="w-full h-64 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url("${selectedExercise.imageUrl}")` }}
                />
              )}

              {/* Exercise Info */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-gradient-primary text-white text-sm font-medium capitalize">
                  {selectedExercise.category}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium capitalize">
                  {selectedExercise.difficulty}
                </span>
                {selectedExercise.equipment && (
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium capitalize">
                    {selectedExercise.equipment.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedExercise.description && (
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {selectedExercise.description}
                  </p>
                </div>
              )}

              {/* Muscle Groups */}
              {selectedExercise.muscleGroups && selectedExercise.muscleGroups.length > 0 && (
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-2">
                    Target Muscles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscleGroups.map((muscle, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm capitalize"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions - How to Perform */}
              {selectedExercise.instructions && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-start">menu_book</span>
                    How to Perform
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedExercise.instructions}
                  </p>
                </div>
              )}

              {/* Video Link */}
              {selectedExercise.videoUrl && (
                <div>
                  <a
                    href={selectedExercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-primary text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined">play_circle</span>
                    Watch Video Tutorial
                  </a>
                </div>
              )}

              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 flex gap-3 pt-4 pb-20 sm:pb-6 px-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <button
                onClick={closeModal}
                className="flex-1 bg-gradient-primary text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add to Workout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
