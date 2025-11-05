"use client";

import { useState, useEffect } from "react";
import { FoodLog, getFoodLogs } from "@/lib/api";
import FoodLogForm from "@/components/FoodLogForm";
import FoodLogList from "@/components/FoodLogList";
import DailySummary from "@/components/DailySummary";
import DietPlan from "@/components/DietPlan";
import CalorieTracker from "../components/CalorieTracker";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"log" | "plan">("log");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadFoodLogs();
  }, [selectedDate]);

  const loadFoodLogs = async () => {
    setLoading(true);
    try {
      const logs = await getFoodLogs(selectedDate);
      setFoodLogs(logs);
    } catch (err) {
      console.error("Failed to load food logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-brand">FitBuddy</h1>
          <p className="text-sm text-gray-600">Track your food and get personalized recommendations</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "log"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Food Log
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "plan"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Diet Plan
          </button>
        </div>

        {activeTab === "log" && (
          <div className="space-y-6">
            {/* Date Selector */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Food Log Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Log Your Food</h2>
              <FoodLogForm
                selectedDate={selectedDate}
                onSuccess={() => {
                  loadFoodLogs();
                  setRefreshKey((k) => k + 1);
                }}
              />
            </div>
            {/* Calorie Tracker and Daily Summary */}
            <div className="grid gap-6 md:grid-cols-2">
              <CalorieTracker date={selectedDate} refreshKey={refreshKey} />
              <DailySummary date={selectedDate} refreshKey={refreshKey} />
            </div>

            {/* Food Logs List */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Today&apos;s Food Logs</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <FoodLogList
                  logs={foodLogs}
                  onUpdate={() => {
                    loadFoodLogs();
                    setRefreshKey((k) => k + 1);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div>
            <DietPlan />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 mt-12 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          FitBuddy - Your personal food tracking assistant
        </p>
      </footer>
    </div>
  );
}
