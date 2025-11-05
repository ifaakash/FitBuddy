# FitBuddy - Food Tracking & Diet Planning App

A full-stack web application (PWA) for tracking food intake, analyzing nutrients, and generating personalized diet recommendations using AI.

## Features

- 🍽️ **Food Logging**: Log your meals by time (morning, afternoon, evening)
- 🤖 **AI-Powered Analysis**: Automatic nutrient breakdown (calories, protein, carbs, fats, fiber)
- 📊 **Daily Summaries**: Get AI-generated summaries of your daily food intake
- 🎯 **Personalized Diet Plans**: After 3-4 days of logging, receive personalized recommendations
- 🔄 **Food Replacements**: Get suggestions to replace high-calorie, low-nutrition foods with better alternatives
- 📱 **PWA Support**: Install as a mobile app on iOS and Android

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PWA** (Progressive Web App)

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** (ORM)
- **SQLite/PostgreSQL** (Database)
- **OpenAI GPT-4** (AI Analysis)

## Project Structure

```
FitBuddy/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # API utilities
│   └── public/       # Static assets
├── backend/          # FastAPI backend application
│   ├── app/
│   │   ├── routers/  # API route handlers
│   │   ├── services/ # Business logic (AI service)
│   │   ├── models.py # Database models
│   │   └── schemas.py # Pydantic schemas
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```env
DATABASE_URL=sqlite:///./fitbuddy.db
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, defaults to localhost:8000):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Usage

1. **Log Food**: Select a date and meal time, then describe what you ate
2. **Analyze**: Click "Analyze Nutrients" on any food log to get detailed nutritional information
3. **View Summary**: See daily summaries and total nutrients for each day
4. **Generate Diet Plan**: After logging food for 3-4 days, go to the "Diet Plan" tab and click "Generate Plan" to get personalized recommendations

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

## PWA Installation

1. Open the app in a mobile browser (Chrome, Safari)
2. Look for the "Add to Home Screen" prompt or use the browser menu
3. The app will be installed and can be used offline (with cached data)

## Development

### Adding New Features

- **Backend**: Add new routes in `backend/app/routers/`
- **Frontend**: Add new components in `frontend/components/`
- **AI Service**: Modify `backend/app/services/ai_service.py` for AI-related changes

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

