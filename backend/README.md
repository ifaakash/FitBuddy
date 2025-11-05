# FitBuddy Backend API

FastAPI backend for the FitBuddy food tracking application.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - `DATABASE_URL`: Database connection string (SQLite for development, PostgreSQL for production)
   - `OPENAI_API_KEY`: Your OpenAI API key for AI features

5. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### Food Logs
- `POST /api/food-logs/` - Create a food log
- `GET /api/food-logs/` - Get all food logs (optional `date` query parameter)
- `GET /api/food-logs/{id}` - Get a specific food log
- `PUT /api/food-logs/{id}` - Update a food log
- `DELETE /api/food-logs/{id}` - Delete a food log

### AI Analysis
- `POST /api/ai/analyze` - Analyze a food log and extract nutrients
- `POST /api/ai/summarize` - Get daily food summary
- `GET /api/ai/nutrients/{date}` - Get total nutrients for a date

### Diet Plan
- `POST /api/diet-plan/generate` - Generate a personalized diet plan
- `GET /api/diet-plan/` - Get the latest diet plan

