"use client";

import { useState } from "react";
import { MealTime, createFoodLog, analyzeFood } from "@/lib/api";
import TimePicker from "@/components/TimePicker";

interface FoodLogFormProps {
  selectedDate: string;
  onSuccess: () => void;
}

export default function FoodLogForm({ selectedDate, onSuccess }: FoodLogFormProps) {
  const [mealTime, setMealTime] = useState<MealTime>("morning");
  const [foodDescription, setFoodDescription] = useState("");
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const created = await createFoodLog({
        date: selectedDate,
        meal_time: mealTime,
        food_description: foodDescription,
        time: time || undefined,
      });
      // Auto-analyze the created log so nutrients/summaries are up-to-date
      try {
        await analyzeFood(created.id);
      } catch {
        // Ignore analyze errors here; UI can retry per item
      }
      setFoodDescription("");
      setTime("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="mealTime" className="block text-sm font-medium text-gray-700 mb-2">
          Meal Time
        </label>
        <select
          id="mealTime"
          value={mealTime}
          onChange={(e) => setMealTime(e.target.value as MealTime)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <div>
        <label htmlFor="foodDescription" className="block text-sm font-medium text-gray-700 mb-2">
          What did you eat?
        </label>
        <textarea
          id="foodDescription"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          placeholder="e.g., 2 eggs, toast with butter, orange juice, 100g oats, 1 tsp honey"
          rows={3}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time (optional)
        </label>
        <TimePicker value={time} onChange={setTime} />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !foodDescription.trim()}
        className="w-full py-2 px-4 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging..." : "Log Food"}
      </button>
    </form>
  );
}

