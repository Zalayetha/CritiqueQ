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

You will need **two terminal tabs**:

#### Terminal 1 — Start the API Server
```bash
pnpm dev
```
The server will start on [http://localhost:3000](http://localhost:3000).

#### Terminal 2 — Start the Background Queue Worker
```bash
pnpm worker:dev
```

---

## 📖 API Documentation & Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/job` | List all feedback analysis jobs |
| `POST` | `/job` | Submit a new feedback job for AI analysis |
| `GET` | `/job/:id` | Get job status and the generated analysis result |

### Example: Submit Feedback Job

```bash
curl -X POST http://localhost:3000/job \
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
