# UptimeBot

A scalable uptime monitoring backend service built with TypeScript, Express, Prisma, PostgreSQL, and node-cron.

## Features

### ✅ Authentication

- Signup & Login with auth that stores JWT in cookies
- Auth middleware to protect routes

### 🔗 URL Monitoring

- Add/remove URLs to be monitored
- Optional headers per URL (e.g. for authenticated endpoints)

### ⏰ Scheduler

- Polls every 10 minutes using node-cron
- Custom HTTP headers support
- Axios-based pings with response time and status code logging

### 📊 Metrics

- Get ping metrics for each URL (last 2 days)
- Summary endpoint with:

  - Uptime %
  - Average response time
  - Latest status
  - Downtime streak

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Scheduler:** node-cron
- **Validation:** Zod
- **Auth:** JWT
- **ORM:** Prisma
- **Dev Tools:** ts-node-dev, dotenv

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/Anyr00d/uptime-bot.git
cd backend/api
npm install
```

### 2. Environment Variables

Create a `.env` file in `apps/api`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/uptimebot
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 3. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the Server

```bash
npm run dev
```

#### 👤 Auth Routes

- `POST /api/auth/signup` – Register new user
- `POST /api/auth/login` – Login and get JWT
- `GET /api/auth/me` – Get current logged-in user details

#### 🔍 URL Monitor Routes

- `POST /api/url` – Add a new URL to monitor
- `GET /api/url` – Get all URLs of the user
- `DELETE /api/url/:id` – Soft-delete a URL
- `GET /api/url/:id/metrics` – Fetch recent pings for a URL
- `GET /api/url/:id/summary` – Get uptime stats for a URL

## Folder Structure

```
backend/
├── prisma/                 # Prisma schema and migration files
│   └── schema.prisma
├── src/
│   ├── routes/             # Express route handlers (e.g., auth.ts, monitor.ts)
│   ├── middleware/         # Auth, validation middlewares
│   ├── schemas/            # Zod schemas for request validation
│   ├── scheduler/          # URL polling and cron job logic
│   ├── types/              # Custom TypeScript types (e.g., ValidatedRequest)
│   ├── utils/              # Utility functions (e.g., JWT helpers)
│   └── index.ts            # Express server entry point
└── package.json

```
