import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()


class Settings(BaseSettings):
    database_url: str
    openai_api_key: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

# Production-only: require DATABASE_URL (e.g., PostgreSQL)
if not settings.database_url:
    raise RuntimeError("DATABASE_URL is required for production.")

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_optional_time_column():
    return
