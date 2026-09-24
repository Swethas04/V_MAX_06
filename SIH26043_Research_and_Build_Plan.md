# SIH 2026 — PS 26043: Societal Innovation Collaboration Portal

**Org:** Govt of Jharkhand | **Dept:** Higher & Technical Education | **Category:** Software | **Theme:** Smart Education

---

## 1. What the problem is actually asking

Strip away the wording and it's three linked systems glued together:

1. **Citizen → Problem intake** (like a civic complaint app, but for *any* societal issue, not just potholes)
2. **AI Router** — classify, dedupe, prioritize, and match each problem to the right university/department based on expertise
3. **University ↔ Industry collaboration workspace** — teams form, mentors get assigned, proposals get built, funding/prototyping happens, progress gets tracked
4. Wrapped in a **government analytics dashboard** for oversight (submissions, district-wise heatmaps, patents, startups spun off, social impact).

So it's really: **Reddit-style problem submission + AI ticket-routing (like a helpdesk) + Trello/Jira-style project workspace + Power BI-style dashboard**, all in one app, scoped to Jharkhand's public problems.

---

## 2. Existing solutions (what's already out there)

| Platform | What it does | Gap vs. PS 26043 |
|---|---|---|
| **Manthan Portal** (MyGov + PSA) | Demand-side (govt/PSU) posts a challenge, supply-side (researchers/startups) submits proposals; national scale | No *citizen-submitted* problems — challenges are posted top-down by ministries, not bottom-up by the public. No university-team formation or project-lifecycle tracking after proposal selection. |
| **MyGov Innovate India** | Crowdsources innovations citizens/innovators already built, lets people rate/comment/share | It's a showcase for finished innovations, not a pipeline that takes a raw *problem* and routes it to be solved. No AI categorization/routing. |
| **Swachhata App / civic issue apps (FixMyStreet, SeeClickFix)** | Citizens report a specific issue (garbage, potholes) with photo+GPS, gets routed to a municipal department | Domain-locked to sanitation/infrastructure; routing goes to govt departments, not universities; no research/prototyping/industry layer at all. |
| **SIH 25031 (Jharkhand, last year)** — Crowdsourced Civic Issue Reporting | Near-identical intake pattern (citizens report, admin resolves) but scoped to civic infra | Confirms Jharkhand already wants this pattern generalized — PS 26043 is the "grown-up" version spanning every sector + adding the university/industry solving layer. |
| **Challenge.gov (US)** | Federal agencies post prize challenges, public/researchers submit solutions | Same demand-side-only limitation as Manthan; no automatic AI routing by academic expertise. |
| **Zooniverse / citizen-science platforms** | Crowdsources labour on research tasks | Good pattern for "citizen contributes → institution processes" but it's one-directional (no feedback loop or implementation tracking). |

**Net takeaway:** nothing today closes the loop from *citizen raises a problem → AI matches it to the right lab/department → multidisciplinary team + industry partner formed → prototype tested → deployed → citizen sees outcome*. Every existing platform does one or two segments of this chain, not the whole thing. That end-to-end loop, with visible closure back to the citizen, is your biggest differentiation lever.

---

## 3. Proposed solution — "Samadhan Setu" (सेतु = bridge; adjust name freely)

### Core modules (mapped to what the PS explicitly asks for)

1. **Citizen Engagement Module**
   - Submit a problem: title, description, category (or let AI suggest), photo/video, voice note (regional language), auto-captured GPS + optional manual pin, supporting docs.
   - Track status of your own submission (Submitted → Under Review → Assigned to [University] → Team Formed → Prototype → Piloted → Resolved).
   - Upvote / "me too" on existing problems near you to signal severity (also acts as a dedupe UX).

2. **AI Problem Management Module**
   - **Classification:** multilingual NLP (Hindi/English/regional) → maps free text to themes (education, agri, health, water, environment, urban infra, accessibility, etc.)
   - **Deduplication:** embedding similarity search (vector DB) against existing open problems in the same geography — merges duplicates, aggregates upvotes instead of creating noise.
   - **Prioritization:** score = severity (from text sentiment/keywords) × frequency (duplicate count) × affected population estimate.
   - **Routing:** match against a structured "university capability graph" — each HEI tags its departments, faculty specializations, active research areas, incubation cells — routing is a similarity/graph match, not just keyword-category match.

3. **University Collaboration Module**
   - Institutional dashboard: incoming assigned challenges, accept/reject/reroute.
   - Team builder: pull in students + faculty mentor across disciplines (tag by skillset), Kanban-style project board.
   - Proposal submission with milestone plan.

4. **Industry Partnership Module**
   - Startups/MSMEs/CSR/R&D labs browse university-approved proposals seeking funding/mentorship/prototyping support.
   - Structured "offer": mentorship hours, funding amount, lab access, or pilot deployment site.
   - Matching logic similar to routing — industry tags their domain interest, gets notified of relevant proposals.

5. **Project Lifecycle Management**
   - Milestone tracker, document vault, approvals workflow, IP/patent flag, testing outcome logs, deployment status.

6. **Analytics Dashboard (Govt-facing, web)**
   - District-wise heatmap of submissions, theme-wise distribution, funnel conversion (submitted → resolved), institutional participation leaderboard, industry engagement volume, patents/startups generated, social outcome tracking.

7. **Notification & Communication Layer**
   - Push notifications + SMS fallback (rural connectivity) at every status change; in-app chat/threaded comments per problem/project.

### Innovation layer — what makes it stand out at judging

- **Closed-loop visibility for the citizen**: most govt platforms are a black box after submission. Show the *actual student team, mentor, and progress bar* on the problem the citizen filed — this alone is a strong differentiator and directly demonstrates NEP 2020's "real-world learning" angle.
- **Capability graph instead of static category routing**: university expertise isn't static — model it as a live graph (faculty publications, past project tags, equipment/lab tags) so routing improves as the platform is used, not a hardcoded lookup table.
- **Federated duplicate-detection using geo + semantic embeddings**: prevents the same water-scarcity complaint from spawning 40 separate "new" tickets across a district — aggregates it into one high-priority, well-evidenced case.
- **Offline-first submission (rural reach)**: form fills and photo/voice capture work offline, queue and sync when connectivity returns — critical for rural Jharkhand.
- **Social-impact scorecard, not just completion status**: track downstream metrics after "resolved" (e.g., number of people served, cost saved, follow-on funding raised) rather than closing the loop at "prototype delivered."
- **Gamified institutional leaderboard**: public ranking of HEIs by challenges resolved/impact created — creates competitive incentive for colleges to actually engage (addresses the PS's stated "collaboration remains fragmented" problem directly).
- **Explainable AI routing**: when a problem is routed to University X, show *why* (matched keywords/faculty specialization) — builds institutional trust in the AI decision, reduces manual override friction.

---

## 4. Tech stack (mobile-first build)

**Mobile app (citizen + student + faculty + industry — one app, role-based views)**
- **Flutter** (Dart) — single codebase for Android/iOS, strong offline support (Hive/Drift local DB), good camera/voice/GPS plugin ecosystem. *(React Native is the alternative if your team knows JS better — Flutter wins on offline-first performance.)*

**Backend**
- **Node.js + NestJS** (TypeScript) — modular, good for the multi-role workflow/RBAC nature of this system. *(FastAPI/Python is a fine alternative, especially if your AI pipeline is also Python-heavy and you want to avoid a service boundary.)*
- **PostgreSQL** — relational core (users, problems, projects, milestones, institutions) + **PostGIS** extension for geo-queries (district heatmaps, nearby-problem dedupe).
- **Redis** — caching, job queues (BullMQ) for async AI processing.
- **pgvector** (Postgres extension) or **Qdrant** — vector store for semantic dedupe/similarity search. Skip a separate vector DB if team size is small; pgvector keeps infra simple.

**AI/ML layer**
- **Classification & routing:** fine-tuned/prompted multilingual model — IndicBERT or a hosted LLM (via API) for classification + embeddings (e.g., `sentence-transformers` multilingual models, or OpenAI/Gemini embeddings) for dedupe similarity.
- **Voice-to-text (regional languages):** Bhashini API (Govt of India's own multilingual ASR/translation stack — strong fit since this is a govt PS) or Whisper as fallback.
- **Image moderation/basic tagging:** any vision API (e.g., Google Vision) to auto-flag inappropriate uploads and extract basic scene tags.

**Infra/DevOps**
- **AWS or GCP** (govt projects often lean toward NIC/MeghRaj cloud — mention this as the production target even if you prototype on AWS/GCP free tier).
- **Docker** for all services, **GitHub Actions** for CI/CD.
- **Firebase Cloud Messaging** for push notifications; **MSG91/Twilio** for SMS fallback.

**Dashboard (web, govt-facing)**
- **React + TypeScript** + a charting lib (Recharts or Apache ECharts) + Mapbox/Leaflet for the geo heatmap.

---

## 5. High-level architecture (text form)

```
[Flutter App] --HTTPS/JWT--> [NestJS API Gateway]
                                    |
        --------------------------------------------------------
        |                |                  |                  |
   [Auth/RBAC]     [Problem Service]   [Project Service]  [Notification Svc]
        |                |                  |
        |         [AI Worker Queue] <--Redis/BullMQ
        |                |
        |         [Classification+Embedding model / Bhashini ASR]
        |                |
   [PostgreSQL + PostGIS + pgvector]  <-- single source of truth
                                    |
                          [Analytics/BI service --> React Dashboard]
```

---

## 6. Antigravity build prompt

Paste this into Antigravity to scaffold the project. Adjust module order based on what you want built first (recommend: Auth → Citizen submission → AI routing stub → University workspace → Dashboard, in that order for a hackathon build).

```
Build a mobile-first application called "Samadhan Setu" — a Societal Innovation
Collaboration Portal for Smart India Hackathon PS 26043 (Govt of Jharkhand,
Dept of Higher & Technical Education).

STACK:
- Mobile app: Flutter (Dart), offline-first using Drift/Hive for local queueing
- Backend: Node.js + NestJS (TypeScript), REST API with JWT auth and role-based
  access control (roles: citizen, student, faculty, industry_partner, admin)
- Database: PostgreSQL with PostGIS (geo queries) and pgvector (embedding
  similarity search for problem deduplication)
- Queue: Redis + BullMQ for async AI processing jobs
- Web dashboard: React + TypeScript + Recharts + Leaflet, read-only analytics
  view for government admins

CORE ENTITIES:
- User (role, name, phone, language preference, institution/org affiliation)
- Problem (title, description, category[auto+manual], media[], geo-location,
  status enum, priority score, duplicate_of[nullable], submitted_by, upvotes)
- Institution (name, departments[], faculty[], research_areas[], incubation_cells[])
- ProjectTeam (linked problem, university, students[], faculty_mentor,
  industry_partner[nullable], status, milestones[])
- Milestone (title, due_date, status, attachments[])
- Notification (user, message, type, read_status)

FEATURE MODULES TO SCAFFOLD (in this order):
1. Auth module: phone/OTP login, role selection, JWT issuance, RBAC guards.
2. Citizen problem-submission flow: form with title/description/photo/voice-
   note upload, GPS auto-capture with manual override, offline queue that
   syncs when connectivity returns, and a status-tracking screen per
   submission showing a visual pipeline (Submitted -> Under Review ->
   Assigned -> Team Formed -> Prototype -> Piloted -> Resolved).
2b. Also let citizens upvote/"me too" existing nearby problems instead of
   resubmitting duplicates (show similar existing problems as they type,
   using a stubbed similarity-search endpoint).
3. AI routing worker (stub with a clear interface to swap in a real model
   later): takes problem text, returns { category, priority_score,
   duplicate_candidate_ids[], suggested_institution_ids[] } — implement
   category by simple keyword/embedding matching, priority by a
   weighted formula, and duplicate detection via pgvector cosine similarity
   on a text embedding column.
4. University collaboration module: institution dashboard listing routed
   problems with accept/reroute actions, team-builder UI to add students/
   faculty by skill tag, and a Kanban board for the project's milestones.
5. Industry partnership module: browse university-approved proposals filtered
   by domain tag, and a structured "offer" form (mentorship/funding/lab
   access/pilot site).
6. Notification service: in-app + push (Firebase Cloud Messaging) on every
   status transition, with an SMS-fallback interface (stub the provider call).
7. Admin analytics web dashboard: district-wise heatmap of problem density
   (Leaflet + PostGIS query), theme-wise bar chart, funnel chart
   (submitted -> resolved conversion), and an institution leaderboard table
   ranked by problems resolved.

NON-FUNCTIONAL REQUIREMENTS:
- Support Hindi + English UI at minimum, with i18n scaffolding for adding
  more Indian languages later.
- All list/detail screens must handle empty and offline states gracefully.
- API responses should be paginated and geo-filterable (radius/district).
- Include seed data: 3 sample institutions with departments/research areas,
  10 sample problems across categories, 2 sample project teams — so the app
  is demoable immediately after setup.

Start by scaffolding the NestJS backend with the entity models and Auth
module fully working end-to-end (register/login/JWT), then scaffold the
Flutter app's navigation shell with role-based home screens, then implement
module 2 (citizen submission flow) fully before moving to later modules.
```

---

## 7. Suggested build order for the hackathon window

1. Auth + role-based navigation shell (Flutter + NestJS) — get login working across all 4 roles first, everything else depends on it.
2. Citizen submission + status tracker — this is your demo's opening scene.
3. AI routing stub (rule-based is fine for a hackathon; swap to a real embedding model if time permits) — this is the PS's headline "AI-enabled" requirement, don't skip it even in stub form.
4. University workspace (team builder + Kanban) — shows the "collaboration" half of the title.
5. Admin dashboard — this is what judges from a *government* PS usually weight heavily; don't leave it for the last hour.
6. Industry module + notifications — nice-to-have polish if time remains.

Want me to also draft the pitch-deck narrative (problem → solution → impact → demo flow) once the build is further along, or generate the ER diagram / API contract next?
