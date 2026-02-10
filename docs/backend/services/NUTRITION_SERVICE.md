# Nutrition Service

The Nutrition Service provides AI-powered food analysis and nutritional logging.

## 🚀 Responsibilities
- **AI Analysis**: Integrating with Google Gemini AI to analyze food from images or text descriptions.
- **Nutritional Logging**: Tracking daily calorie and macronutrient (Protein, Carbs, Fats) intake.
- **History Tracking**: Providing historical data for user progress visualization.

## 🛠️ Technical Details
- **Port**: 3003
- **Database**: `fitnexa_nutrition` (PostgreSQL)
- **AI Integration**: Google Generative AI (Gemini) SDK.
- **Key Model**: `FoodLog`.

## 📡 API Endpoints

### Food Logic
- `POST /analyze`: Send an image or prompt to Gemini AI to get nutritional estimates.
- `POST /log`: Store a confirmed food entry in the database.
- `GET /history/:userId`: Retrieve the user's food log history.
- `PUT /log/:id`: Edit a previously stored food entry.
- `DELETE /log/:id`: Remove a food entry.

## 💾 Model: FoodLog
| Field | Type | Description |
|-------|------|-------------|
| userId| String | Owner of the log |
| foodName | String | Name of the food item |
| calories | Int | Total energy in kcal |
| protein | Float | Protein in grams |
| carbs | Float | Carbohydrates in grams |
| fats | Float | Fats in grams |

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
