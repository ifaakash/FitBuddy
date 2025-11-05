from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Dict
from database import get_db
import models
import schemas
from services import ai_service

router = APIRouter()

@router.post("/generate", response_model=schemas.DietPlanResponse)
async def generate_diet_plan(
    db: Session = Depends(get_db)
):
    """Generate a personalized diet plan based on 3-4 days of food logs"""
    user_id = 1  # Default user_id for now

    # Get food logs from the last 4 days
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=4)

    food_logs = db.query(models.FoodLog).filter(
        models.FoodLog.user_id == user_id,
        models.FoodLog.date >= start_date.strftime("%Y-%m-%d"),
        models.FoodLog.date <= end_date.strftime("%Y-%m-%d")
    ).order_by(models.FoodLog.date).all()

    if len(food_logs) < 3:
        raise HTTPException(
            status_code=400,
            detail="Need at least 3 days of food logs to generate a diet plan"
        )

    # Group logs by date
    logs_by_date = {}
    for log in food_logs:
        if log.date not in logs_by_date:
            logs_by_date[log.date] = []

        analysis = db.query(models.FoodAnalysis).filter(
            models.FoodAnalysis.food_log_id == log.id
        ).first()

        logs_by_date[log.date].append({
            "meal_time": log.meal_time.value,
            "time": log.time,
            "food_description": log.food_description,
            "calories": analysis.calories if analysis else 0
        })

    # Calculate average daily totals
    daily_totals = []
    for date, logs in logs_by_date.items():
        total_calories = sum(log.get("calories", 0) for log in logs)
        daily_totals.append(total_calories)

    # Get detailed nutrient totals for AI
    nutrient_totals = {"avg_calories": sum(daily_totals) / len(daily_totals) if daily_totals else 0}

    # Prepare history for AI
    food_history = [
        {"date": date, "logs": logs}
        for date, logs in logs_by_date.items()
    ]

    # Get more detailed nutrient info
    all_analyses = []
    for log in food_logs:
        analysis = db.query(models.FoodAnalysis).filter(
            models.FoodAnalysis.food_log_id == log.id
        ).first()
        if analysis:
            all_analyses.append(analysis)

    if all_analyses:
        nutrient_totals["avg_protein"] = sum(a.protein for a in all_analyses) / len(all_analyses)
        nutrient_totals["avg_carbs"] = sum(a.carbs for a in all_analyses) / len(all_analyses)
        nutrient_totals["avg_fats"] = sum(a.fats for a in all_analyses) / len(all_analyses)

    # Generate recommendations using AI
    recommendations = await ai_service.generate_diet_recommendations(
        food_history, nutrient_totals
    )

    # Save or update diet plan
    existing_plan = db.query(models.DietPlan).filter(
        models.DietPlan.user_id == user_id
    ).order_by(models.DietPlan.created_at.desc()).first()

    if existing_plan:
        existing_plan.recommendations = str(recommendations)
        db.commit()
        db.refresh(existing_plan)
        return existing_plan
    else:
        db_plan = models.DietPlan(
            user_id=user_id,
            recommendations=str(recommendations)
        )
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        return db_plan

@router.get("/", response_model=schemas.DietPlanResponse)
async def get_diet_plan(
    db: Session = Depends(get_db)
):
    """Get the latest diet plan for the user"""
    user_id = 1  # Default user_id for now

    diet_plan = db.query(models.DietPlan).filter(
        models.DietPlan.user_id == user_id
    ).order_by(models.DietPlan.created_at.desc()).first()

    if not diet_plan:
        raise HTTPException(status_code=404, detail="No diet plan found. Generate one first.")

    return diet_plan
