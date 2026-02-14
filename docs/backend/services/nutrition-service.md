---
sidebar_position: 5
title: "Nutrition Service"
description: "AI-powered meal planning and macro tracking"
---
# Nutrition Service

The Nutrition Service provides AI-powered analysis and nutritional logging via Google Gemini.

## 🚀 Responsibilities
- **AI Analysis**: Analyzing food from images or text via Gemini 1.5 Pro.
- **Macro Tracking**: Tracking calories, protein, carbs, and fats.

## 🛠️ Technical Details
- **Port**: `3004`
- **Database**: `fitnexa_nutrition` (PostgreSQL)
- **AI**: Google Generative AI SDK

## 📡 API Endpoints
- `POST /analyze`: Send image/prompt for AI nutritional estimates.
- `POST /log`: Store a food entry.
- `GET /history/:userId`: Retrieve user tracking history.

---
Related: [AI Guidelines](../../ai-governance/guidelines.md) · [Content Service](content-service.md)
