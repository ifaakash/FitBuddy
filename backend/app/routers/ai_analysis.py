from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from database import get_db
import models
import schemas
from services import ai_service

router = APIRouter()

@router.post("/analyze", response_model=schemas.FoodAnalysisResponse)
async def analyze_food(
    request: schemas.FoodAnalysisRequest,
    db: Session = Depends(get_db)
):
    """Analyze a food log entry and extract nutritional information"""
    food_log = db.query(models.FoodLog).filter(
        models.FoodLog.id == request.food_log_id,
        models.FoodLog.user_id == 1
    ).first()

    if not food_log:
        raise HTTPException(status_code=404, detail="Food log not found")

    # Check if analysis already exists
    existing_analysis = db.query(models.FoodAnalysis).filter(
        models.FoodAnalysis.food_log_id == request.food_log_id
    ).first()

    if existing_analysis:
        return existing_analysis

    # Get AI analysis
    analysis_data = await ai_service.analyze_food_nutrients(food_log.food_description)

    # Save analysis to database
    db_analysis = models.FoodAnalysis(
        food_log_id=request.food_log_id,
        calories=analysis_data.get("calories", 0),
        protein=analysis_data.get("protein", 0),
        carbs=analysis_data.get("carbs", 0),
        fats=analysis_data.get("fats", 0),
        fiber=analysis_data.get("fiber", 0),
        summary=analysis_data.get("summary", "")
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    return db_analysis

@router.post("/summarize")
async def summarize_daily_food(
    request: schemas.FoodSummaryRequest,
    db: Session = Depends(get_db)
):
    """Get AI summary of all food logged for a specific date"""
    food_logs = db.query(models.FoodLog).filter(
        models.FoodLog.date == request.date,
        models.FoodLog.user_id == 1
    ).all()

    if not food_logs:
        return {"summary": "No food logged for this date."}

    # Get analyses for each log
    logs_with_analysis = []
    for log in food_logs:
        analysis = db.query(models.FoodAnalysis).filter(
            models.FoodAnalysis.food_log_id == log.id
        ).first()

        logs_with_analysis.append({
            "meal_time": log.meal_time.value,
            "time": log.time,
            "food_description": log.food_description,
            "calories": analysis.calories if analysis else None
        })

    summary = await ai_service.summarize_daily_food(logs_with_analysis)

    return {"summary": summary, "date": request.date}

@router.get("/nutrients/{date}")
async def get_daily_nutrients(
    date: str,
    db: Session = Depends(get_db)
):
    """Get total nutrients for a specific date"""
    food_logs = db.query(models.FoodLog).filter(
        models.FoodLog.date == date,
        models.FoodLog.user_id == 1
    ).all()

    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fats = 0
    total_fiber = 0

    for log in food_logs:
        analysis = db.query(models.FoodAnalysis).filter(
            models.FoodAnalysis.food_log_id == log.id
        ).first()

        if analysis:
            total_calories += analysis.calories
            total_protein += analysis.protein
            total_carbs += analysis.carbs
            total_fats += analysis.fats
            total_fiber += analysis.fiber

    return {
        "date": date,
        "calories": round(total_calories, 2),
        "protein": round(total_protein, 2),
        "carbs": round(total_carbs, 2),
        "fats": round(total_fats, 2),
        "fiber": round(total_fiber, 2)
    }
