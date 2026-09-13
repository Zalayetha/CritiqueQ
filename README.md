# CritiqueQ 🎯

CritiqueQ is an AI-powered feedback analysis and triage service built with Hono, BullMQ, and Prisma 8.

---

## 🚀 Getting Started

Follow these step-by-step instructions to run the application locally.

### Prerequisites

Ensure you have installed:
- **Node.js**: `v24+`
- **pnpm**: `v11+`
- **Docker & Docker Compose**: for PostgreSQL and Redis

---

### Step 1: Clone & Install Dependencies

```bash
git clone https://github.com/Zalayetha/CritiqueQ.git
cd CritiqueQ
pnpm install
```

---

### Step 2: Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Fill in `.env` with your values:
```env
DATABASE_URL="postgresql://hono:hono@localhost:55432/hono"
OPENAI_API_KEY="your-openai-or-anvia-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1" # or custom proxy base URL
WORKER_URL="localhost"
```

---

### Step 3: Start Infrastructure (PostgreSQL & Redis)

Start the local PostgreSQL and Redis instances using Docker:

```bash
docker compose up -d
```

---

### Step 4: Emit Prisma Contract & Sync Database

Generate Prisma contract artifacts and apply changes to your database:

```bash
pnpm prisma contract emit
pnpm prisma db update
```

---

### Step 5: Start the Application

You can start both the API server and queue worker concurrently in a single command:

```bash
pnpm dev:all
```

Or run them individually in separate terminals:

```bash
# Terminal 1: API Server (http://localhost:3000)
pnpm dev

# Terminal 2: Background Queue Worker
pnpm worker:dev
```

---

## 📖 API Documentation & Endpoints

Interactive OpenAPI Reference UI is available at **[http://localhost:3000/scalar](http://localhost:3000/scalar)**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/scalar` | Interactive Scalar API documentation |
| `GET` | `/doc` | OpenAPI 3.0 spec JSON |
| `GET` | `/jobs` | List all feedback analysis jobs |
| `POST` | `/jobs` | Submit a new feedback job for AI analysis |
| `GET` | `/jobs/:id` | Get job detail and analysis result |

### Example: Submit Feedback Job

```bash
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackText": "The app crashes every time I try to export my analytics report on iOS 18.",
    "source": "appstore",
    "userTier": "premium"
  }'
```

---

## 🧪 Testing & Verification

- **Typecheck**: `pnpm typecheck`
- **Build**: `pnpm build`
