from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import MealTime

class FoodLogCreate(BaseModel):
    date: str
    meal_time: MealTime
    food_description: str
    time: str | None = None

class FoodLogResponse(BaseModel):
    id: int
    user_id: int
    date: str
    meal_time: MealTime
    time: str | None = None
    food_description: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NutrientBreakdown(BaseModel):
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float

class FoodAnalysisResponse(BaseModel):
    id: int
    food_log_id: int
    calories: float
    protein: float
    carbs: float
    fats: float
    fiber: float
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True

class FoodAnalysisRequest(BaseModel):
    food_log_id: int

class FoodSummaryRequest(BaseModel):
    date: str

class FoodReplacement(BaseModel):
    current_food: str
    current_calories: float
    replacement_food: str
    replacement_calories: float
    reason: str

class DietPlanResponse(BaseModel):
    id: int
    user_id: int
    recommendations: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
