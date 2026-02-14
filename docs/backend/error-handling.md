---
sidebar_position: 4
title: "Error Handling"
description: "Standardized error hierarchy and reporting in the backend"
---
# Backend Error Handling

FitNexa uses a standardized hierarchy of customized error classes, defined in `@fitnexa/shared/errors`.

## 🏗️ Class Hierarchy
Standard errors automatically map to the correct HTTP status codes in the global error middleware:

```text
AppError (Base)
├── NotFoundError     (404)
├── ConflictError     (409)
├── ValidationError   (400)
├── UnauthorizedError (401)
└── ForbiddenError    (403)
```

## 🚀 Usage in Services

Instead of using raw `throw new Error()`, use the specific error class:

```typescript
import { NotFoundError } from '@fitnexa/shared/errors';

const gym = await prisma.gym.findUnique({ where: { id } });

if (!gym) {
  throw new NotFoundError('Gym not found');
}
```

## 📡 Structured Responses
The global error handler catches these and returns a consistent JSON body:
```json
{
  "error": "Gym not found",
  "statusCode": 404,
  "service": "gym-service"
}
```

---
Related: [Backend Architecture](architecture.md) · [API Client Guide](../frontend/api-client.md)
