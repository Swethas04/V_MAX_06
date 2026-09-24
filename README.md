# Samadhan Setu — सामाधान सेतु 🌉
### Societal Innovation Collaboration Portal
**SIH 2026 | PS 26043 | Govt of Jharkhand, Dept of Higher & Technical Education**

---

## What is this?

Samadhan Setu ("Solution Bridge") closes the loop from **citizen raises a problem → AI routes it to the right university → multidisciplinary team + industry partner formed → prototype tested → citizen sees outcome**.

- **Citizen App** (Flutter): Submit problems offline, track status in real time, upvote similar issues
- **University Portal** (Flutter): Kanban board, team builder, milestone tracking
- **Industry Portal** (Flutter): Browse proposals, offer funding/mentorship/lab
- **Admin Dashboard** (React): Heatmap, analytics, institution leaderboard
- **Backend** (NestJS): JWT auth, AI routing worker, PostGIS geo-queries

---

## Quick Start

### Prerequisites
- Node.js 20 LTS
- Docker Desktop (running)
- Flutter 3.22+
- npm 10+

### 1. Start the database and Redis
```bash
cd backend
docker-compose up -d
```
Wait ~20s for PostgreSQL to initialize PostGIS + pgvector extensions.

### 2. Configure environment
```bash
cd backend
# .env was auto-copied from .env.example
# MOCK_OTP=true (accepts any 6-digit OTP for demo)
# AI_EMBEDDING_MODE=random (no external API needed)
```

### 3. Start the backend
```bash
cd backend
npm run start:dev
```
API available at: http://localhost:3000/api/v1
Swagger docs: http://localhost:3000/api/docs

### 4. Seed demo data
```bash
cd backend
npm run seed
```
This creates 3 institutions, 8 users across all roles, 10 problems, 2 teams with milestones.

### 5. Start the mobile app
```bash
cd mobile
flutter pub get
flutter run
```

### 6. Start the admin dashboard
```bash
cd dashboard
npm install
npm run dev
```
Dashboard at: http://localhost:5173

---

## Demo Login Credentials

All logins use phone/OTP. In mock mode (`MOCK_OTP=true`), any 6-digit code works.

| Role | Phone | Name |
|---|---|---|
| 🟦 Citizen | +91 9001000001 | Ramesh Kumar |
| 🟧 Faculty | +91 9001000004 | Dr. Priya Sharma |
| 🟩 Student | +91 9001000005 | Vikram Pandey |
| 🟥 Industry | +91 9001000007 | Ravi Tata |
| ⚫ Admin | +91 9000000000 | Admin User |

---

## Architecture

```
Flutter App (Mobile)  ──HTTPS/JWT──►  NestJS API (Port 3000)
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                       │
              PostgreSQL 16          Redis 7              uploads/
              + PostGIS 3.4          + BullMQ            (media files)
              + pgvector 0.7         (AI jobs)

React Dashboard (Port 5173)  ──HTTPS──►  NestJS Analytics endpoints
```

## API Endpoints

### Auth (public)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/send-otp` | Send OTP to phone |
| POST | `/api/v1/auth/verify-otp` | Verify OTP → JWT |
| PATCH | `/api/v1/auth/select-role` | Set user role |
| GET | `/api/v1/auth/profile` | Get my profile |

### Problems
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/problems` | Submit problem (multipart) |
| GET | `/api/v1/problems` | List with filters |
| GET | `/api/v1/problems/mine` | My submissions |
| GET | `/api/v1/problems/nearby?lat=&lng=&radius=` | Geo-filtered |
| GET | `/api/v1/problems/similar?q=` | Similarity search |
| POST | `/api/v1/problems/:id/upvote` | Upvote |

### Teams / Kanban
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/teams` | Create team |
| GET | `/api/v1/teams/:id/kanban` | Kanban board |
| POST | `/api/v1/teams/:id/milestones` | Add milestone |
| GET | `/api/v1/teams/proposals` | Industry browse |

### Analytics (admin)
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/analytics/district-heatmap` | Leaflet data |
| GET | `/api/v1/analytics/category-distribution` | Bar chart |
| GET | `/api/v1/analytics/status-funnel` | Funnel chart |
| GET | `/api/v1/analytics/leaderboard` | Institution ranking |
| GET | `/api/v1/analytics/summary` | KPI counts |

---

## Project Structure

```
PS043/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/          # JWT + OTP + RBAC
│   │   ├── problems/      # Citizen submissions
│   │   ├── institutions/  # University management
│   │   ├── teams/         # Kanban + team builder
│   │   ├── ai-routing/    # BullMQ worker + stub AI
│   │   ├── notifications/ # FCM + SMS stubs
│   │   └── analytics/     # PostGIS analytics
│   ├── seed/         # Demo data (3 institutions, 10 problems, 2 teams)
│   ├── docker-compose.yml
│   └── .env
├── mobile/           # Flutter app (Phase 2+)
└── dashboard/        # React admin (Phase 8)
```

---

## Swapping in Real AI (when ready)

The AI routing is a clear stub — swap out in `src/ai-routing/ai-routing.service.ts`:

1. **Classification** (`classifyCategory`): Replace keyword matching with IndicBERT or Gemini API
2. **Embeddings** (`generateEmbedding`): Replace random vectors with sentence-transformers multilingual
3. **Priority** (`computePriority`): Add sentiment score from NLP model
4. **Institution matching**: Replace tag overlap with graph-based capability matching

---

## License

MIT — Built for SIH 2026
