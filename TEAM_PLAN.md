# GramaFix — 3-Person Team Plan ⏱️ (4-Hour Hackathon Execution Guide)

> **Context:** With **3 people and only 4 hours**, the biggest risk is not coding difficulty — it is **integration conflict**.  
> The best approach is to divide the project by **vertical responsibility**, define the interfaces between each person before coding, and integrate in controlled phases.

---

## 👥 Team Structure & Ownership (Full-Stack Vertical Slices)

To guarantee that **every single team member demonstrates both Frontend (React) and Backend (Spring Boot / DB CRUD) competency**, the project is divided into **three vertical functional slices**. Each member owns their domain **end-to-end (UI + Controller + Service + Repository + Database CRUD)**:

| Member | Full-Stack Vertical Ownership | Frontend Responsibilities | Backend / CRUD Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1 — Citizen Intake & Reporting** | Citizen reporting journey, landing experience & report self-service | Landing page, navigation shell, responsive report form, client validation, My Reports view, Edit modal | **CREATE** (`POST /api/issues`), **READ** (`GET /api/issues/my-reports`), **UPDATE** (`PUT /api/issues/{id}` citizen edit), **DELETE** (`DELETE /api/issues/{id}` cancel report) |
| **Member 2 — Community Feed & Upvoting** | Public issue discovery, filtering, search & community support system | Issues feed page, search bar, category filters, responsive issue card, issue details view, upvote button | **READ** (`GET /api/issues`, `GET /api/issues/{id}`, `GET /api/categories`), **CREATE/DELETE** Support (`POST`/`DELETE /api/issues/{id}/support`), DB schema & seeder |
| **Member 3 — Admin Triage & Priority Engine** | Admin dashboard, deterministic priority scoring, status lifecycle & moderation | Admin portal, KPI cards, Priority Queue ranked table, status transition modal, timeline audit view | **UPDATE** Status (`PUT /api/admin/issues/{id}/status`), **DELETE** Moderation (`DELETE /api/admin/issues/{id}`), **READ** Stats (`GET /api/admin/stats`), Priority Engine |

> [!IMPORTANT]
> **Every Member Writes Both Frontend and Backend Code.**  
> The hackathon rubric rigorously grades individual contribution across the full stack. No member is solely "frontend" or "backend". Each member implements complete CRUD features spanning React UI components, Spring Boot REST controllers, business services, and database persistence.

---

## 3.1 🔄 Master Full-Stack CRUD Allocation Matrix

This matrix maps every CRUD operation across the entire application directly to its Frontend Component, Backend API Endpoint, and Designated Member:

| Domain / Feature | CRUD Op | HTTP Verb & Endpoint | Frontend UI File | Backend Java File(s) | Owner |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Citizen Issue Report** | **CREATE** | `POST /api/issues` | `ReportIssuePage.tsx`<br>`IssueForm.tsx` | `IssueController.java`<br>`IssueCreateRequest.java`<br>`IssueService.java` | **Member 1** |
| **Resident My Reports** | **READ** | `GET /api/issues/my-reports` | `MyReportsPage.tsx` | `IssueController.java`<br>`IssueRepository.java` | **Member 1** |
| **Citizen Report Edit** | **UPDATE** | `PUT /api/issues/{id}` | `EditIssueModal.tsx` | `IssueController.java`<br>`IssueUpdateRequest.java` | **Member 1** |
| **Citizen Cancel Report** | **DELETE** | `DELETE /api/issues/{id}` | `MyReportsPage.tsx` (Cancel) | `IssueController.java`<br>`IssueService.java` | **Member 1** |
| **Community Issues Feed** | **READ** | `GET /api/issues` | `IssuesPage.tsx`<br>`IssueList.tsx`<br>`IssueCard.tsx` | `IssueController.java`<br>`IssueRepository.java` | **Member 2** |
| **Single Issue Details** | **READ** | `GET /api/issues/{id}` | `IssueDetailPage.tsx`<br>`IssueDetailsModal.tsx` | `IssueController.java`<br>`IssueResponse.java` | **Member 2** |
| **Civic Categories** | **READ** | `GET /api/categories` | `CategoryFilter.tsx` | `CategoryController.java`<br>`CategoryRepository.java` | **Member 2** |
| **Support / Upvote** | **CREATE** | `POST /api/issues/{id}/support` | `SupportButton.tsx` | `SupportController.java`<br>`SupportService.java`<br>`IssueSupport.java` | **Member 2** |
| **Remove Support** | **DELETE** | `DELETE /api/issues/{id}/support`| `SupportButton.tsx` | `SupportController.java`<br>`SupportService.java` | **Member 2** |
| **Admin Dashboard Stats**| **READ** | `GET /api/admin/stats` | `AdminPage.tsx`<br>`MetricsCard.tsx` | `AdminController.java`<br>`AdminStatsResponse.java`<br>`AdminService.java` | **Member 3** |
| **Priority Queue** | **READ** | `GET /api/admin/queue` | `PriorityQueueTable.tsx` | `AdminController.java`<br>`IssueRepository.java` | **Member 3** |
| **Status Progression** | **UPDATE** | `PUT /api/admin/issues/{id}/status` | `StatusUpdateModal.tsx`<br>`StatusTimeline.tsx` | `AdminController.java`<br>`StatusUpdateRequest.java`<br>`IssueUpdate.java` | **Member 3** |
| **Priority Calculation** | **UPDATE** | Internal Hook / Preview | `priorityCalculator.ts` | `PriorityEngineService.java` | **Member 3** |
| **Admin Moderation** | **DELETE** | `DELETE /api/admin/issues/{id}` | `AdminDashboard.tsx` (Delete) | `AdminController.java`<br>`AdminService.java` | **Member 3** |

---

## 1. 🏗️ Overall Architecture

Keep the architecture clean, lightweight, and modular without microservices:

```text
                  ┌───────────────────────┐
                  │       Browser         │
                  │  Desktop / Tablet /   │
                  │   Mobile Responsive   │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ React + TypeScript    │
                  │ Tailwind CSS          │
                  └───────────┬───────────┘
                              │ REST API
                              ▼
                  ┌───────────────────────┐
                  │ Spring Boot           │
                  │ REST API              │
                  │ Business Logic        │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ PostgreSQL            │
                  └───────────────────────┘
```

---

## 2. 🌿 Git Strategy — Decide Before Coding

Use **one GitHub repository** with clear separation:

```text
gramafix/
├── frontend/
└── backend/
```

### Branches & Workflow

Each member gets an isolated feature branch:

```text
main
├── feature/frontend (Member 1)
├── feature/backend  (Member 2)
└── feature/admin    (Member 3)
```

> [!WARNING]
> Don't keep separate branches alive for hours. Use short-lived branches merged into `main` via PRs:
> ```text
> feature/* ──> Pull Request ──> main
> ```

### Pre-Coding Agreement Checklist
Before anyone writes a line of code, agree on:
- [ ] Folder structure & package layout
- [ ] Naming conventions (camelCase for JSON, PascalCase for components)
- [ ] API response format & error handling
- [ ] Database field names
- [ ] Git branch names & commit prefixes

---

## 3. 📜 Shared Contract — MOST IMPORTANT

Before anyone writes functionality, agree on the canonical `Issue` data transfer object. **Everyone uses the exact same structure:**

```json
{
  "id": 101,
  "title": "Blocked Drain Near School",
  "description": "Drain blocked with waste...",
  "category": "DRAINAGE",
  "location": "Matale Town",
  "severity": "HIGH",
  "peopleAffected": 120,
  "priorityScore": 92,
  "priorityLevel": "CRITICAL",
  "status": "REPORTED",
  "supportCount": 15,
  "reportedBy": 5,
  "createdAt": "2026-09-04T09:30:00"
}
```

> [!NOTE]
> This contract is immutable during the build:
> - **Member 1** builds the citizen UI around it.
> - **Member 2** builds the database and REST API around it.
> - **Member 3** builds the admin dashboard and priority engine around it.
> - **No one changes field names independently.**

---

## 4. 🔠 Shared Enums

Agree on these exact uppercase enum values before coding to avoid string mismatches:

### Category
```text
ROAD
STREETLIGHT
WASTE
WATER
DRAINAGE
TRAFFIC
ENVIRONMENT
OTHER
```

### Severity
```text
LOW
MEDIUM
HIGH
CRITICAL
```

### Status
```text
REPORTED
UNDER_REVIEW
IN_PROGRESS
RESOLVED
```

### Priority
```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

## 5. ⏱️ Phase-by-Phase Execution Timeline

```text
00:00 ───────────────────────── 00:20   PHASE 0: Plan + Contract Freeze
             ↓
00:20 ───────────────────────── 00:45   PHASE 1: Parallel Foundation Setup
             ↓
00:45 ───────────────────────── 01:30   PHASE 2: Core Functionality Build
             ↓
01:30 ───────────────────────── 02:10   PHASE 3: 🔥 FIRST INTEGRATION (Check milestone)
             ↓
02:10 ───────────────────────── 02:55   PHASE 4: Complete MVP & Polish
             ↓
        [MINUTE 175]                    🚨 CODE FREEZE
             ↓
02:55 ───────────────────────── 03:25   PHASE 5: Integration Testing & QA
             ↓
03:25 ───────────────────────── 03:40   PHASE 6: Live Production Deployment
             ↓
03:40 ───────────────────────── 04:00   PHASE 7: Demo Recording & Submission
```

---

### 📍 PHASE 0 — 0 to 20 mins | Team Planning & Contract Freeze

**All 3 Members Together:**
- Finalize Problem Statement & Target Sri Lankan community context
- Freeze the MVP scope (Citizen reporting → Priority queue → Admin resolution)
- Confirm shared database schema & API JSON contract
- Confirm Git workflow & branch strategy

```text
Citizen
   ↓
Report Issue
   ↓
Validation
   ↓
Priority Score
   ↓
Issue appears in feed
   ↓
Admin reviews
   ↓
Status changes
   ↓
Resolved
```

> [!CAUTION]
> **Freeze the MVP:** Do **not** add new features after Phase 0 unless core flows are completely operational and tested.

---

### 📍 PHASE 1 — 20 to 45 mins | Parallel Foundation Setup

#### 👨‍💻 Member 1 — Frontend
- Set up React + Vite + TypeScript + Tailwind CSS
- Set up Routing (`react-router-dom`), layout, Navbar, responsive shell
- Create target route skeletons:
  - `/` (Landing Page)
  - `/issues` (Issues Feed)
  - `/issues/:id` (Issue Details)
  - `/report` (Reporting Form)
  - `/my-reports` (User Reports)
  - `/admin` (Admin Portal)
  - `/login` (Basic Auth/Simulated Session)
- Seed static mock data matching the shared contract.

#### 👨‍💻 Member 2 — Backend
- Initialize Spring Boot project (Web, JPA, Validation, PostgreSQL Driver)
- Configure `application.properties` (Database connection, CORS allowed origins)
- Create JPA entities:
  - `User`
  - `Issue`
  - `Category`
  - `IssueSupport`
  - `IssueUpdate`
- Set up Spring Data Repositories & basic Service shells.

#### 👨‍💻 Member 3 — Admin + UX
- Build Admin interface shell using mock data:
  - Admin Dashboard layout
  - Statistics Cards (Total, Pending, In Progress, Resolved)
  - Priority Queue table/card view
  - Issue Details drawer/panel
  - Status action dropdowns/buttons
- Build reusable UI badge components:
  - Priority badges (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
  - Status badges (`REPORTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`)
  - Category filters

---

### 📍 PHASE 2 — 45 to 90 mins | Core Functionality Build

#### 👨‍💻 Member 1 — Citizen Frontend
- **Landing Page (`/`)**: Hero section, value proposition, category grid, live stats, report CTA
- **Issues Feed (`/issues`)**: Search bar, category/priority filter tags, responsive issue cards
- **Report Issue Form (`/report`)**: Reactive form, input validation, immediate user feedback
- **Issue Details View (`/issues/:id`)**: Issue metadata, priority score badge, support counter, timeline

#### 👨‍💻 Member 2 — Backend REST API
- Implement core REST endpoints:
  - `GET /api/issues` (Feed with query params: search, category, status)
  - `GET /api/issues/{id}` (Issue details)
  - `POST /api/issues` (Creation with `@Valid` constraints)
  - `PUT /api/issues/{id}` (Issue update)
  - `DELETE /api/issues/{id}` (Issue removal)
  - `GET /api/categories` (Category metadata)
- Add global exception handling (`@RestControllerAdvice`) & DTO validation.

#### 👨‍💻 Member 3 — Core Business Logic & Priority Engine
- **Priority Engine Algorithm**:
  ```text
  Priority Score = (Severity × 0.40) + (People Affected × 0.30) + (Urgency × 0.20) + (Report Age × 0.10)
  ```
  - Map score (0–100) to Level: `LOW` (< 35), `MEDIUM` (35–64), `HIGH` (65–84), `CRITICAL` (≥ 85)
- Support/Upvote endpoints & logic:
  - `POST /api/issues/{id}/support`
  - `DELETE /api/issues/{id}/support`

---

### 📍 PHASE 3 — 90 to 130 mins | 🔥 FIRST INTEGRATION (Crucial Checkpoint)

> [!IMPORTANT]
> **Stop building isolated mock UIs.** All 3 members connect their components together.

1. **Member 1 (Frontend)**: Replace mock JSON with `fetch()` / `axios` calls to backend `GET /api/issues`.
2. **Member 2 (Backend)**: Connect and verify `POST /api/issues` from the frontend reporting form.
3. **Member 3 (Admin & Logic)**: Connect Admin Dashboard to live DB data and wire `PUT /api/admin/issues/{id}/status`.

#### 🧪 Integration Test #1 Flow:
```text
Open website ──> Report Issue ──> Submit Form ──> Database Store ──>
Issue List Feed ──> Open Issue Details ──> Admin Dashboard ──> Change Status ──>
Verify Status Update on Citizen Feed
```
*If this flow completes successfully, the core product is functional!*

---

### 📍 PHASE 4 — 130 to 175 mins | Finish the MVP & Refine

#### 👨‍💻 Member 1: Mobile & Responsive Polish
- Bottom navigation bar for mobile viewports
- Responsive card grids (1 col mobile, 2 col tablet, 3 col desktop)
- Form layout responsiveness & touch-friendly tap targets
- Loading spinners, error boundaries, and empty state cards

#### 👨‍💻 Member 2: Backend Robustness
- Validation error message formatting
- Priority calculation integration hook on issue save/update
- Seed script with realistic Sri Lankan test data (Kandy, Colombo, Galle, Matale)
- CORS headers for production and local environments

#### 👨‍💻 Member 3: Admin Experience & Search
- Admin priority queue sorting & filters
- Issue status history timeline
- Community support upvoting interaction
- Global search & quick filters

---

### 🚨 MINUTE 175 = CODE FREEZE 🛑

> [!WARNING]
> **No new major features after minute 175.**  
> Do not add Google Maps SDKs, complex authentication providers, or unvetted third-party services. Shift immediately to QA, testing, and deployment.

---

### 📍 PHASE 5 — 175 to 205 mins | Integration & QA Verification

All 3 members execute manual and automated verification tests:

| Test # | Test Scenario | Expected Outcome |
| :--- | :--- | :--- |
| **Test 1 — Create** | Citizen reports valid issue | Created in DB, returns 201, appears in feed |
| **Test 2 — Validation** | Submit empty title or negative affected population | Inline validation message shown, request blocked |
| **Test 3 — Search** | Search for keyword `"pothole"` | Feed dynamically filters to matching issues |
| **Test 4 — Filter** | Select Priority = `CRITICAL` | Only critical issues displayed |
| **Test 5 — Priority** | Input High severity + 200 affected people | Priority score calculated > 85 (`CRITICAL`) |
| **Test 6 — Status Flow** | Transition `REPORTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED` | Audit trail and status badges update seamlessly |
| **Test 7 — Full CRUD** | Create, Read, Update, Delete an issue | All operations return proper HTTP status codes |
| **Test 8 — Mobile Viewports** | Chrome DevTools at 375px, 390px, 768px, 1440px | No horizontal overflow; responsive navigation intact |

---

### 📍 PHASE 6 — 205 to 225 mins | Production Deployment

**Member 3 leads deployment**, supported by Members 1 & 2:

```text
       Frontend                  Backend                  Database
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│       Vercel        │──>│       Render        │──>│ Hosted PostgreSQL   │
│   (Vite + React)    │   │    (Spring Boot)    │   │  (Supabase/Neon)    │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

> [!IMPORTANT]
> **Do not trust "it works on my laptop."**  
> Test the deployed live URL in an **Incognito / Private browser tab**:
> - Visit homepage
> - Submit a live issue report
> - Verify it saves to remote PostgreSQL
> - Log into admin view and update status

---

### 📍 PHASE 7 — 225 to 240 mins | Submission Mode

- **Member 1 (Frontend Lead)**: Record screen demonstration video (under 3–5 minutes) covering citizen reporting and admin resolution.
- **Member 2 (Backend Lead)**: Review repository hygiene: clean `README.md`, verified `.gitignore`, API documentation, remove any secrets.
- **Member 3 (Admin/Deploy Lead)**: Finalize submission URLs (Live Deployment, Demo Video link, PDF report, AI declaration log).

---

## 6. 💼 Detailed Responsibility Matrix (Full-Stack Vertical Slices)

### 👨‍💻 Member 1 — Citizen Intake, Landing & Self-Service Lifecycle
- **Domain Role**: Full-stack citizen journey from landing discovery to issue reporting and report self-service.
- **🎨 Frontend Modules Owned**:
  - Global responsive layout: `Navbar.tsx`, `BottomNav.tsx`, `Footer.tsx`
  - Citizen pages: `HomePage.tsx` (Hero, problem, stats CTA), `ReportIssuePage.tsx`, `MyReportsPage.tsx`, `LoginPage.tsx` (persona switcher)
  - Intake forms: `IssueForm.tsx` (client-side validation, live preview), `EditIssueModal.tsx` (citizen report correction)
  - Client services: `api.ts`, `citizenService.ts`, `useAuth.ts`, `formatters.ts`
- **☕ Backend Modules Owned**:
  - Citizen REST endpoints: `IssueController.java` (`POST /api/issues`, `GET /api/issues/my-reports`, `PUT /api/issues/{id}`, `DELETE /api/issues/{id}`)
  - Citizen service logic: `IssueService.java` & `IssueServiceImpl.java` (intake validation, citizen self-update, cancel)
  - Citizen DTOs: `IssueCreateRequest.java` (Bean validation annotations), `IssueUpdateRequest.java`
  - Core setup: `CorsConfig.java`, `GlobalExceptionHandler.java` (centralized `@RestControllerAdvice` error responses)
- **🔄 CRUD Operations Owned**:
  - **CREATE**: Submit new community issue report with input validation
  - **READ**: View resident's own submitted reports (`My Reports`)
  - **UPDATE**: Edit/update citizen's own report before admin review
  - **DELETE**: Cancel/withdraw citizen's own submitted report

---

### 👨‍💻 Member 2 — Public Community Feed, Discovery & Upvoting
- **Domain Role**: Full-stack community feed, search, multi-faceted filtering, and citizen upvoting system.
- **🎨 Frontend Modules Owned**:
  - Discovery pages: `IssuesPage.tsx` (Community feed), `IssueDetailPage.tsx` (Standalone permalink)
  - Feed components: `IssueList.tsx` (Responsive grid, loading skeletons, empty states), `IssueCard.tsx`, `IssueDetailsModal.tsx`
  - Filtering components: `SearchBar.tsx` (Debounced query), `CategoryFilter.tsx` (Civic domain chips)
  - Support interaction: `SupportButton.tsx` (Optimistic upvote counter toggle)
  - Client state: `useIssues.ts` (Feed query hook), `feedService.ts`
- **☕ Backend Modules Owned**:
  - Core Entities & Schema: `Issue.java`, `Category.java`, `User.java`, `IssueSupport.java`, and Enums (`CategoryType`, `Severity`, `Status`, `PriorityLevel`)
  - Repositories: `IssueRepository.java` (Custom derived search queries), `CategoryRepository.java`, `UserRepository.java`, `IssueSupportRepository.java`
  - Feed & Support endpoints: Public feed queries in `IssueController.java` (`GET /api/issues`, `GET /api/issues/{id}`), `CategoryController.java` (`GET /api/categories`), `SupportController.java` (`POST`/`DELETE /api/issues/{id}/support`)
  - Business logic: `SupportService.java` & `SupportServiceImpl.java` (Upvote toggle & duplicate prevention)
  - Database bootstrap: `DataSeeder.java` (Seeds initial Sri Lankan categories, demo users, and 10+ community issues)
- **🔄 CRUD Operations Owned**:
  - **READ**: Public issues feed with keyword search, category filter, and status filter
  - **READ**: Single issue inspection and civic category metadata
  - **CREATE**: Cast community support / upvote on an issue
  - **DELETE**: Remove / toggle off support upvote

---

### 👨‍💻 Member 3 — Admin Triage, Priority Engine, Status Lifecycle & Moderation
- **Domain Role**: Full-stack administrative decision support, deterministic impact scoring, status audit workflow, and moderation.
- **🎨 Frontend Modules Owned**:
  - Admin workspace: `AdminPage.tsx`, `AdminDashboard.tsx`
  - Dashboard analytics: `MetricsCard.tsx` (Total, Critical, In Progress, Resolved KPI summary)
  - Community Priority Queue: `PriorityQueueTable.tsx` (Ranked table sorted descending by impact score)
  - Status management: `StatusUpdateModal.tsx` (Status advance + admin notes), `StatusTimeline.tsx` (Audit history)
  - Shared indicators: `PriorityBadge.tsx` (Color-coded severity/score pills), `StatusBadge.tsx`, `PriorityFilter.tsx`, `StatusFilter.tsx`
  - Client logic: `priorityCalculator.ts` (Client formula preview), `adminService.ts`
- **☕ Backend Modules Owned**:
  - Deterministic Priority Engine: `PriorityEngineService.java` (Calculates: $\text{Score} = \text{Sev} \times 0.40 + \text{Pop} \times 0.30 + \text{Urg} \times 0.20 + \text{Age} \times 0.10$ & assigns `PriorityLevel`)
  - Admin endpoints: `AdminController.java` (`PUT /api/admin/issues/{id}/status`, `DELETE /api/admin/issues/{id}`, `GET /api/admin/stats`, `GET /api/admin/queue`)
  - Admin business logic: `AdminService.java` & `AdminServiceImpl.java` (Lifecycle transitions, audit logging, admin metrics)
  - Audit trail entity: `IssueUpdate.java` & `IssueUpdateRepository.java`
  - Admin DTOs: `StatusUpdateRequest.java`, `AdminStatsResponse.java`
  - Deployment: Lead production deployment (Vercel + Render + Neon/Supabase PostgreSQL)
- **🔄 CRUD Operations Owned**:
  - **READ**: Executive KPI metrics & ranked Community Priority Queue
  - **UPDATE**: Issue lifecycle state transition (`REPORTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`) with admin audit notes
  - **UPDATE**: Deterministic priority score computation and recalculation
  - **DELETE**: Admin moderation / removal of duplicate or invalid community reports

---

## 7. 🧩 Component-Wise & File-Wise Technical Plan

### 7.1 Frontend Component Files Breakdown

| Component File Path | Owner | Purpose & UI Role | Key Props / Interfaces | Key Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/layout/Navbar.tsx` | **Member 1** | Top navigation bar with logo, desktop links, demo role toggle (`Citizen`/`Admin`), and mobile hamburger toggle | `currentRole: 'RESIDENT' \| 'ADMIN'`, `onRoleSwitch: () => void` | `lucide-react`, `react-router-dom` |
| `src/components/layout/BottomNav.tsx` | **Member 1** | Fixed bottom navigation bar for mobile viewports (< 768px) with touch-friendly navigation icons | None (uses active router state) | `lucide-react`, `react-router-dom` |
| `src/components/layout/Footer.tsx` | **Member 1** | Responsive footer highlighting Sri Lankan community context, links, and Mini Hackathon attribution | None | Pure UI |
| `src/components/issues/IssueForm.tsx` | **Member 1** | Reactive reporting form with real-time field validation, category selector, severity radios, affected count, and submit handler | `onSubmit: (data: IssueCreateDTO) => Promise<void>`, `isSubmitting: boolean` | `priorityCalculator.ts` (live preview), `types/issue.ts` |
| `src/components/issues/EditIssueModal.tsx` | **Member 1** | Citizen modal to update/correct self-reported issue details before admin review | `issue: Issue \| null`, `isOpen: boolean`, `onClose: () => void`, `onUpdate: (data: IssueUpdateDTO) => void` | `types/issue.ts` |
| `src/components/issues/IssueCard.tsx` | **Member 2** | Responsive card rendering issue summary (title, category icon, priority pill, affected count, location, status badge, relative time) | `issue: Issue`, `onCardClick: (id: number) => void`, `onSupport?: (id: number) => void` | `PriorityBadge`, `StatusBadge`, `formatters.ts` |
| `src/components/issues/IssueList.tsx` | **Member 2** | Responsive grid container (1 col mobile, 2 col tablet, 3 col desktop) handling empty and skeleton states | `issues: Issue[]`, `loading: boolean`, `onIssueSelect: (id: number) => void` | `IssueCard`, `lucide-react` |
| `src/components/issues/IssueDetailsModal.tsx` | **Member 2** | Detailed view/modal displaying full issue context, reporter info, severity, priority formula breakdown, status history, and action controls | `issue: Issue \| null`, `isOpen: boolean`, `onClose: () => void`, `onSupportToggle: () => void` | `StatusTimeline`, `PriorityBadge`, `StatusBadge`, `SupportButton` |
| `src/components/issues/SupportButton.tsx` | **Member 2** | Upvote/Support button with immediate count increment, active toggle state, and duplicate prevention | `issueId: number`, `supportCount: number`, `hasSupported: boolean`, `onToggle: (id: number) => void` | `lucide-react` |
| `src/components/filters/SearchBar.tsx` | **Member 2** | Debounced search input field with clear button for filtering issues by title, description, or location | `value: string`, `onChange: (val: string) => void`, `placeholder?: string` | `lucide-react` |
| `src/components/filters/CategoryFilter.tsx` | **Member 2** | Scrollable filter chips for civic categories (`ALL`, `ROAD`, `DRAINAGE`, `WATER`, `WASTE`, `STREETLIGHT`, `TRAFFIC`, etc.) | `selectedCategory: string`, `onSelectCategory: (cat: string) => void` | `types/issue.ts` |
| `src/components/admin/AdminDashboard.tsx` | **Member 3** | Central admin management layout housing metrics cards, filter bar, priority queue, and quick actions | `issues: Issue[]`, `onStatusChange: (id: number, status: IssueStatus, notes: string) => void` | `MetricsCard`, `PriorityQueueTable`, `StatusUpdateModal` |
| `src/components/admin/MetricsCard.tsx` | **Member 3** | KPI summary widget displaying count, icon, and contextual status badge (Total, Pending Review, Critical, Resolved) | `title: string`, `value: number`, `icon: LucideIcon`, `trend?: string`, `colorTheme: string` | `lucide-react` |
| `src/components/admin/PriorityQueueTable.tsx` | **Member 3** | Ranked table sorting issues descending by Priority Score with inline action buttons to review, advance status, or delete | `issues: Issue[]`, `onSelectIssue: (issue: Issue) => void`, `onQuickStatusUpdate: (id: number) => void`, `onDelete: (id: number) => void` | `PriorityBadge`, `StatusBadge` |
| `src/components/admin/StatusUpdateModal.tsx` | **Member 3** | Admin modal to update status, append administrative resolution notes, and optionally adjust verified severity | `issue: Issue \| null`, `isOpen: boolean`, `onClose: () => void`, `onSubmit: (update: StatusUpdateDTO) => void` | `types/issue.ts` |
| `src/components/issues/StatusTimeline.tsx` | **Member 3** | Step-by-step audit trail showing progression from `REPORTED` to `RESOLVED` with timestamps and admin remarks | `timeline: IssueUpdate[]`, `currentStatus: IssueStatus` | `StatusBadge`, `formatters.ts` |
| `src/components/issues/PriorityBadge.tsx` | **Member 3** | Color-coded priority pill (`LOW`: emerald, `MEDIUM`: amber, `HIGH`: orange, `CRITICAL`: red) with score indicator | `level: PriorityLevel`, `score?: number`, `size?: 'sm' \| 'md' \| 'lg'` | `types/issue.ts` |
| `src/components/issues/StatusBadge.tsx` | **Member 3** | Visual tag reflecting report lifecycle status (`REPORTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`) | `status: IssueStatus`, `size?: 'sm' \| 'md'` | `types/issue.ts` |
| `src/components/filters/PriorityFilter.tsx` | **Member 3** | Quick filter chips to narrow feed by priority level (`ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | `selectedPriority: string`, `onSelectPriority: (p: string) => void` | `types/issue.ts` |
| `src/components/filters/StatusFilter.tsx` | **Member 3** | Filter tabs to toggle between `All`, `Reported`, `In Progress`, and `Resolved` | `selectedStatus: string`, `onSelectStatus: (s: string) => void` | `types/issue.ts` |

---

### 7.2 Frontend Page & Routing Files Breakdown

| Page File Path | Route | Owner | Screen Responsibility | Child Components Utilized |
| :--- | :--- | :--- | :--- | :--- |
| `src/pages/HomePage.tsx` | `/` | **Member 1** | High-impact landing page: Hero banner, problem context, how it works, live community stats, categories grid, report CTA | `Navbar`, `BottomNav`, `Footer`, `MetricsCard`, `IssueCard` |
| `src/pages/ReportIssuePage.tsx` | `/report` | **Member 1** | Full-page citizen reporting experience with guidelines, interactive form, live priority preview, and validation errors | `IssueForm`, `Navbar`, `BottomNav` |
| `src/pages/MyReportsPage.tsx` | `/my-reports` | **Member 1** | Resident's personal dashboard showing reports they filed, status progression, and cancel/edit actions | `IssueCard`, `StatusBadge`, `EditIssueModal`, `Navbar`, `BottomNav` |
| `src/pages/LoginPage.tsx` | `/login` | **Member 1** | Instant demo persona switcher (`Citizen Resident` vs `Municipal Admin`) for hassle-free evaluator testing | `lucide-react` |
| `src/pages/IssuesPage.tsx` | `/issues` | **Member 2** | Public community issues feed with keyword search, category pills, priority filter, sorting, and card list | `SearchBar`, `CategoryFilter`, `PriorityFilter`, `StatusFilter`, `IssueList`, `IssueDetailsModal` |
| `src/pages/IssueDetailPage.tsx` | `/issues/:id` | **Member 2** | Deep-linkable standalone view for an issue with full history, community impact score, and support button | `StatusTimeline`, `PriorityBadge`, `StatusBadge`, `SupportButton` |
| `src/pages/AdminPage.tsx` | `/admin` | **Member 3** | Protected Community Administrator workspace: analytics metrics, Community Priority Queue, and triage controls | `AdminDashboard`, `MetricsCard`, `PriorityQueueTable`, `StatusUpdateModal` |

---

### 7.3 Frontend Services, Hooks, Types & Utilities Breakdown

| File Path | Owner | Module Role & Key Responsibilities | Exports |
| :--- | :--- | :--- | :--- |
| `src/types/issue.ts` | **Shared (1, 2, 3)** | Canonical TypeScript definitions matching backend contract: `Issue`, `Category`, `Severity`, `Status`, `PriorityLevel`, `IssueSupport`, `IssueUpdate`, `User` | Interfaces & Enums |
| `src/services/api.ts` | **Member 1** | Base Axios/Fetch configuration with base URL (`/api`), headers, error interceptors, and timeout configs | `apiClient` instance |
| `src/services/citizenService.ts` | **Member 1** | REST API calls for citizen operations: `createIssue`, `getMyReports`, `updateMyIssue`, `cancelMyIssue` | Service methods |
| `src/hooks/useAuth.ts` | **Member 1** | Context hook maintaining simulated session, active role (`RESIDENT` / `ADMIN`), user ID, and persona switcher | `currentUser`, `role`, `switchRole`, `isAuthenticated` |
| `src/utils/formatters.ts` | **Member 1** | Helper formatting utilities: relative time (`"15 mins ago"`, `"2 days ago"`), date stamps, text truncation | `formatRelativeTime`, `formatDate`, `truncate` |
| `src/services/feedService.ts` | **Member 2** | REST API calls for public discovery: `getIssues`, `getIssueById`, `getCategories`, `addSupport`, `removeSupport` | Service methods |
| `src/hooks/useIssues.ts` | **Member 2** | Custom hook managing issue feed state, search queries, multi-filter combinations, pagination, and refresh actions | `issues`, `loading`, `error`, `filters`, `setFilters`, `refetch` |
| `src/utils/priorityCalculator.ts` | **Member 3** | Client-side deterministic priority scoring mirroring backend formula for immediate live score preview while typing | `calculatePriority(severity, affected, urgency, age)` |
| `src/services/adminService.ts` | **Member 3** | REST API calls for administrator functions: `updateStatus`, `getAdminStats`, `getPriorityQueue`, `deleteIssue` | Service methods |
| `src/data/mockIssues.ts` | **Shared (1, 2, 3)** | Seed mock data populated with authentic Sri Lankan locations (Matale, Kandy, Colombo, Galle) for Phase 1 and emergency fallback | `MOCK_ISSUES`, `MOCK_CATEGORIES`, `MOCK_STATS` |

---

### 7.4 Backend Spring Boot Files Breakdown (File-by-File)

#### 1. Entity & Enum Layer (`com.gramafix.entity`)
| File Path | Owner | Type | Key Fields & Responsibilities |
| :--- | :--- | :--- | :--- |
| `entity/Issue.java` | **Member 2** | `@Entity` | `id`, `title`, `description`, `category`, `location`, `severity`, `peopleAffected`, `priorityScore`, `priorityLevel`, `status`, `supportCount`, `reportedBy`, `createdAt`, `updatedAt` |
| `entity/Category.java` | **Member 2** | `@Entity` | `id`, `name`, `code`, `description`, `iconName` |
| `entity/User.java` | **Member 2** | `@Entity` | `id`, `fullName`, `email`, `role` (`RESIDENT`/`ADMIN`), `communityArea`, `createdAt` |
| `entity/IssueSupport.java` | **Member 2** | `@Entity` | `id`, `issueId`, `userId`, `createdAt` (Unique constraint on `issueId + userId`) |
| `entity/IssueUpdate.java` | **Member 3** | `@Entity` | `id`, `issueId`, `previousStatus`, `newStatus`, `adminNotes`, `updatedBy`, `timestamp` |
| `entity/enums/CategoryType.java` | **Member 2** | `enum` | `ROAD`, `STREETLIGHT`, `WASTE`, `WATER`, `DRAINAGE`, `TRAFFIC`, `ENVIRONMENT`, `OTHER` |
| `entity/enums/Severity.java` | **Member 2** | `enum` | `LOW` (1), `MEDIUM` (2), `HIGH` (3), `CRITICAL` (4) |
| `entity/enums/Status.java` | **Member 2** | `enum` | `REPORTED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED` |
| `entity/enums/PriorityLevel.java` | **Member 2** | `enum` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

#### 2. DTO Layer (`com.gramafix.dto`)
| File Path | Owner | Type | Validation & Responsibilities |
| :--- | :--- | :--- | :--- |
| `dto/IssueCreateRequest.java` | **Member 1** | `record`/`class` | `@NotBlank title`, `@NotBlank description`, `@NotNull category`, `@NotBlank location`, `@NotNull severity`, `@Min(1) peopleAffected` |
| `dto/IssueUpdateRequest.java` | **Member 1** | `record`/`class` | Citizen self-update DTO: `@Size(max=1000) String description`, `@Size(max=120) String location` |
| `dto/IssueResponse.java` | **Member 2** | `record`/`class` | Contract mapping to JSON specification (id, title, description, category, severity, score, level, status, supportCount, timestamps) |
| `dto/StatusUpdateRequest.java` | **Member 3** | `record`/`class` | `@NotNull Status newStatus`, `@Size(max=500) String adminNotes`, optional `Severity adjustedSeverity` |
| `dto/AdminStatsResponse.java` | **Member 3** | `record`/`class` | Aggregate statistics: `totalIssues`, `openIssues`, `inProgressIssues`, `criticalIssues`, `resolvedIssues` |

#### 3. Repository Layer (`com.gramafix.repository`)
| File Path | Owner | Type | Custom Spring Data JPA Query Methods |
| :--- | :--- | :--- | :--- |
| `repository/IssueRepository.java` | **Member 2** | `interface` | `findAllByOrderByPriorityScoreDesc()`, `findByCategory(CategoryType cat)`, `findByStatus(Status status)`, `findByReportedBy(Long userId)`, `searchIssues(String keyword)` |
| `repository/CategoryRepository.java` | **Member 2** | `interface` | Standard CRUD and `findByCode(String code)` |
| `repository/UserRepository.java` | **Member 2** | `interface` | Standard CRUD and `findByEmail(String email)` |
| `repository/IssueSupportRepository.java` | **Member 2** | `interface` | `boolean existsByIssueIdAndUserId(Long issueId, Long userId)`, `long countByIssueId(Long issueId)` |
| `repository/IssueUpdateRepository.java` | **Member 3** | `interface` | `List<IssueUpdate> findByIssueIdOrderByTimestampAsc(Long issueId)` |

#### 4. Service Layer (`com.gramafix.service`)
| File Path | Owner | Interface / Impl | Business Logic Responsibility |
| :--- | :--- | :--- | :--- |
| `service/IssueService.java` & `IssueServiceImpl.java` | **Member 1** | Interface & Service | Citizen issue intake orchestration, validation rules, user's own report edits, and cancellation deletion |
| `service/SupportService.java` & `SupportServiceImpl.java` | **Member 2** | Interface & Service | Upvote toggle logic, duplicate voting prevention, updating denormalized `supportCount` on `Issue` entity |
| `service/PriorityEngineService.java` | **Member 3** | Service Component | Implements: $\text{Score} = (\text{Sev} \times 0.40) + (\text{Pop} \times 0.30) + (\text{Urg} \times 0.20) + (\text{Age} \times 0.10)$, maps score to `PriorityLevel` |
| `service/AdminService.java` & `AdminServiceImpl.java` | **Member 3** | Interface & Service | State transition engine, status progression validation, admin audit trail creation, moderation deletion, and dashboard metrics |

#### 5. Controller Layer (`com.gramafix.controller`)
| File Path | Owner | Base Route | Endpoints Implemented |
| :--- | :--- | :--- | :--- |
| `controller/IssueController.java` | **Member 1 & 2** | `/api/issues` | Member 1: `POST /` (create), `GET /my-reports`, `PUT /{id}` (citizen edit), `DELETE /{id}` (cancel).<br>Member 2: `GET /` (list/filter/search), `GET /{id}` (details) |
| `controller/CategoryController.java` | **Member 2** | `/api/categories` | `GET /` (list active civic categories) |
| `controller/SupportController.java` | **Member 2** | `/api/issues/{id}/support` | `POST /` (add vote), `DELETE /` (remove vote) |
| `controller/AdminController.java` | **Member 3** | `/api/admin` | `PUT /issues/{id}/status` (transition), `GET /stats` (KPI counts), `GET /queue` (ranked priority queue), `DELETE /issues/{id}` (moderation) |
| `controller/AuthController.java` | **Member 1** | `/api/auth` | `GET /demo-users` (returns citizen and admin demo profiles for instant role switching) |

#### 6. Configuration & Exception Handling (`com.gramafix.config` / `com.gramafix.exception`)
| File Path | Owner | Type | Responsibilities |
| :--- | :--- | :--- | :--- |
| `config/CorsConfig.java` | **Member 1** | `@Configuration` | Global CORS policy allowing requests from local Vite (`localhost:5173`) and production Vercel frontend |
| `exception/GlobalExceptionHandler.java` | **Member 1** | `@RestControllerAdvice` | Intercepts `MethodArgumentNotValidException`, `ResourceNotFoundException`, returns structured JSON errors |
| `exception/ResourceNotFoundException.java` | **Member 1** | Custom Exception | Thrown when issue, category, or user entity cannot be found by ID |
| `config/DataSeeder.java` | **Member 2** | `CommandLineRunner` | Seeds initial categories, demo users, and 10+ realistic Sri Lankan community issues on database startup |

---

## 8. 📁 Complete Repository File Tree (File-Wise)

```text
gramafix/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx                   # Member 1
│   │   │   │   ├── BottomNav.tsx                # Member 1
│   │   │   │   └── Footer.tsx                   # Member 1
│   │   │   ├── issues/
│   │   │   │   ├── IssueForm.tsx                # Member 1
│   │   │   │   ├── EditIssueModal.tsx           # Member 1
│   │   │   │   ├── IssueCard.tsx                # Member 2
│   │   │   │   ├── IssueList.tsx                # Member 2
│   │   │   │   ├── IssueDetailsModal.tsx        # Member 2
│   │   │   │   ├── SupportButton.tsx            # Member 2
│   │   │   │   ├── PriorityBadge.tsx            # Member 3
│   │   │   │   ├── StatusBadge.tsx              # Member 3
│   │   │   │   └── StatusTimeline.tsx           # Member 3
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx           # Member 3
│   │   │   │   ├── MetricsCard.tsx              # Member 3
│   │   │   │   ├── PriorityQueueTable.tsx       # Member 3
│   │   │   │   └── StatusUpdateModal.tsx        # Member 3
│   │   │   └── filters/
│   │   │       ├── SearchBar.tsx                # Member 2
│   │   │       ├── CategoryFilter.tsx           # Member 2
│   │   │       ├── PriorityFilter.tsx           # Member 3
│   │   │       └── StatusFilter.tsx             # Member 3
│   │   ├── pages/
│   │   │   ├── HomePage.tsx                     # Member 1
│   │   │   ├── ReportIssuePage.tsx              # Member 1
│   │   │   ├── MyReportsPage.tsx                # Member 1
│   │   │   ├── LoginPage.tsx                    # Member 1
│   │   │   ├── IssuesPage.tsx                   # Member 2
│   │   │   ├── IssueDetailPage.tsx              # Member 2
│   │   │   └── AdminPage.tsx                    # Member 3
│   │   ├── services/
│   │   │   ├── api.ts                           # Member 1
│   │   │   ├── citizenService.ts                # Member 1
│   │   │   ├── feedService.ts                   # Member 2
│   │   │   └── adminService.ts                  # Member 3
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                       # Member 1
│   │   │   └── useIssues.ts                     # Member 2
│   │   ├── types/
│   │   │   └── issue.ts                         # Shared (1, 2, 3)
│   │   ├── utils/
│   │   │   ├── formatters.ts                    # Member 1
│   │   │   └── priorityCalculator.ts            # Member 3
│   │   ├── data/
│   │   │   └── mockIssues.ts                    # Shared (1, 2, 3)
│   │   ├── App.tsx                              # Member 1
│   │   ├── main.tsx                             # Member 1
│   │   └── index.css                            # Member 1
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/gramafix/
│   │       │       ├── GramaFixApplication.java # Member 1 & 2
│   │       │       ├── entity/
│   │       │       │   ├── Issue.java           # Member 2
│   │       │       │   ├── Category.java        # Member 2
│   │       │       │   ├── User.java            # Member 2
│   │       │       │   ├── IssueSupport.java    # Member 2
│   │       │       │   ├── IssueUpdate.java     # Member 3
│   │       │       │   └── enums/
│   │       │       │       ├── CategoryType.java# Member 2
│   │       │       │       ├── Severity.java    # Member 2
│   │       │       │       ├── Status.java      # Member 2
│   │       │       │       └── PriorityLevel.java# Member 2
│   │       │       ├── dto/
│   │       │       │   ├── IssueCreateRequest.java # Member 1
│   │       │       │   ├── IssueUpdateRequest.java # Member 1
│   │       │       │   ├── IssueResponse.java      # Member 2
│   │       │       │   ├── StatusUpdateRequest.java# Member 3
│   │       │       │   └── AdminStatsResponse.java # Member 3
│   │       │       ├── repository/
│   │       │       │   ├── IssueRepository.java        # Member 2
│   │       │       │   ├── CategoryRepository.java     # Member 2
│   │       │       │   ├── UserRepository.java         # Member 2
│   │       │       │   ├── IssueSupportRepository.java # Member 2
│   │       │       │   └── IssueUpdateRepository.java  # Member 3
│   │       │       ├── service/
│   │       │       │   ├── IssueService.java        # Member 1
│   │       │       │   ├── IssueServiceImpl.java    # Member 1
│   │       │       │   ├── SupportService.java      # Member 2
│   │       │       │   ├── SupportServiceImpl.java  # Member 2
│   │       │       │   ├── PriorityEngineService.java # Member 3
│   │       │       │   ├── AdminService.java        # Member 3
│   │       │       │   └── AdminServiceImpl.java    # Member 3
│   │       │       ├── controller/
│   │       │       │   ├── IssueController.java     # Member 1 (intake/edit) & 2 (feed)
│   │       │       │   ├── CategoryController.java  # Member 2
│   │       │       │   ├── SupportController.java   # Member 2
│   │       │       │   ├── AdminController.java     # Member 3
│   │       │       │   └── AuthController.java      # Member 1
│   │       │       ├── config/
│   │       │       │   ├── CorsConfig.java          # Member 1
│   │       │       │   └── DataSeeder.java          # Member 2
│   │       │       └── exception/
│   │       │           ├── GlobalExceptionHandler.java    # Member 1
│   │       │           └── ResourceNotFoundException.java # Member 1
│   │       └── resources/
│   │           ├── application.properties       # Member 1 & 2
│   │           └── data.sql                     # Member 2
│   └── pom.xml                                  # Member 1 & 2
│
├── README.md
├── SPECIFICATION.md
├── TEAM_PLAN.md
└── .gitignore
```

---

## 9. 👤 Member-Wise Master File Ownership Matrix (Full-Stack Checklists)

Every member has explicit Frontend (React) and Backend (Spring Boot) files so everyone delivers full-stack contributions:

### 👨‍💻 Member 1 Checklist (Citizen Intake & Self-Service)
**Frontend:**
- [ ] `src/components/layout/Navbar.tsx` & `BottomNav.tsx` & `Footer.tsx`
- [ ] `src/pages/HomePage.tsx` (Hero banner, problem, live stats, report CTA)
- [ ] `src/pages/ReportIssuePage.tsx` & `src/components/issues/IssueForm.tsx` (with inline validation)
- [ ] `src/pages/MyReportsPage.tsx` & `src/components/issues/EditIssueModal.tsx`
- [ ] `src/pages/LoginPage.tsx` (Demo persona switcher)
- [ ] `src/services/api.ts` & `src/services/citizenService.ts`
- [ ] `src/hooks/useAuth.ts` & `src/utils/formatters.ts`
- [ ] `src/App.tsx` & `src/main.tsx`

**Backend:**
- [ ] `dto/IssueCreateRequest.java` (Bean validation: `@NotBlank`, `@Min`)
- [ ] `dto/IssueUpdateRequest.java` (Citizen self-edit DTO)
- [ ] `service/IssueService.java` & `service/IssueServiceImpl.java` (Citizen intake & self-management logic)
- [ ] `controller/IssueController.java` (Citizen endpoints: `POST /api/issues`, `GET /my-reports`, `PUT /{id}`, `DELETE /{id}`)
- [ ] `controller/AuthController.java` (`GET /api/auth/demo-users`)
- [ ] `config/CorsConfig.java` (Global CORS mapping)
- [ ] `exception/GlobalExceptionHandler.java` & `ResourceNotFoundException.java`
- [ ] **Assigned CRUD**: **CREATE** (Issues), **READ** (My Reports), **UPDATE** (Edit own report), **DELETE** (Cancel own report)

---

### 👨‍💻 Member 2 Checklist (Community Discovery & Upvoting)
**Frontend:**
- [ ] `src/pages/IssuesPage.tsx` (Public issues feed view)
- [ ] `src/pages/IssueDetailPage.tsx` & `src/components/issues/IssueDetailsModal.tsx`
- [ ] `src/components/issues/IssueList.tsx` (Responsive cards grid, skeleton loader, empty state)
- [ ] `src/components/issues/IssueCard.tsx` (Summary card with badges, relative time)
- [ ] `src/components/filters/SearchBar.tsx` (Debounced search input)
- [ ] `src/components/filters/CategoryFilter.tsx` (Pill chip filter)
- [ ] `src/components/issues/SupportButton.tsx` (Optimistic upvoting toggle)
- [ ] `src/services/feedService.ts` & `src/hooks/useIssues.ts`

**Backend:**
- [ ] `entity/Issue.java`, `Category.java`, `User.java`, `IssueSupport.java`
- [ ] `entity/enums/CategoryType.java`, `Severity.java`, `Status.java`, `PriorityLevel.java`
- [ ] `dto/IssueResponse.java` (Contract mapping to JSON)
- [ ] `repository/IssueRepository.java`, `CategoryRepository.java`, `UserRepository.java`, `IssueSupportRepository.java`
- [ ] `service/SupportService.java` & `service/SupportServiceImpl.java` (Upvote toggle & duplicate prevention)
- [ ] `controller/IssueController.java` (Public feed: `GET /api/issues`, `GET /api/issues/{id}`)
- [ ] `controller/CategoryController.java` (`GET /api/categories`)
- [ ] `controller/SupportController.java` (`POST`/`DELETE /api/issues/{id}/support`)
- [ ] `config/DataSeeder.java` (Initial Sri Lankan community seed data)
- [ ] **Assigned CRUD**: **READ** (Community feed, Search, Filters, Issue details, Categories), **CREATE** (Support vote), **DELETE** (Remove vote), Database schema & seed data

---

### 👨‍💻 Member 3 Checklist (Admin Triage & Priority Engine)
**Frontend:**
- [ ] `src/pages/AdminPage.tsx` & `src/components/admin/AdminDashboard.tsx`
- [ ] `src/components/admin/MetricsCard.tsx` (KPI statistics widgets)
- [ ] `src/components/admin/PriorityQueueTable.tsx` (Ranked table with quick actions)
- [ ] `src/components/admin/StatusUpdateModal.tsx` (Advance status + admin notes)
- [ ] `src/components/issues/StatusTimeline.tsx` (Visual audit trail)
- [ ] `src/components/issues/PriorityBadge.tsx` & `StatusBadge.tsx`
- [ ] `src/components/filters/PriorityFilter.tsx` & `StatusFilter.tsx`
- [ ] `src/services/adminService.ts` & `src/utils/priorityCalculator.ts`

**Backend:**
- [ ] `service/PriorityEngineService.java` (Deterministic impact formula: $\text{Sev} \times 0.40 + \text{Pop} \times 0.30 + \text{Urg} \times 0.20 + \text{Age} \times 0.10$)
- [ ] `entity/IssueUpdate.java` (Audit history entity) & `repository/IssueUpdateRepository.java`
- [ ] `dto/StatusUpdateRequest.java` & `dto/AdminStatsResponse.java`
- [ ] `service/AdminService.java` & `service/AdminServiceImpl.java` (Status transition workflow, KPI metrics, moderation)
- [ ] `controller/AdminController.java` (`PUT /api/admin/issues/{id}/status`, `DELETE /api/admin/issues/{id}`, `GET /api/admin/stats`, `GET /api/admin/queue`)
- [ ] Production Deployment Lead (Vercel frontend + Render backend + Neon PostgreSQL)
- [ ] **Assigned CRUD**: **READ** (Admin KPI stats & Priority Queue), **UPDATE** (Status lifecycle transition & admin notes), **UPDATE** (Deterministic priority recalculation), **DELETE** (Admin moderation / duplicate cleanup)

---

### 🤝 Shared Files (Frozen in Phase 0)
- `src/types/issue.ts` (Shared TypeScript Contract)
- `src/data/mockIssues.ts` (Mock dataset for Phase 1 & fallback)
- `SPECIFICATION.md` & `TEAM_PLAN.md`

---

## 10. 🔀 Git Commit Traceability by Member (Full-Stack Evidence)

Ensure every member has distinct, meaningful commits across **both frontend and backend** reflecting their vertical CRUD ownership:

### Member 1 Commits (Citizen Intake & Self-Service)
```bash
feat(ui): create responsive layout shell, navbar, bottom-nav and landing page
feat(api): configure spring boot cors and global exception handler
feat(api): implement issue creation and citizen my-reports REST endpoints
feat(ui): implement citizen issue reporting form with client-side validation
feat(api): implement citizen issue update and cancel deletion logic
feat(ui): build my-reports page with edit report modal and cancel confirmation
```

### Member 2 Commits (Community Discovery & Upvoting)
```bash
feat(db): define JPA entities for Issue, Category, User, and IssueSupport
feat(db): implement data seeder with authentic Sri Lankan community records
feat(api): implement public issue feed with keyword search and category filters
feat(ui): implement community issues feed page and responsive issue card
feat(api): implement issue support upvote and duplicate-vote prevention
feat(ui): build debounced search bar, category chips, and interactive upvote button
```

### Member 3 Commits (Admin Triage & Priority Engine)
```bash
feat(core): implement deterministic community priority engine scoring algorithm
feat(ui): implement client-side priority calculation preview and badge indicators
feat(api): implement admin dashboard stats and priority queue REST endpoints
feat(ui): build admin dashboard layout, KPI metrics cards, and priority queue table
feat(api): implement issue status lifecycle progression and audit log trail
feat(ui): build status transition modal and timeline audit trail component
deploy: configure Vercel frontend and Render backend production deployments
```

---

## 11. 🛡️ Conflict Prevention Boundaries

To prevent merge nightmares and conflicting edits:

| Member | 🚫 Do NOT Modify (Without Prior Sync) |
| :--- | :--- |
| **Member 1 (Citizen Intake & Self-Service)** | Admin dashboard & status workflow, Community feed filtering & upvote logic, Priority calculation formula |
| **Member 2 (Feed & Upvoting)** | Citizen reporting form validation, Admin status update modal & timeline, Shared exception handler |
| **Member 3 (Admin & Priority Engine)** | Citizen intake form & my-reports page, Public feed card layouts, Category repository & basic schema |

---

## 12. 💬 Team Communication Protocol

Use your team messaging channel with strictly three status indicators:

- 🔵 **`Working`**: Actively implementing an assigned module.
- 🟡 **`Blocked`**: Blocked by an API, dependency, or unresolved bug (immediate team attention).
- 🟢 **`Done`**: Feature merged and ready for integration.

> **Example updates:**  
> - *Member 2:* "🟢 `POST /api/issues` ready and verified on local port 8080."  
> - *Member 1:* "🔵 Integrating `POST /api/issues` into `IssueForm.tsx`."  
> - *Member 3:* "🟢 Priority calculation formula unit tested."

---

## 13. 🚨 Emergency Fallback Plan (Safety Net)

If the backend or database integration faces critical blockers around **minute 130**:

1. **Do not let the project collapse.**
2. Switch the frontend service layer to a client-side **Mock JSON / LocalStorage store**.
3. Keep all features running:
   - Priority calculation engine
   - Issue reporting form with validation
   - Issue feed, search, and filtering
   - Community upvoting
   - Admin status transition workflow
4. Deploy the fully functional frontend to Vercel.

> *A working, responsive, interactive web application with simulated persistence is vastly superior to a non-functional or broken full-stack deployment.*

---

## 14. 🤖 Optional AI Enhancement Strategy

> [!CAUTION]
> AI should be a **bonus after the MVP**, never a core blocking dependency.

- **Phase 1–4:** Zero AI dependency. The application must work 100% deterministically.
- **After Minute 175 (Bonus Polish):** If all core flows are passing, add an optional AI feature:
  - Natural Language Issue Assistant: Suggests `category` and `severity` based on user report text (e.g., *"Large pothole near clock tower filling with rainwater"* → Category: `ROAD`, Severity: `HIGH`).
  - Graceful degradation: If the AI API fails or times out, the user simply selects category and severity manually.

---

## 15. 🏆 Golden Hackathon Rule

```text
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  BUILD SMALL │ ──>  │  INTEGRATE   │ ──>  │     TEST     │ ──>  │  BUILD MORE  │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
                                                                         │
                                                                         ▼
                                                                  ┌──────────────┐
                                                                  │     SHIP     │
                                                                  └──────────────┘
```

Never isolate yourselves into separate silos until minute 220. **Integrate at Minute 90–130.** Once the end-to-end flow works:

$$\text{Report Issue} \longrightarrow \text{API} \longrightarrow \text{Database} \longrightarrow \text{Feed} \longrightarrow \text{Priority Score} \longrightarrow \text{Admin Status Update}$$

**GramaFix is an operational product.** Everything built afterward is victory polish!
