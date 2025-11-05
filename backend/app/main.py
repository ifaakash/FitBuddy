from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import engine, Base
from routers import food_logs, ai_analysis, diet_plan

# Create tables (use real migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitBuddy API",
    description="Food tracking and diet planning API",
    version="1.0.0"
)

# CORS middleware
origins = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(food_logs.router, prefix="/api/food-logs", tags=["Food Logs"])
app.include_router(ai_analysis.router, prefix="/api/ai", tags=["AI Analysis"])
app.include_router(diet_plan.router, prefix="/api/diet-plan", tags=["Diet Plan"])

@app.get("/")
async def root():
    return {"message": "FitBuddy API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
