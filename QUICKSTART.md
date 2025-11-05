# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=sqlite:///./fitbuddy.db
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 3: Add PWA Icons (Optional)

Add these files to `frontend/public/`:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

You can use any image editor or online tool to create these icons.

## Step 4: Start Using the App

1. Open `http://localhost:3000` in your browser
2. Select a date and meal time
3. Enter what you ate (e.g., "2 eggs, toast with butter, orange juice")
4. Click "Log Food"
5. Click "Analyze Nutrients" to get detailed nutritional breakdown
6. After logging food for 3-4 days, go to "Diet Plan" tab and click "Generate Plan"

## Troubleshooting

### Backend won't start
- Make sure Python 3.9+ is installed
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify your `.env` file exists and has the correct values

### Frontend won't start
- Make sure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check that the backend is running on port 8000

### API errors
- Make sure the backend is running
- Check that `NEXT_PUBLIC_API_URL` in frontend matches your backend URL (default: http://localhost:8000)
- Verify your OpenAI API key is valid

### PWA not working
- PWA features work best in production build: `npm run build && npm start`
- Make sure you have icon files in `frontend/public/`
- Use HTTPS in production for full PWA functionality

