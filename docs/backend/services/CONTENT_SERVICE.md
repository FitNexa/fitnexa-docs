# Content Service

The Content Service is the repository for all fitness-related assets, including workout routines, exercise data, and gym products.

## 🚀 Responsibilities
- **Workout Library**: Storing workout routines with nested exercise data.
- **Product Catalog**: Managing supplement and merchandise data for gym shops.
- **Content Delivery**: Serving metadata and images for workout programs.

## 🛠️ Technical Details
- **Port**: 3004
- **Database**: `fitnexa_content` (PostgreSQL)
- **Key Models**: `WorkoutRoutine`, `Product`.

## 📡 API Endpoints

### Workout Routes
- `GET /workouts`: List all available workout routines.
- `GET /workouts/:id`: Get detailed exercise breakdown for a routine.
- `GET /workouts/category/:category`: Filter routines by type (Cardio, Strength, etc.).

### Product Routes
- `GET /products`: List gym shop inventory.
- `GET /products/featured`: Get high-priority promoted products.

## 💾 Model: WorkoutRoutine
| Field | Type | Description |
|-------|------|-------------|
| title | String | Name of the routine |
| difficulty| String | Beginner, Intermediate, Advanced |
| targetMuscles| String[] | Array of muscle groups |
| exercises | Json | Structured list of sets, reps, and exercise IDs |

---
[Back to Services Catalog](../SERVICES_CATALOG.md)
