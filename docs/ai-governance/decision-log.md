---
sidebar_position: 2
title: "Decision Log"
description: "History of architectural and policy decisions regarding AI"
---
# AI Decision Log

Log of significant decisions and model transitions.

## [2024-05-10] Transition to Gemini
- **Decision**: Switching from GPT-4 to Google Gemini Pro.
- **Rationale**: Better integration with our Google Cloud infrastructure and improved long-context handling for full workout plan generation.

## [2024-03-15] Deterministic Guardrails
- **Decision**: implementing a rule-based layer on top of AI nutrition plans.
- **Rationale**: Prevent AI from suggesting unsafe calorie deficits for members with high activity levels.

---
Related: [AI Guidelines](guidelines.md)
