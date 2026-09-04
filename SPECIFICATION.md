# GramaFix — Full MVP Build Specification

> **SE3090 – Software Engineering Frameworks | Assignment 2 – Mini Hackathon**
>
> **Product:** GramaFix  
> **Tagline:** **Report. Prioritize. Fix.**  
> **Platform:** Responsive Web Application (desktop, tablet, mobile browser)  
> **MVP Goal:** Build a small, working civic-tech web application that helps Sri Lankan residents report, discover, prioritize, support, and track community-level issues.

---

## 1. Product Vision

GramaFix is a **community issue coordination and prioritization platform** for Sri Lankan neighborhoods.

Residents can report issues such as potholes, blocked drains, garbage accumulation, broken streetlights, water leaks, damaged roads, fallen trees, and similar local problems.

The key differentiator is that GramaFix does **more than collect complaints**. It converts reports into a ranked **Community Priority Queue** using a transparent impact score based on severity, people affected, urgency, and report age.

### Core idea

```text
Citizen
  ↓
Report local issue
  ↓
Validate input
  ↓
Categorize / classify
  ↓
Calculate Community Priority Score
  ↓
Community Issues Feed
  ↓
Admin Priority Queue
  ↓
Review → In Progress → Resolved
```

---

## 2. Real-World Problem

Sri Lankan communities face small but important local problems every day:

- potholes and damaged roads
- blocked drains and flooding points
- garbage accumulation
- broken streetlights
- water leaks
- damaged public infrastructure
- fallen trees or environmental hazards
- traffic or local safety issues

There are existing government information and complaint channels in Sri Lanka, including organization-specific processes and GIC/1919. GramaFix should **not claim that no complaint mechanisms exist**.

### The GramaFix problem statement

> Community-level issues are often handled through fragmented channels and institution-specific processes. Residents may not know which authority or channel is appropriate, while local decision-makers may lack a simple community-level view of which problems are affecting the most people and should be addressed first.

### GramaFix solution statement

> GramaFix provides one responsive web interface where residents can report and discover local issues, support existing reports, and track progress, while administrators receive a prioritized queue that highlights issues with the greatest community impact.

---

## 3. Target Users

### 3.1 Resident / Citizen

A person living, studying, working, or travelling in a community.

Permissions:

- view public issues
- search and filter issues
- create a report
- view issue details
- support an issue
- edit own eligible reports
- delete/cancel own eligible reports
- view own reports
- track report status

### 3.2 Community Admin

A local/community administrator responsible for reviewing and coordinating reports.

Permissions:

- view all issues
- search and filter issues
- view priority ranking
- review reports
- update status
- adjust severity/priority when justified
- add an administrative note
- mark reports as resolved
- remove duplicate/inappropriate reports

### MVP role scope

Only two roles are required:

```text
RESIDENT
ADMIN
```

Do not create separate moderator, municipal officer, department manager, and super-admin roles for the hackathon MVP.

---

## 4. Platform Definition

GramaFix is a **web application**, not a native Android/iOS application.

The same application must work across:

```text
Desktop browser
       ↓
Tablet browser
       ↓
Mobile browser
```

### Mobile requirement

Mobile responsiveness is a **first-class requirement**, not an optional extra.

A resident should be able to report an issue comfortably from a phone in under approximately one minute.

### Responsive design strategy

- Mobile-first layout
- Single-column forms on small screens
- Card-based issue list instead of wide tables on mobile
- Bottom navigation for primary resident actions on mobile
- Sidebar/top navigation on desktop
- Responsive dashboard cards
- Touch-friendly controls and buttons

---

## 5. MVP Scope

## 5.1 Must Have

- Responsive landing page
- Resident and Admin roles
- Login/demo authentication flow
- Create issue
- Read/view issues
- Edit issue where allowed
- Delete/cancel issue where allowed
- Search issues
- Filter by category, priority, status, and area
- Issue details page
- Community Priority Score
- Priority classification
- Support/upvote issue
- My Reports
- Admin Dashboard
- Status workflow
- Form validation with friendly error messages
- Sample data
- Public deployment
- GitHub repository
- README and AI declaration

## 5.2 Should Have

Only after the core MVP works:

- duplicate report detection
- issue support count
- issue status timeline
- image upload
- richer animations
- admin notes
- simple authority recommendation

## 5.3 Bonus / Optional AI

- AI-assisted issue category suggestion
- AI-assisted severity suggestion
- AI-generated short issue summary
- text similarity for possible duplicate reports

AI must not be a single point of failure. The application must remain usable if the AI feature is unavailable.

---

## 6. Main User Journey

### Resident journey

```text
Open GramaFix
   ↓
Home
   ↓
Explore Issues
   ├── Search
   ├── Filter
   └── Open details

OR

Report Issue
   ↓
Complete form
   ↓
Validation
   ↓
Create issue
   ↓
Priority Score generated
   ↓
Issue enters community feed
   ↓
Resident can support and track it
```

### Admin journey

```text
Admin Login
   ↓
Dashboard
   ↓
Priority Queue
   ↓
Open issue
   ↓
Review
   ↓
Under Review
   ↓
In Progress
   ↓
Resolved
```

---

# 7. Main Screens

## 7.1 Home / Landing Page

### Purpose

Explain the problem and show GramaFix value immediately.

### Sections

1. Hero
2. Problem statement
3. How it works
4. Issue categories
5. Community statistics
6. Recent/high-priority issues
7. Call to action

### Hero copy

**GramaFix**  
**Report. Prioritize. Fix.**

> Report local problems, help your community prioritize what matters, and track progress from report to resolution.

Primary CTA:

`Report an Issue`

Secondary CTA:

`Explore Issues`

### Statistics examples

- 1,248 Issues Reported
- 867 Issues Resolved
- 42 Active Issues
- 14 Communities

Use clearly labeled sample/demo data for the hackathon.

---

## 7.2 Issues Page

### Features

- Search
- Category filter
- Priority filter
- Status filter
- Area filter
- Sort by newest / highest priority

### Mobile

Use stacked issue cards.

### Desktop

Use 2–3 column responsive grid or a comfortable list.

### Issue card

```text
Title
Category
Location
People affected
Priority score
Priority level
Current status
Reported time
View details
```

---

## 7.3 Report Issue Page

### Form fields

- Title
- Description
- Category
- Location
- Severity
- People affected
- Optional image
- Optional contact preference

### Example

```text
Title:
Large pothole near school

Description:
Large pothole near the school entrance...

Category:
Road

Location:
Matale Town

Severity:
High

People affected:
85

[ Submit Report ]
```

### Validation rules

- title required
- title length within reasonable range
- description required
- category required
- location required
- severity required
- people affected must be a positive integer
- reject obviously invalid values
- show friendly inline messages

---

## 7.4 Issue Details Page

Display:

- issue title
- description
- category
- location
- severity
- people affected
- priority score
- priority level
- supporter count
- status
- reported date/time
- status timeline
- action buttons

### Resident actions

```text
Support Issue
Edit My Report
Delete/Cancel My Report
```

Actions must respect permissions and status rules.

---

## 7.5 My Reports Page

Display the logged-in resident's reports:

```text
Issue title
Priority
Status
Reported date
Last updated
```

Use badges such as:

- Reported
- Under Review
- In Progress
- Resolved

---

## 7.6 Admin Dashboard

### Summary cards

```text
Total Issues
Open Issues
Critical Issues
Resolved Issues
```

### Main section

**Community Priority Queue**

Sort by descending priority score.

Example:

```text
1. Blocked Drain Near School     94  CRITICAL
2. School Pothole                89  CRITICAL
3. Garbage Overflow              74  HIGH
4. Broken Streetlight            44  MEDIUM
```

### Admin actions

- open issue
- change status
- update severity if necessary
- add internal/admin note
- assign category/team label if included
- resolve issue
- remove duplicate/inappropriate issue

---

# 8. Core Feature: Community Priority Score

This is the main differentiator of GramaFix.

## Goal

Do not treat all reports as equally urgent. Estimate which issues deserve earlier attention.

## Score range

```text
0–25      LOW
26–50     MEDIUM
51–75     HIGH
76–100    CRITICAL
```

## MVP scoring inputs

| Factor | Weight |
|---|---:|
| Severity | 40% |
| People affected | 30% |
| Urgency | 20% |
| Age of report | 10% |

### Conceptual formula

```text
Priority Score =
    Severity Score × 0.40
  + Impact Score × 0.30
  + Urgency Score × 0.20
  + Age Score × 0.10
```

Normalize each component to 0–100 first.

### Example

```text
Issue: Blocked Drain Near School

Severity        95 × 0.40 = 38.0
Affected People 93 × 0.30 = 27.9
Urgency         90 × 0.20 = 18.0
Report Age      80 × 0.10 =  8.0

Total = 91.9
Rounded = 92

Priority = CRITICAL
```

### Important engineering principle

Keep the scoring logic **transparent and deterministic** so every team member can explain it during the evaluator questions.

---

# 9. Duplicate Report Detection

This is an optional but high-value feature.

### Problem

Three residents may report the same pothole independently.

Instead of creating three separate items, GramaFix can detect probable similarity using:

- same/similar category
- similar location
- similar keywords
- close report time

### Example UX

```text
Possible similar report found

Large pothole near ABC School
Similarity: 89%

[ Support Existing Report ]
[ Continue New Report ]
```

### MVP implementation

Do not build a complex vector database.

Use simple keyword overlap and normalized location/category comparison.

AI/embeddings can be an optional future enhancement.

---

# 10. “Who Handles This?” Feature

GramaFix should not claim to automatically route complaints to every government body unless a real integration exists.

Instead, provide an MVP guidance feature based on category mapping.

Example:

```text
Category: Streetlight

Likely responsible area:
Local authority / relevant local service provider

Suggested action:
Submit and track the community report through GramaFix.
```

This feature directly addresses one user pain point: **not knowing where a local issue belongs**.

Keep the mapping configurable and avoid presenting it as a guaranteed legal/administrative authority determination.

---

# 11. Status Workflow

Use four core statuses:

```text
REPORTED
   ↓
UNDER_REVIEW
   ↓
IN_PROGRESS
   ↓
RESOLVED
```

Optional terminal status:

```text
DUPLICATE / REJECTED
```

### Resident view

Show a simple timeline:

```text
● Resolved
│
● In Progress
│
● Under Review
│
● Reported
```

### Admin view

Allow controlled status changes.

---

# 12. CRUD Operations

## Issues

### Create

Resident creates a new issue.

```http
POST /api/issues
```

### Read

```http
GET /api/issues
GET /api/issues/{id}
GET /api/users/me/issues
```

### Update

Resident updates own eligible issue; admin updates status and administrative fields.

```http
PUT /api/issues/{id}
PATCH /api/issues/{id}/status
```

### Delete

Resident can cancel/delete own eligible issue; admin can remove inappropriate/duplicate issues.

```http
DELETE /api/issues/{id}
```

## Supports

```http
POST   /api/issues/{id}/support
DELETE /api/issues/{id}/support
```

Use a uniqueness rule so one user cannot support the same issue multiple times.

## Categories

Admin-managed reference data if using a category table.

---

# 13. Database Design

## Recommended MVP tables

```text
users
issues
categories
issue_supports
issue_updates
```

### 13.1 users

```text
id              PK
name
email           UNIQUE
password_hash
role
created_at
updated_at
```

### 13.2 issues

```text
id              PK
title
description
category_id     FK
location
severity
people_affected
priority_score
status
support_count
reported_by     FK → users.id
created_at
updated_at
```

### 13.3 categories

```text
id              PK
name
icon
description
```

Seed categories:

- Road
- Streetlight
- Waste
- Water
- Drainage
- Traffic
- Environment
- Other

### 13.4 issue_supports

```text
id              PK
issue_id        FK
user_id         FK
created_at
```

Constraint:

```text
UNIQUE(issue_id, user_id)
```

### 13.5 issue_updates

```text
id              PK
issue_id        FK
old_status
new_status
updated_by      FK → users.id
note
created_at
```

Use this table as an append-only status/history stream.

---

# 14. Tables NOT Needed for the MVP

Avoid unnecessary scope.

| Table | Decision | Reason |
|---|---|---|
| locations | ❌ | A text location is enough for MVP |
| comments | 🟡 Optional | Not required by the rubric |
| notifications | 🟡 Optional | Extra complexity |
| attachments | 🟡 Optional | Requires file storage |
| departments | ❌ | Government organizational modeling is out of scope |
| roles | ❌ | Use `users.role` for only two roles |
| audit_logs | ❌ | `issue_updates` is sufficient for MVP history |
| payments | ❌ | Not related to the problem |
| chat_messages | ❌ | Unnecessary scope |
| municipalities | ❌ | No real institutional integration in MVP |

---

# 15. Entity Relationship Model

```text
                    ┌──────────────┐
                    │    USERS     │
                    ├──────────────┤
                    │ id PK        │
                    │ name         │
                    │ email        │
                    │ role         │
                    └──────┬───────┘
                           │
                     reported_by
                           │
                           ▼
                    ┌──────────────┐
                    │    ISSUES    │
                    ├──────────────┤
                    │ id PK        │
                    │ title        │
                    │ description  │
                    │ category_id  │
                    │ location     │
                    │ severity     │
                    │ people...    │
                    │ priority     │
                    │ status       │
                    │ reported_by  │
                    └───┬──────┬───┘
                        │      │
             category_id│      │issue_id
                        │      │
                        ▼      ▼
                ┌──────────┐  ┌────────────────┐
                │CATEGORIES│  │ISSUE_SUPPORTS  │
                └──────────┘  └────────────────┘

                         │ issue_id
                         ▼
                 ┌────────────────┐
                 │ ISSUE_UPDATES  │
                 └────────────────┘
```

---

# 16. Recommended Technology Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui (selectively)
- React Router

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Jakarta Bean Validation
- Spring Security (only if the team already knows it well)

## Database

- PostgreSQL

## Development / Engineering

- Git
- GitHub
- Postman or Bruno
- Chrome DevTools

## Deployment

- Vercel for frontend
- Render or another suitable free backend host
- Hosted PostgreSQL

## AI

Optional:

- LLM API through the backend for issue classification/summary
- AI-assisted coding through ChatGPT/Claude/etc.

AI API keys must never be exposed in the frontend.

---

# 17. Alternative “4-Hour Safety” Stack

If the team is not confident with backend deployment, use:

```text
React + TypeScript
Tailwind CSS
Local JSON / localStorage
Priority Engine in frontend
Vercel
```

This is the safest implementation path when the goal is to maximize the chance that a completely working application is delivered.

### Decision rule

Use Spring Boot + PostgreSQL only if at least one member can set it up quickly without learning the stack during the hackathon.

---

# 18. Frontend Project Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── issues/
│   │   ├── IssueCard.tsx
│   │   ├── IssueFilters.tsx
│   │   ├── PriorityBadge.tsx
│   │   └── StatusTimeline.tsx
│   ├── forms/
│   │   └── IssueForm.tsx
│   └── ui/
│
├── pages/
│   ├── Home.tsx
│   ├── Issues.tsx
│   ├── ReportIssue.tsx
│   ├── IssueDetails.tsx
│   ├── MyReports.tsx
│   ├── Login.tsx
│   └── AdminDashboard.tsx
│
├── services/
│   ├── issueService.ts
│   └── authService.ts
│
├── hooks/
│   └── useIssues.ts
│
├── types/
│   └── issue.ts
│
├── utils/
│   ├── priority.ts
│   └── validation.ts
│
└── App.tsx
```

---

# 19. Backend Project Structure

```text
src/main/java/com/gramafix/
├── controller/
│   ├── AuthController
│   ├── IssueController
│   └── AdminIssueController
│
├── service/
│   ├── IssueService
│   ├── PriorityService
│   └── SupportService
│
├── repository/
│   ├── UserRepository
│   ├── IssueRepository
│   ├── CategoryRepository
│   ├── IssueSupportRepository
│   └── IssueUpdateRepository
│
├── entity/
│   ├── User
│   ├── Issue
│   ├── Category
│   ├── IssueSupport
│   └── IssueUpdate
│
├── dto/
│   ├── CreateIssueRequest
│   ├── UpdateIssueRequest
│   └── IssueResponse
│
└── config/
```

---

# 20. API Design

## Auth

```http
POST /api/auth/login
```

## Issues

```http
GET    /api/issues
GET    /api/issues/{id}
POST   /api/issues
PUT    /api/issues/{id}
DELETE /api/issues/{id}
```

## My Reports

```http
GET /api/users/me/issues
```

## Support

```http
POST   /api/issues/{id}/support
DELETE /api/issues/{id}/support
```

## Admin

```http
PATCH /api/admin/issues/{id}/status
PATCH /api/admin/issues/{id}/priority
```

### Query parameters

```http
GET /api/issues?search=pothole&category=ROAD&priority=CRITICAL&status=REPORTED&location=Matale
```

---

# 21. Business Rules

1. Only authenticated residents can create reports.
2. Residents can edit only their own reports and only while the issue is eligible for editing.
3. Residents cannot modify admin-controlled fields arbitrarily.
4. A resident can support an issue once.
5. Priority score is automatically recalculated whenever relevant issue fields change.
6. Admins can update status.
7. Resolved issues remain visible for transparency unless removed for a valid reason.
8. Duplicate reports should be flagged rather than silently deleted.
9. All validation errors should be readable and user-friendly.
10. Priority calculation must be deterministic for the same input.

---

# 22. Mobile Responsive UX Specification

## Mobile navigation

Use bottom navigation for the main resident workflow:

```text
┌───────────────────────────┐
│                           │
│      PAGE CONTENT         │
│                           │
├───────────────────────────┤
│ Home Issues Report Mine Me│
└───────────────────────────┘
```

The Report action should be visually prominent.

## Mobile report form

One column, touch-friendly controls, clear progress, large submit button.

## Mobile issue list

Use cards; do not force desktop tables onto small screens.

## Mobile dashboard

Use 2×2 summary cards and a vertical priority queue.

## Desktop

Use wider grids, sidebar navigation where appropriate, and larger information density.

---

# 23. Sample Data

Seed at least 10–15 issues.

Suggested sample records:

| Title | Category | Location | Severity | People | Status |
|---|---|---|---|---:|---|
| Large pothole near school | Road | Matale Town | High | 85 | Under Review |
| Blocked drain near market | Drainage | Kandy Road | Critical | 120 | Reported |
| Broken streetlight | Streetlight | Colombo 05 | Medium | 18 | In Progress |
| Garbage accumulation | Waste | Dehiwala | High | 54 | Reported |
| Water leak on roadside | Water | Gampaha | High | 42 | In Progress |
| Fallen tree branch | Environment | Kegalle | High | 67 | Resolved |
| Damaged footpath | Road | Kurunegala | Medium | 34 | Reported |
| Overflowing waste bin | Waste | Matara | Medium | 25 | Under Review |
| Drain cover missing | Drainage | Negombo | Critical | 76 | Reported |
| Traffic signal issue | Traffic | Colombo | High | 150 | Under Review |

Use fictitious/sample data for demonstration where appropriate.

---

# 24. Error / Empty / Loading States

Do not build only the happy path.

### Empty issues

> No issues found for these filters.

### Network/API error

> We couldn't load community issues. Please try again.

### Form error

> Please correct the highlighted fields and submit again.

### Duplicate support

> You already supported this issue.

### Delete confirmation

> Are you sure you want to cancel this report? This action cannot be undone.

---

# 25. Optional AI Features

## AI #1 — Category suggestion

User enters:

> “Water is collecting beside the school because the drain is blocked.”

AI suggests:

```text
Category: Drainage
Severity: High
```

The user confirms before saving.

## AI #2 — Summary generation

Convert long text to:

> “Blocked drainage near school causing water accumulation and pedestrian safety risk.”

## AI #3 — Duplicate detection

Compare a new report with recent issues and return a possible similarity score.

### AI safety principle

AI suggestions must be treated as suggestions, not authoritative decisions.

---

# 26. CI/CD and Git Strategy

The assignment requires meaningful commit history and collaborative work.

## Branches

Suggested:

```text
main
feature/ui-home
feature/report-form
feature/issue-engine
feature/admin-dashboard
```

If branch management slows the team down, use a simple protected `main` plus short-lived feature branches.

## Example commits

```text
feat: create responsive landing page
feat: implement issue reporting form
feat: add issue validation
feat: implement priority scoring
feat: add issue search and filtering
feat: create admin dashboard
feat: add issue status workflow
fix: prevent duplicate issue support
fix: improve mobile issue card layout
chore: add production deployment config
```

Each registered member should make meaningful commits.

---

# 27. 4-Hour Hackathon Execution Plan

## 0–20 minutes — PLAN

Lock:

- problem
- target users
- five/six screens
- database shape
- technology stack
- responsibilities

No new feature requests after minute 20 unless something is required for a broken flow.

## 20–45 minutes — DESIGN

Create:

- page structure
- responsive wireframes
- component list
- API/entity plan
- seed data

## 45–175 minutes — BUILD

Build the minimum working flow first:

```text
Report
 ↓
Validation
 ↓
Issue created
 ↓
Priority score
 ↓
Issue list
 ↓
Details
 ↓
Admin status update
```

Then add search, filter, support, and My Reports.

## 175–205 minutes — POLISH

Stop major feature development.

Focus on:

- responsive layout
- error states
- spacing
- typography
- badge consistency
- toast messages
- button states
- demo data

## 205–225 minutes — SHIP

- push final code
- deploy
- test public URL
- open in Incognito/private window
- verify all main flows

## 225–240 minutes — SUBMIT

- record ≤2 minute video
- prepare submission PDF
- verify repository link
- verify deployment link
- verify video link
- verify team contribution statement
- verify AI Prompt Log

---

# 28. Team Responsibilities

## Four-member team

### Member 1 — UI / Responsive Design

- landing page
- navbar
- issue cards
- responsive layouts
- shared UI components

### Member 2 — Resident Workflow

- report form
- validation
- create/update/delete
- My Reports

### Member 3 — Core Business Logic

- priority score
- search/filter
- support
- duplicate detection if time allows

### Member 4 — Admin / QA / Deployment

- admin dashboard
- status workflow
- sample data
- testing
- Git management
- deployment

All members should still write code.

---

# 29. Testing Checklist

## Functional

- [ ] Create valid issue
- [ ] Reject invalid issue
- [ ] View issue
- [ ] Search issue
- [ ] Filter issue
- [ ] Update own issue
- [ ] Delete/cancel own issue
- [ ] Support issue
- [ ] Prevent duplicate support
- [ ] Calculate priority
- [ ] Admin changes status
- [ ] Resolved issue displays correctly

## Responsive

- [ ] 375px mobile
- [ ] 768px tablet
- [ ] 1024px desktop
- [ ] 1440px wide desktop

## UX

- [ ] No horizontal overflow on mobile
- [ ] Buttons are touch-friendly
- [ ] Validation is understandable
- [ ] Loading states exist
- [ ] Empty state exists
- [ ] Errors are handled gracefully

## Deployment

- [ ] Public URL works without local environment
- [ ] API reachable from deployed frontend
- [ ] HTTPS works
- [ ] No secret/API key exposed
- [ ] Fresh incognito test passes

---

# 30. 2-Minute Demonstration Script

## 0:00–0:15 — Problem

> “Sri Lankan communities face everyday problems such as potholes, blocked drains, garbage accumulation and broken streetlights. Although complaint mechanisms exist, reporting and following up on community-level issues can be fragmented, and it may be difficult to see which issues deserve attention first.”

## 0:15–0:30 — Solution

> “GramaFix is a responsive civic-tech web application where residents can report, discover, support and track local issues. Our main feature is a Community Priority Score that ranks issues based on severity, affected population, urgency and report age.”

## 0:30–1:00 — Resident demo

Create:

> Blocked Drain Near School

Show validation briefly, submit successfully, then show the generated score.

## 1:00–1:25 — Intelligence

Show:

```text
Priority Score: 92
Priority: CRITICAL
```

Explain in one sentence how the score is generated.

## 1:25–1:45 — Admin

Open dashboard and show:

```text
Blocked Drain   92
School Pothole  89
Garbage         74
Streetlight     44
```

Change status:

```text
Reported → In Progress → Resolved
```

## 1:45–2:00 — Impact

> “GramaFix turns individual community reports into a transparent priority queue, helping communities focus attention on problems that affect the greatest number of people.”

---

# 31. Assignment Requirement Mapping

| Assignment requirement | GramaFix evidence |
|---|---|
| Clear landing page | Home page |
| Explain Sri Lankan problem | Problem section |
| At least two functional features | Reporting, prioritization, search/filter, status tracking |
| Form | Report Issue |
| Input validation | Required fields and value checks |
| Display/search/filter/calculate/process | Issue feed, search, filters, Priority Score |
| Responsive | Mobile-first responsive web app |
| Navigation | Home, Issues, Report, My Reports, Admin |
| Sample data | Seeded issue dataset |
| Demonstrate value | Priority queue + resolution workflow |

---

# 32. Expected Rubric Strength

## Relevance (10)

Strong because the problem is clearly local and community-focused.

## Practicality & creativity (15)

Strong because the MVP is focused and the differentiator is **prioritization**, not merely complaint submission.

## Functional requirements (20)

Target all ten requirements.

## Quality & usability (15)

Focus heavily on responsive layout, mobile reporting, validation, empty states, and clear status indicators.

## Technology & AI (10)

Explain why each framework was chosen, show deterministic business logic, and declare AI usage accurately.

## Git & documentation (10)

Use meaningful commits and a complete README.

## Deployment (10)

Ensure the public URL works for an evaluator without login/cache assumptions.

## Demo (5)

Keep the story problem → report → score → admin → impact.

## Contribution (5)

Every registered member must contribute meaningful code and appear in the contribution record.

---

# 33. README Requirements

The repository README must contain:

1. Project title
2. Selected problem
3. Proposed solution
4. Main features
5. Technologies used
6. AI tools used
7. Team members
8. Individual contributions
9. Installation / execution instructions
10. Deployed application link
11. Demonstration video link
12. AI usage declaration

---

# 34. AI Prompt Log Template

Use the exact prompts actually used during the session.

| Tool | Exact prompt | Purpose | How output was checked/modified |
|---|---|---|---|
| ChatGPT | ... | UI planning | Team reviewed and adapted |
| ChatGPT | ... | Priority algorithm | Tested using sample cases |
| Claude | ... | React component | Code reviewed and modified |

Never invent prompts after the fact.

Never submit code that no member can explain.

Redact secrets, API keys, passwords, and personal data.

---

# 35. AI Declaration Template

> **ChatGPT — used for UI planning, component generation, debugging, and refinement. The team reviewed, tested, and modified generated output before integrating it.**
>
> **Claude — used for selected code-generation/debugging tasks. The team reviewed and adapted the output.**

Only include tools that were actually used.

---

# 36. Future Roadmap — NOT MVP

These ideas can be listed as future improvements without building them:

- real government/local authority integration
- GPS-based location capture
- interactive maps
- push notifications
- SMS alerts
- image-based issue recognition
- multilingual interface (Sinhala/Tamil/English)
- public authority dashboards
- verified municipal accounts
- SLA monitoring
- real-time updates
- analytics by district
- AI duplicate detection with embeddings
- citizen reputation/trust mechanisms

Do not implement these during the four-hour MVP unless everything else is already complete.

---

# 37. Final MVP Definition

## GramaFix is complete when this scenario works end-to-end:

```text
A resident opens the public web app on a phone
        ↓
Chooses “Report an Issue”
        ↓
Reports a blocked drain near a school
        ↓
Validation prevents bad input
        ↓
Issue is created
        ↓
Priority Score is calculated automatically
        ↓
Issue appears in Issues feed
        ↓
Resident can search/filter it
        ↓
Resident can open details and support it
        ↓
Admin sees it near the top of the priority queue
        ↓
Admin changes status to In Progress
        ↓
Admin marks it Resolved
        ↓
Resident sees the updated status in My Reports
```

### Golden rule

> **Build the complete flow before adding advanced features.**

The winning GramaFix MVP is not the application with the most features. It is the application that **runs reliably, looks polished on mobile and desktop, solves a clearly defined Sri Lankan problem, and can be explained confidently by every member of the team.**

---

# 38. Recommended Final Stack Summary

```text
Frontend:
React + Vite + TypeScript
Tailwind CSS + shadcn/ui

Backend:
Java 21 + Spring Boot
Spring Web + Spring Data JPA
Jakarta Validation

Database:
PostgreSQL

Core Logic:
Community Priority Engine

Optional AI:
Issue categorization / summary / duplicate suggestion

Source Control:
Git + GitHub

Testing:
Postman / Bruno + Browser DevTools

Deployment:
Vercel + Render + Hosted PostgreSQL
```

---

# 39. Product Positioning Statement

Use this wording in the presentation/PDF:

> **GramaFix is a responsive civic-tech web application for Sri Lankan communities that enables residents to report, discover, support, and track local problems while providing administrators with a transparent priority queue based on community impact.**

**Tagline:**

> **Report. Prioritize. Fix. 🇱🇰**
