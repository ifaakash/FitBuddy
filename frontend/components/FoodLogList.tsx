"use client";

import { FoodLog, deleteFoodLog, analyzeFood, FoodAnalysis, updateFoodLog } from "@/lib/api";
import TimePicker from "@/components/TimePicker";
import { useState, useEffect } from "react";

interface FoodLogListProps {
  logs: FoodLog[];
  onUpdate: () => void;
}

export default function FoodLogList({ logs, onUpdate }: FoodLogListProps) {
  const [analyses, setAnalyses] = useState<Record<number, FoodAnalysis>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleAnalyze = async (logId: number) => {
    setLoading((prev) => ({ ...prev, [logId]: true }));
    try {
      const analysis = await analyzeFood(logId);
      setAnalyses((prev) => ({ ...prev, [logId]: analysis }));
    } catch (err) {
      console.error("Failed to analyze:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [logId]: false }));
    }
  };

  const handleDelete = async (logId: number) => {
    if (!confirm("Are you sure you want to delete this food log?")) return;
    try {
      // optimistic: reflect immediately
      onUpdate();
      await deleteFoodLog(logId);
    } catch (err) {
      console.error("Failed to delete:", err);
      onUpdate(); // fallback refresh
    }
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");

  const beginEdit = (log: FoodLog) => {
    setEditingId(log.id);
    setEditText(log.food_description);
    setEditTime(log.time || "");
  };

  const saveEdit = async (log: FoodLog) => {
    try {
      await updateFoodLog(log.id, {
        date: log.date,
        meal_time: log.meal_time,
        food_description: editText,
        time: editTime || undefined,
      });
      try {
        await analyzeFood(log.id);
      } catch {}
      setEditingId(null);
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const getMealTimeColor = (mealTime: string) => {
    switch (mealTime) {
      case "morning":
        return "bg-yellow-100 text-yellow-800";
      case "afternoon":
        return "bg-orange-100 text-orange-800";
      case "evening":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No food logs for this date. Start logging your meals!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const analysis = analyses[log.id];
        const isAnalyzing = loading[log.id];

        return (
          <div
            key={log.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTimeColor(
                    log.meal_time
                  )}`}
                >
                  {log.meal_time.charAt(0).toUpperCase() + log.meal_time.slice(1)}
                </span>
                {log.time && (
                  <span className="text-xs text-gray-500">at {log.time}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            {editingId === log.id ? (
              <div className="space-y-2 mb-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="flex items-center gap-2">
                  <TimePicker value={editTime} onChange={setEditTime} />
                  <button
                    onClick={() => saveEdit(log)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between mb-3">
                <p className="text-gray-800">{log.food_description}</p>
                <button
                  onClick={() => beginEdit(log)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            )}

            {!analysis && (
              <button
                onClick={() => handleAnalyze(log.id)}
                disabled={isAnalyzing}
                className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Nutrients"}
              </button>
            )}

            {analysis && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{analysis.summary}</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Calories</span>
                    <p className="font-semibold">{analysis.calories.toFixed(0)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Protein</span>
                    <p className="font-semibold">{analysis.protein.toFixed(1)}g</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Carbs</span>
                    <p className="font-semibold">{analysis.carbs.toFixed(1)}g</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fats</span>
                    <p className="font-semibold">{analysis.fats.toFixed(1)}g</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fiber</span>
                    <p className="font-semibold">{analysis.fiber.toFixed(1)}g</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

