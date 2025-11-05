import os
import json
from openai import OpenAI
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_food_nutrients(food_description: str) -> Dict:
    """
    Use AI to analyze food and extract nutritional information
    """
    prompt = f"""Analyze the following food description and provide nutritional information in JSON format.
    
Food: {food_description}

Return a JSON object with the following structure:
{{
    "calories": <number>,
    "protein": <number in grams>,
    "carbs": <number in grams>,
    "fats": <number in grams>,
    "fiber": <number in grams>,
    "summary": "<brief summary of the food and its nutritional value>"
}}

Be as accurate as possible. If the food description is vague, make reasonable estimates based on typical serving sizes."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a nutrition expert. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        return json.loads(content)
    except Exception as e:
        # Fallback values if AI fails
        return {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fats": 0,
            "fiber": 0,
            "summary": f"Unable to analyze: {str(e)}"
        }

async def summarize_daily_food(food_logs: List[Dict]) -> str:
    """
    Summarize all food logs for a day
    """
    if not food_logs:
        return "No food logged for this day."
    
    food_list = "\n".join([
        f"- {log['meal_time']}: {log['food_description']}"
        for log in food_logs
    ])
    
    prompt = f"""Summarize the following food intake for the day and provide insights:

{food_list}

Provide a concise summary (2-3 sentences) of the day's eating pattern, highlighting:
- Overall nutritional balance
- Meal timing and distribution
- Any notable patterns or concerns ( don't go with negative values, when highlighting the concerns )"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a nutrition expert providing daily food summaries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Unable to generate summary: {str(e)}"

async def generate_diet_recommendations(food_history: List[Dict], nutrient_totals: Dict) -> Dict:
    """
    Analyze 3-4 days of food data and generate diet recommendations
    """
    history_text = ""
    for day_data in food_history:
        history_text += f"\nDate: {day_data['date']}\n"
        for log in day_data['logs']:
            history_text += f"  {log['meal_time']}: {log['food_description']} (Calories: {log.get('calories', 'N/A')})\n"
    
    prompt = f"""Analyze the following food intake history over the past few days and provide personalized diet recommendations:

{history_text}

Average daily totals:
- Calories: {nutrient_totals.get('avg_calories', 0):.0f}
- Protein: {nutrient_totals.get('avg_protein', 0):.1f}g
- Carbs: {nutrient_totals.get('avg_carbs', 0):.1f}g
- Fats: {nutrient_totals.get('avg_fats', 0):.1f}g

Provide recommendations in JSON format:
{{
    "high_calorie_foods": [
        {{
            "food": "<food name>",
            "calories": <number>,
            "issue": "<why it's problematic>",
            "replacement": "<suggested replacement>",
            "replacement_calories": <number>,
            "benefit": "<why replacement is better>"
        }}
    ],
    "general_recommendations": [
        "<recommendation 1>",
        "<recommendation 2>"
    ],
    "meal_timing_suggestions": "<suggestions about meal timing>"
}}

Focus on identifying high-calorie, low-nutrition foods and suggesting healthier alternatives that the user might already be eating or can easily prepare."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a nutrition expert providing personalized diet recommendations. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        return json.loads(content)
    except Exception as e:
        return {
            "high_calorie_foods": [],
            "general_recommendations": [f"Unable to generate recommendations: {str(e)}"],
            "meal_timing_suggestions": ""
        }

