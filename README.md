# Habit Tracker Backend

REST API backend powering a habit tracking, calorie logging, and AI-assisted recipe management app. Built with Node.js, Express, and MongoDB, with JWT-based authentication protecting all user-specific data.

## Features

- **Authentication** — secure registration and login with hashed passwords (bcrypt) and JWT tokens
- **Habit Tracking** — create, update, delete habits; daily completion tracking with automatic streak calculation; date-based navigation for viewing past days
- **Calorie Logging** — log food entries with real nutrition data (via an external AI agent service), daily totals, and a personalized maintenance calorie goal calculated with the Mifflin-St Jeor equation based on the user's weight, height, age, sex, and activity level
- **Saved Recipes** — save, view, and delete AI-suggested recipes for later reference
- **User Profiles** — store and update weight, height, age, sex, and activity level, used to personalize calorie goals

## Tech Stack

- **Runtime/Framework:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JSON Web Tokens (jsonwebtoken), bcryptjs for password hashing
- **Other:** express-async-errors for cleaner async error handling, express-rate-limit on auth routes, CORS enabled for cross-origin requests from the mobile app

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create a new account |
| POST | `/api/v1/auth/login` | Log in, receive a JWT |
| GET | `/api/v1/habits` | List habits (optional `?date=` filter) |
| POST | `/api/v1/habits/create` | Create a habit |
| PATCH | `/api/v1/habits/:id` | Update a habit |
| PATCH | `/api/v1/habits/:id/complete` | Toggle a habit's completion for a given date |
| DELETE | `/api/v1/habits/:id` | Delete a habit |
| GET | `/api/v1/food-log` | Get calorie entries + daily total + goal for a date |
| POST | `/api/v1/food-log` | Log a food entry |
| DELETE | `/api/v1/food-log/:id` | Delete a food entry |
| GET | `/api/v1/saved-recipes` | List saved recipes |
| POST | `/api/v1/saved-recipes` | Save a recipe |
| DELETE | `/api/v1/saved-recipes/:id` | Delete a saved recipe |
| GET | `/api/v1/user/me` | Get current user's profile |
| PATCH | `/api/v1/user/me` | Update current user's profile |

All routes except `/auth/*` require a `Bearer` token in the `Authorization` header.

## Architecture Note

This backend is one part of a two-service architecture: this Node/Express service handles authentication, habit tracking, calorie/recipe persistence, and user profiles, while a separate Python/FastAPI service (using LangChain and Google Gemini) handles the AI agent — RAG-based recipe recommendations and food-calorie estimation. The two services communicate over HTTP, with the AI service calling back into this API to persist data the agent logs on the user's behalf.

## Running Locally

```bash
git clone <repo-url>
cd habit_tracker_backend
npm install
```

Create a `.env` file in the root with:
