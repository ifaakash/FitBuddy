const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.12:8000";

export type MealTime = "morning" | "afternoon" | "evening";

export interface FoodLog {
  id: number;
  user_id: number;
  date: string;
  meal_time: MealTime;
  time?: string | null;
  food_description: string;
  created_at: string;
  updated_at?: string;
}

export interface FoodLogCreate {
  date: string;
  meal_time: MealTime;
  food_description: string;
  time?: string | null;
}

export interface FoodAnalysis {
  id: number;
  food_log_id: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  summary: string;
  created_at: string;
}

export interface DailyNutrients {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface DietPlan {
  id: number;
  user_id: number;
  recommendations: string;
  created_at: string;
  updated_at?: string;
}

// Food Logs API
export async function createFoodLog(data: FoodLogCreate): Promise<FoodLog> {
  const response = await fetch(`${API_BASE_URL}/api/food-logs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create food log");
  return response.json();
}

export async function getFoodLogs(date?: string): Promise<FoodLog[]> {
  const url = date
    ? `${API_BASE_URL}/api/food-logs/?date=${date}`
    : `${API_BASE_URL}/api/food-logs/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch food logs");
  return response.json();
}

export async function deleteFoodLog(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/food-logs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete food log");
}

export async function updateFoodLog(
  id: number,
  data: FoodLogCreate,
): Promise<FoodLog> {
  const response = await fetch(`${API_BASE_URL}/api/food-logs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update food log");
  return response.json();
}

// AI Analysis API
export async function analyzeFood(foodLogId: number): Promise<FoodAnalysis> {
  const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ food_log_id: foodLogId }),
  });
  if (!response.ok) throw new Error("Failed to analyze food");
  return response.json();
}

export async function getDailySummary(
  date: string,
): Promise<{ summary: string; date: string }> {
  const response = await fetch(`${API_BASE_URL}/api/ai/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
  if (!response.ok) throw new Error("Failed to get summary");
  return response.json();
}

export async function getDailyNutrients(date: string): Promise<DailyNutrients> {
  const response = await fetch(`${API_BASE_URL}/api/ai/nutrients/${date}`);
  if (!response.ok) throw new Error("Failed to get nutrients");
  return response.json();
}

// Diet Plan API
export async function generateDietPlan(): Promise<DietPlan> {
  const response = await fetch(`${API_BASE_URL}/api/diet-plan/generate`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to generate diet plan");
  return response.json();
}

export async function getDietPlan(): Promise<DietPlan> {
  const response = await fetch(`${API_BASE_URL}/api/diet-plan/`);
  if (!response.ok) throw new Error("Failed to get diet plan");
  return response.json();
}
