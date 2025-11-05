"use client";

import { DailyNutrients, getDailySummary, getDailyNutrients } from "@/lib/api";
import { useState, useEffect } from "react";

interface DailySummaryProps {
  date: string;
  refreshKey?: number; // bump to force refresh
}

export default function DailySummary({
  date,
  refreshKey = 0,
}: DailySummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [nutrients, setNutrients] = useState<DailyNutrients | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSummary();
  }, [date, refreshKey]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const [summaryData, nutrientsData] = await Promise.all([
        getDailySummary(date),
        getDailyNutrients(date),
      ]);
      setSummary(summaryData.summary);
      setNutrients(nutrientsData);
    } catch (err) {
      console.error("Failed to load summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700">Loading summary...</p>
      </div>
    );
  }

  if (!summary && !nutrients) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Daily Summary</h3>

      {summary && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {nutrients && (
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Total Nutrients
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-hidden">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                Calories
              </p>
              <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {nutrients.calories.toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-hidden">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                Protein
              </p>
              <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {nutrients.protein.toFixed(1)}g
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-hidden">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                Carbs
              </p>
              <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {nutrients.carbs.toFixed(1)}g
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-hidden">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                Fats
              </p>
              <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {nutrients.fats.toFixed(1)}g
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200 overflow-hidden">
              <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                Fiber
              </p>
              <p className="text-xl font-bold text-gray-800 whitespace-nowrap">
                {nutrients.fiber.toFixed(1)}g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
