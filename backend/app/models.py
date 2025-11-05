from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum, ForeignKey, Index
from sqlalchemy.sql import func
from database import Base
import enum

class MealTime(str, enum.Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)  # For future multi-user support
    date = Column(String, index=True)  # YYYY-MM-DD format
    meal_time = Column(Enum(MealTime), index=True)
    time = Column(String, nullable=True)  # Optional HH:MM
    food_description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class FoodAnalysis(Base):
    __tablename__ = "food_analyses"

    id = Column(Integer, primary_key=True, index=True)
    food_log_id = Column(Integer, ForeignKey("food_logs.id", ondelete="CASCADE"), index=True)
    calories = Column(Float)
    protein = Column(Float)  # in grams
    carbs = Column(Float)  # in grams
    fats = Column(Float)  # in grams
    fiber = Column(Float)  # in grams
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

Index("ix_food_logs_user_date", "user_id", "date")

class DietPlan(Base):
    __tablename__ = "diet_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    recommendations = Column(Text)  # JSON string of recommendations
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
