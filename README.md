# GoneByFriday

Last-minute weekend trip app that alerts you to steal-priced flights from your home airport, builds AI-powered itineraries, and handles hotel booking with loyalty points optimization.

## Stack

- **Frontend**: React + Vite, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude API (claude-sonnet-4-5)
- **Calendar**: Google Calendar API via OAuth
- **Notifications**: Web Push API (VAPID)

## Setup

### 1. Clone and install dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` via the SQL editor
3. This creates all tables and seeds 10 CLT deals + Hilton properties

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_CALENDAR_CLIENT_ID=your-google-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-google-secret
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=your-email@example.com
```

For the frontend, create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### 4. Run locally

```bash
# Backend (from project root)
uvicorn backend.main:app --host 0.0.0.0 --port 8000

# Frontend (from frontend/)
npm run dev
```

### 5. Run on Replit

The `.replit` file is pre-configured. Just set environment variables as Replit Secrets and hit Run.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/deals` | List deals with filters |
| GET | `/deals/{id}` | Single deal with Hilton properties |
| POST | `/itinerary/generate` | Generate AI itinerary |
| POST | `/alerts/subscribe` | Subscribe to push alerts |
| POST | `/alerts/trigger` | Manually trigger alert job |
| POST | `/calendar/add-events` | Add trip to Google Calendar |
| GET | `/wallet/{user_id}` | Get loyalty accounts |
| POST | `/wallet` | Add loyalty account |

## Project Structure

```
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── components/ # UI screens
│   │   ├── lib/        # API client, Supabase, push
│   │   └── types/      # TypeScript types
│   └── package.json
├── backend/            # FastAPI app
│   ├── routers/        # API route handlers
│   ├── services/       # Business logic
│   ├── models/         # Pydantic schemas
│   ├── db/             # Supabase client
│   └── cron/           # Scheduled jobs
├── supabase/
│   └── migrations/     # SQL schema + seed data
└── .env.example
```
