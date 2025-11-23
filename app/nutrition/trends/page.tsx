"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WeeklyTrend {
  date: string;
  dayName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<WeeklyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"calories" | "protein" | "carbs" | "fat">("calories");

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch("/api/meals/trends");
      const data = await response.json();
      setTrends(data.trends || []);
    } catch (error) {
      console.error("Error fetching trends:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = () => {
    if (trends.length === 0) return 100;
    const values = trends.map((t) => t[selectedMetric]);
    return Math.max(...values, 1);
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case "calories":
        return "bg-gradient-primary";
      case "protein":
        return "bg-blue-500";
      case "carbs":
        return "bg-green-500";
      case "fat":
        return "bg-orange-500";
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "calories":
        return "Calories";
      case "protein":
        return "Protein (g)";
      case "carbs":
        return "Carbs (g)";
      case "fat":
        return "Fat (g)";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const maxValue = getMaxValue();
  const avgCalories = trends.length > 0
    ? Math.round(trends.reduce((sum, t) => sum + t.calories, 0) / trends.length)
    : 0;
  const avgProtein = trends.length > 0
    ? Math.round(trends.reduce((sum, t) => sum + t.protein, 0) / trends.length)
    : 0;

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
          Weekly Trends
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Calories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgCalories}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">per day</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Protein</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgProtein}g</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">per day</p>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto">
          {(["calories", "protein", "carbs", "fat"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedMetric === metric
                  ? "bg-gradient-primary text-white"
                  : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-6">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{getMetricLabel()}</h3>

          {trends.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-2">
                show_chart
              </span>
              <p className="text-slate-500 dark:text-slate-400">No data available yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="grid grid-cols-7 gap-2 items-end h-48">
                {trends.map((trend, index) => {
                  const value = trend[selectedMetric];
                  const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const isToday = index === trends.length - 1;

                  return (
                    <div key={trend.date} className="flex flex-col items-center gap-2">
                      <div className="relative w-full flex-1 flex items-end">
                        <div className="w-full flex flex-col items-center">
                          <span className="text-xs font-medium text-slate-900 dark:text-white mb-1">
                            {value}
                          </span>
                          <div
                            className={`w-full rounded-t-lg transition-all ${
                              isToday ? getMetricColor() : "bg-slate-300 dark:bg-slate-600"
                            }`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                          ></div>
                        </div>
                      </div>
                      <p
                        className={`text-xs font-medium ${
                          isToday
                            ? "text-gradient-primary"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {trend.dayName}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Past Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${getMetricColor()}`}></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Today</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="px-4 pt-4">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-3">Daily Breakdown</h3>
        <div className="space-y-2">
          {trends.map((trend, index) => {
            const isToday = index === trends.length - 1;
            return (
              <div
                key={trend.date}
                className={`bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm ${
                  isToday ? "ring-2 ring-primary-start" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {trend.dayName}
                    {isToday && (
                      <span className="ml-2 text-xs bg-gradient-primary text-white px-2 py-1 rounded">
                        Today
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(trend.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calories</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {trend.calories}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {trend.protein}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {trend.carbs}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Fat</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{trend.fat}g</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
