from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter()

@router.post("/", response_model=schemas.FoodLogResponse)
async def create_food_log(
    food_log: schemas.FoodLogCreate,
    db: Session = Depends(get_db)
):
    """Create a new food log entry"""
    db_food_log = models.FoodLog(
        user_id=1,  # Default user_id for now
        date=food_log.date,
        meal_time=food_log.meal_time,
        time=food_log.time,
        food_description=food_log.food_description
    )
    db.add(db_food_log)
    db.commit()
    db.refresh(db_food_log)
    return db_food_log

@router.get("/", response_model=List[schemas.FoodLogResponse])
async def get_food_logs(
    date: str = None,
    db: Session = Depends(get_db)
):
    """Get food logs, optionally filtered by date"""
    query = db.query(models.FoodLog).filter(models.FoodLog.user_id == 1)
    if date:
        query = query.filter(models.FoodLog.date == date)
    return query.order_by(models.FoodLog.date.desc(), models.FoodLog.meal_time).all()

@router.get("/{food_log_id}", response_model=schemas.FoodLogResponse)
async def get_food_log(
    food_log_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific food log by ID"""
    food_log = db.query(models.FoodLog).filter(
        models.FoodLog.id == food_log_id,
        models.FoodLog.user_id == 1
    ).first()
    if not food_log:
        raise HTTPException(status_code=404, detail="Food log not found")
    return food_log

@router.put("/{food_log_id}", response_model=schemas.FoodLogResponse)
async def update_food_log(
    food_log_id: int,
    food_log: schemas.FoodLogCreate,
    db: Session = Depends(get_db)
):
    """Update a food log entry"""
    db_food_log = db.query(models.FoodLog).filter(
        models.FoodLog.id == food_log_id,
        models.FoodLog.user_id == 1
    ).first()
    if not db_food_log:
        raise HTTPException(status_code=404, detail="Food log not found")

    db_food_log.date = food_log.date
    db_food_log.meal_time = food_log.meal_time
    db_food_log.time = food_log.time
    db_food_log.food_description = food_log.food_description
    db.commit()
    db.refresh(db_food_log)
    return db_food_log

@router.delete("/{food_log_id}", status_code=204)
async def delete_food_log(
    food_log_id: int,
    db: Session = Depends(get_db)
):
    """Delete a food log entry"""
    db_food_log = db.query(models.FoodLog).filter(
        models.FoodLog.id == food_log_id,
        models.FoodLog.user_id == 1
    ).first()
    if not db_food_log:
        raise HTTPException(status_code=404, detail="Food log not found")

    # Delete related analysis first for quicker cleanup
    db.query(models.FoodAnalysis).filter(
        models.FoodAnalysis.food_log_id == food_log_id
    ).delete(synchronize_session=False)

    db.delete(db_food_log)
    db.commit()
    return Response(status_code=204)
