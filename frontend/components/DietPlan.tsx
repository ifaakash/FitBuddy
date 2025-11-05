"use client";

import { DietPlan, generateDietPlan, getDietPlan } from "@/lib/api";
import { useState, useEffect } from "react";

export default function DietPlanComponent() {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    loadDietPlan();
  }, []);

  const loadDietPlan = async () => {
    try {
      const data = await getDietPlan();
      setPlan(data);
      try {
        setRecommendations(JSON.parse(data.recommendations));
      } catch {
        setRecommendations(null);
      }
    } catch (err) {
      // No plan exists yet, that's okay
      setPlan(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateDietPlan();
      setPlan(data);
      try {
        setRecommendations(JSON.parse(data.recommendations));
      } catch {
        setRecommendations(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Personalized Diet Plan</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : plan ? "Regenerate" : "Generate Plan"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!plan && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">
            Generate a personalized diet plan based on your food logs from the past 3-4 days.
          </p>
          <p className="text-sm text-gray-400">
            Make sure you have logged food for at least 3 days before generating a plan.
          </p>
        </div>
      )}

      {recommendations && (
        <div className="space-y-6">
          {recommendations.high_calorie_foods && recommendations.high_calorie_foods.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Food Replacements
              </h3>
              <div className="space-y-4">
                {recommendations.high_calorie_foods.map((food: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-800">{food.food}</p>
                        <p className="text-sm text-gray-600">{food.issue}</p>
                      </div>
                      <span className="text-sm font-semibold text-red-600">
                        {food.calories} cal
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-sm font-medium text-green-700 mb-1">
                        → Replace with: {food.replacement}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {food.replacement_calories} calories • {food.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.general_recommendations &&
            recommendations.general_recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  General Recommendations
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {recommendations.general_recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

          {recommendations.meal_timing_suggestions && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Meal Timing Suggestions
              </h3>
              <p className="text-gray-700">{recommendations.meal_timing_suggestions}</p>
            </div>
          )}
        </div>
      )}

      {plan && !recommendations && (
        <div className="text-gray-700 whitespace-pre-wrap">{plan.recommendations}</div>
      )}
    </div>
  );
}

