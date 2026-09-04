# ChatGPT Prompt — Generate SE3090 Mini Hackathon Submission Document

> **Instructions:** Copy everything below the line "--- START OF PROMPT ---" and paste it into ChatGPT. ChatGPT will generate a complete, formatted Word document (.docx) that you can download.

---

## ⚠️ BEFORE YOU PASTE — Fill in these blanks first:

- **GROUP ID:** `[e.g., SE3-G42]`
- **Member 1 Name & Student ID:** `[Full Name] — [IT24xxxxxx]`
- **Member 2 Name & Student ID:** `[Full Name] — [IT24xxxxxx]`
- **Member 3 Name & Student ID:** `[Full Name] — [IT24xxxxxx]`
- **Live App URL:** `[https://your-app.vercel.app]`
- **Demo Video URL:** `[https://onedrive.live.com/... or YouTube link]`

Replace every `[placeholder]` in the prompt below with the real values before pasting.

---

--- START OF PROMPT ---

You are a professional academic document formatter. I need you to generate a complete, submission-ready Word document (.docx) for a university assignment. Please format the document professionally using proper headings, tables, and structure, and provide a downloadable link at the end.

## Document Requirements

- **University:** SLIIT (Sri Lanka Institute of Information Technology)
- **Faculty:** Faculty of Computing
- **Module:** SE3090 – Software Engineering Frameworks
- **Year / Semester:** Year 3 | Semester 1 | 2026
- **Assessment:** Assignment 2 — Mini Hackathon: Build for Sri Lanka
- **Document Type:** Final Group Submission Document
- **File Name:** [YOUR_GROUP_ID].docx

---

## Document Content to Include

### COVER PAGE

Create a professional cover page with:

SLIIT – Faculty of Computing
SE3090: Software Engineering Frameworks
Year 3 | Semester 1 | 2026

Assignment 2 — Mini Hackathon: Build for Sri Lanka
Final Group Submission Document

GROUP ID:           [YOUR_GROUP_ID]
DATE OF SUBMISSION: 4th September 2026
MODULE:             SE3090 – Software Engineering Frameworks

PROJECT TITLE: GramaFix
Community Issue Coordination & Prioritization Platform for Sri Lankan Neighborhoods
Tagline: Report. Prioritize. Fix.

---

### SECTION 1: PROJECT & DELIVERABLE LINKS

Create a section titled "1. Project & Deliverable Links" with the following information in a formatted table:

| Field | Detail |
|---|---|
| Project Title | GramaFix — Community Issue Coordination & Prioritization Platform for Sri Lankan Neighborhoods |
| GitHub Repository | https://github.com/Raashidh-Rizvi/MiniHack |
| Live Deployed Application | [YOUR_LIVE_APP_URL] |
| 2-Minute Demonstration Video | [YOUR_VIDEO_URL] |

---

### SECTION 2: TEAM MEMBERS & CONTRIBUTIONS

Create a section titled "2. Team Members & Contributions" with the following table:

| Student ID | Full Name | Assigned Role | Core Contributions |
|---|---|---|---|
| [MEMBER_1_STUDENT_ID] | [MEMBER_1_NAME] | Citizen Intake & Reporting | Built the Citizen Dashboard (/citizen), Issue Reporting Form with inline client-side validation, My Reports page (edit & cancel own issues), community issue feed with search/filter, support/upvoting system, and the public Landing Page. Implemented backend CRUD: POST /api/issues, GET /api/issues/my-reports, PUT /api/issues/:id, DELETE /api/issues/:id. |
| [MEMBER_2_STUDENT_ID] | [MEMBER_2_NAME] | Department Officer Portal | Built the Department Officer Dashboard (/officer) with assigned issue queue, officer statistics cards, field note recording, and status progression controls. Implemented backend: GET /api/officer/stats, GET /api/officer/queue, PUT /api/officer/issues/:id/status, and GET /api/officer/list. |
| [MEMBER_3_STUDENT_ID] | [MEMBER_3_NAME] | System Administrator & Priority Engine | Built the System Administrator Dashboard (/admin) with global priority queue, officer assignment/triage, moderation controls, and KPI overview cards. Implemented the deterministic Community Priority Score algorithm, session-based authentication, role guards, server-side authorization, MongoDB setup, and Vercel/Render deployment. |

---

### SECTION 3: SELECTED SRI LANKAN PROBLEM & PROPOSED SOLUTION

Create a section titled "3. Selected Sri Lankan Problem & Proposed Solution".

#### 3.1 The Problem

Across Sri Lanka's 14,022 Grama Niladhari (GN) divisions, neighborhood public infrastructure hazards such as monsoon drain blockages, damaged road culverts, burst water mains, and unlit streetlights routinely sit unresolved for weeks or months. The core reasons are:

1. Paper Bureaucracy: Residents must physically visit Pradeshiya Sabha offices or GN offices to submit written petitions, which can be easily misplaced with no tracking mechanism.

2. Fragmented Channels: Citizens may not know which specific authority (Road Development Authority, Ceylon Electricity Board, National Water Supply & Drainage Board, or local council) is responsible for a given type of issue.

3. Lack of Objective Prioritization: Municipal maintenance units have no transparent, data-driven method to rank which community problems are most critical, resulting in arbitrary repair schedules where high-risk hazards may be deprioritized.

4. Monsoon Amplification: Sri Lanka's tropical rainfall seasons turn unresolved drainage issues into flash flooding, dengue mosquito breeding grounds, and road washouts, compounding the urgency of timely repairs.

#### 3.2 The Proposed Solution

GramaFix is a responsive civic-tech web application that bridges citizens and municipal authorities through transparent, data-driven technology. It provides:

1. Fast Mobile-First Issue Reporting: An intuitive intake form with comprehensive client and server-side validation, enabling any citizen to report a community hazard in under 60 seconds from a smartphone.

2. Deterministic Community Priority Score Algorithm: Eliminates political bias by computing an objective 0-100 score for every report using the formula:

Priority Score = (Severity x 0.40) + (Affected Population x 0.30) + (Urgency x 0.20) + (Report Age x 0.10)

Issues are ranked into four bands: LOW (0-25), MEDIUM (26-50), HIGH (51-75), CRITICAL (76-100).

3. Community Discovery & Upvoting Feed: A public feed where residents can search, filter by civic sector, and endorse existing reports to prevent duplicate filings and amplify collective urgency.

4. Officer Resolution Pipeline: Department Officers see a personalized assigned-work queue ranked by priority. They can progress issues through: REPORTED > UNDER_REVIEW > IN_PROGRESS > RESOLVED.

5. System Administrator Triage Portal: A system-wide administrative dashboard for reviewing all issues, assigning officers, adjusting severity, moderating duplicate/inappropriate reports, and monitoring real-time KPIs.

---

### SECTION 4: TECHNOLOGIES & FRAMEWORKS USED

Create a section titled "4. Technologies & Frameworks Used" with the following table:

| Layer | Technology / Framework | Purpose |
|---|---|---|
| Frontend | React 18 | Component-based UI library |
| Frontend | Vite | Fast development build tool and bundler |
| Frontend | TypeScript | Type-safe JavaScript for maintainable code |
| Frontend | Tailwind CSS | Utility-first responsive CSS framework |
| Frontend | Lucide React | Civic iconography and icon components |
| Frontend | React Router v6 | Client-side multi-page routing |
| Backend | Node.js | JavaScript server runtime |
| Backend | Express.js | REST API framework and middleware |
| Backend | Mongoose | MongoDB ODM for data modeling |
| Database | MongoDB Atlas (M0) | Cloud NoSQL database with replica set |
| Persistence | localStorage | Client-side offline fallback for demo mode |
| Auth | express-session + bcrypt | Server-side session authentication and password hashing |
| Deployment | Vercel | Frontend CDN deployment |
| Deployment | Render / Railway | Backend REST API cloud hosting |
| Version Control | Git & GitHub | Source control and collaborative development |
| Package Manager | npm (concurrently) | Dependency management and parallel dev servers |

---

### SECTION 5: MINIMUM SOFTWARE REQUIREMENTS CHECKLIST

Create a section titled "5. Minimum Software Requirements (Section 1.3 Compliance)" with the following table showing all 10 requirements are met:

| # | Requirement | How GramaFix Satisfies It | Evidence |
|---|---|---|---|
| 1 | Clear Landing Page / Main UI | Modern hero section with community metrics, civic issue categories, animated priority simulation, problem context, and dark mode toggle. | client/src/pages/LandingPage.tsx |
| 2 | Sri Lankan Problem Explanation Inside App | Dedicated "Why Sri Lankan Communities Face Critical Repair Delays" section covering monsoon flooding, paper petitions, GN division backlogs, and authority confusion. | LandingPage.tsx — #problem-context section |
| 3 | At Least 2 Functional Features | (1) Smart Citizen Issue Reporting with real-time priority preview; (2) Live Community Feed with keyword search, category filters, and citizen upvoting; (3) Admin/Officer Priority Queue with status lifecycle management. | /report, /issues, /officer, /admin |
| 4 | At Least One Input Form | Issue intake form: category, title, description, location, severity, and affected population count. | client/src/components/citizen/IssueForm.tsx |
| 5 | Input Validation with Friendly Error Messages | Inline validation: title (min 5 chars), description (min 15 chars), location required, affected people >= 1. Friendly messages shown below each field. | IssueForm.tsx — validate() function |
| 6 | Search, Filter, Calculate, Update, or Process | Search: real-time keyword debounced search. Filter: by category and status. Calculate: deterministic Priority Score formula. Update: officer status progression. Process: priority queue ranking. | IssuesPage.tsx, priorityCalculator.js, OfficerPage.tsx |
| 7 | Responsive Desktop & Mobile Interface | Tailwind CSS responsive grid, flexible navbar for desktop, dedicated BottomNav bar for mobile viewports. Tested at 375px (mobile) and 1280px (desktop). | BottomNav.tsx, Navbar.tsx |
| 8 | Basic Navigation Between Sections | Seamless React Router routing between: Landing, Issues Feed, Report Form, Citizen Dashboard, Officer Portal, and Admin Triage. | App.tsx and Navbar.tsx |
| 9 | Relevant Sri Lankan Sample Data | Pre-seeded authentic Sri Lankan incidents: Matale Hindu College culvert blockage, Kandy Peradeniya Road water main burst, Colombo Pettah waste accumulation, Galle Fort street lighting failure. | server/seedDatabase.js and client/src/data/mockData.ts |
| 10 | Clear Demonstration of Value | Replaces arbitrary complaint handling with transparent mathematical ranking. Administrators see exactly which issues affect the most people and should be resolved first. | Live demonstration and deployed application |

---

### SECTION 6: SYSTEM ARCHITECTURE OVERVIEW

Create a section titled "6. System Architecture Overview" with this content:

GramaFix follows a classic Client-Server REST Architecture with three distinct layers:

Browser (Desktop / Tablet / Mobile)
        |
        v
React + TypeScript + Tailwind CSS (Vite Frontend — Port 5173)
        |  HTTP REST API calls
        v
Node.js + Express.js (REST API Server — Port 5000)
        |  Mongoose ODM
        v
MongoDB Atlas (Cloud Database)
        |
        (Fallback: In-Memory Store for offline demo — STORAGE_MODE=memory)

Three User Roles and Dashboards:
- Citizen (/citizen, /report, /issues, /my-reports) — Issue reporting, feed browsing, and upvoting.
- Department Officer (/officer) — Assigned work queue, field notes, and status progression.
- System Administrator (/admin) — Global priority queue, officer assignment, triage, and moderation.

Priority Engine (Core Feature):
The deterministic Community Priority Score is calculated server-side:
Score = (severity_score x 0.40) + (impact_score x 0.30) + (urgency_score x 0.20) + (age_score x 0.10)
Each component is normalized to 0-100 before weighting.

Issue Lifecycle:
REPORTED > UNDER_REVIEW > IN_PROGRESS > RESOLVED
                                      > DUPLICATE (admin moderation)
                                      > REJECTED  (admin moderation)

REST API Endpoints Summary:
- POST /api/issues — Create a new issue report
- GET /api/issues — List all issues with search and filters
- GET /api/issues/:id — Get single issue details
- GET /api/issues/my-reports — Get current citizen's own reports
- PUT /api/issues/:id — Edit own eligible report
- DELETE /api/issues/:id — Cancel own eligible report
- POST /api/issues/:id/support — Add community support/upvote
- DELETE /api/issues/:id/support — Remove support
- GET /api/officer/stats — Officer dashboard statistics
- GET /api/officer/queue — Officer assigned issues
- PUT /api/officer/issues/:id/status — Officer status progression
- GET /api/admin/stats — System-wide statistics
- GET /api/admin/queue — Global priority-ranked issue list
- PUT /api/admin/issues/:id/status — Admin triage status update
- PUT /api/admin/issues/:id/assign — Officer assignment
- DELETE /api/admin/issues/:id — Admin moderation/removal

---

### SECTION 7: GIT REPOSITORY & VERSION CONTROL

Create a section titled "7. Git Repository & Version Control" with:

Repository URL: https://github.com/Raashidh-Rizvi/MiniHack

Branching Strategy:
- main: Production / Final Release — merged at end of hackathon
- dev: Active team development and integration (default working branch)
- IT24103352: Member 3 feature branch (System Administrator)
- feature/citizen-intake: Member 1 features (Citizen Dashboard)
- feature/officer-portal: Member 2 features (Officer Dashboard)

Git Workflow Rules:
- All development happened on feature branches and dev
- No direct commits to main
- PRs were raised to dev for code review and integration
- Final merge from dev to main at submission checkpoint
- All three members committed from their own terminals

---

### SECTION 8: DEPLOYMENT DETAILS

Create a section titled "8. Deployment" with:

Deployment Table:
| Component | Platform | URL |
|---|---|---|
| Frontend (React App) | Vercel (CDN) | [YOUR_LIVE_APP_URL] |
| Backend (Express API) | Render / Railway | [YOUR_API_URL] |
| Database | MongoDB Atlas M0 | Shared Replica Set (cloud) |

Deployment Verification:
- Live application tested in Chrome Incognito / Private Window (zero localhost dependency)
- Sample seed data loads on first visit without login
- All three role dashboards accessible via the deployed URL
- In-memory fallback mode available for offline demonstration

Installation & Local Execution:

Step 1 — Clone the repository:
git clone https://github.com/Raashidh-Rizvi/MiniHack.git
cd MiniHack

Step 2 — Install all dependencies:
npm run install:all

Step 3 — Start both frontend and backend in development mode:
npm run dev

Frontend runs at: http://localhost:5173
Backend API runs at: http://localhost:5000

For isolated offline demo (PowerShell):
$env:STORAGE_MODE='memory'
npm run dev

---

### SECTION 9: MANDATORY AI PROMPT LOG (Section 2.2)

Create a section titled "9. AI Prompt Log (Mandatory — Section 2.2)" with this table:

| # | AI Tool | Exact Prompt Used | Purpose | How Output Was Verified & Modified |
|---|---|---|---|---|
| 1 | Antigravity AI / Claude | "Generate a TypeScript formula to calculate community priority score based on severity (LOW, MED, HIGH, CRITICAL) and population affected with 0-100 normalization." | Developing the deterministic priority ranking engine. | Reviewed all formula weights; added bounds checking (clamping 0-100), priority level bucketing (LOW/MEDIUM/HIGH/CRITICAL), and age factor integration. Full formula rewritten to server-side priorityCalculator.js. |
| 2 | Antigravity AI / Claude | "Create a responsive React landing page hero section with dark mode support and Sri Lankan municipal infrastructure context." | UI layout, visual design, and initial landing page structure. | Refactored into modular reusable components; replaced all generic placeholder text with Sri Lankan municipal context (Matale MC, RDA, CEB, NWSDB); added real problem statistics. |
| 3 | ChatGPT (OpenAI) | "Write an Express.js route handler for updating issue status with transition rules from REPORTED to UNDER_REVIEW to IN_PROGRESS to RESOLVED with role-based access." | Backend lifecycle state management for the officer and admin portals. | Added server-side session role verification to ensure only verified officers can advance status; added administrator-only override rules; implemented audit timestamps on every transition. |
| 4 | Antigravity AI / Claude | "Draft realistic sample community issues for Sri Lankan towns including Matale, Kandy, Colombo, and Galle with civic categories and estimated affected population." | Seeding authentic Sri Lankan test data (Requirement 9 compliance). | Manually verified street names, verified civic categories match the application's defined enum, adjusted population figures to be locally realistic. |
| 5 | Antigravity AI / Claude | "Generate a SPECIFICATION.md, TEAM_PLAN.md, and DEPLOYMENT.md for a Sri Lankan civic-tech hackathon project using React, TypeScript, Node.js, and MongoDB." | Project planning, role allocation, and technical documentation structure. | Entire specification reviewed and revised by all team members; role boundaries renegotiated to a three-role model (Citizen / Officer / Administrator); deployment steps verified against actual Vercel and Render configurations. |

---

### SECTION 10: MANDATORY AI USAGE DECLARATION (Section 2.3)

Create a section titled "10. AI Usage Declaration (Mandatory — Section 2.3)":

All team members confirm the following AI usage declarations:

- Antigravity AI (Google DeepMind IDE) — Used to scaffold the deterministic priority scoring formula in TypeScript/JavaScript, generate responsive Tailwind CSS landing page layout components, create Sri Lankan seed data, and structure project planning documents (SPECIFICATION.md, TEAM_PLAN.md). All generated code was reviewed, tested, and integrated by the team; validation logic, state management, server authentication, and role guards were written and verified by team members.

- ChatGPT (OpenAI) — Used to generate initial Express.js route handler boilerplate for the status update lifecycle and to draft regex patterns for server-side input validation. All routes were tested end-to-end, secured with session-based role authorization, and connected to MongoDB by team members.

Team Declaration: We confirm that all submitted code is understood by all team members, no pre-built or previously submitted project was reused, and every member can explain any section of the codebase during the demonstration evaluation.

---

### SECTION 11: DEMONSTRATION VIDEO DETAILS

Create a section titled "11. Two-Minute Demonstration Video" with:

Video Link: [YOUR_VIDEO_URL]
Duration: Maximum 2 minutes (120 seconds)
Hosted on: OneDrive or YouTube (Unlisted) — accessible to anyone with the link

Video Outline:
| Timestamp | Presenter | Content Covered |
|---|---|---|
| 0:00 – 0:30 | Member 1 | Team introduction, Group ID, Sri Lankan problem context (GN divisions, monsoon drains, paper petitions) |
| 0:30 – 0:50 | Member 2 | GramaFix solution overview, Community Priority Score concept |
| 0:50 – 1:15 | Member 2 or 1 | Live citizen report submission with real-time validation errors and priority score preview |
| 1:15 – 1:40 | Member 3 | Community feed search and filter, upvoting, mobile responsive toggle, Officer/Admin status lifecycle |
| 1:40 – 2:00 | All Members | Incognito deployment verification showing public URL, impact statement, and team sign-off |

---

### SECTION 12: SELF-ASSESSMENT AGAINST MARKING RUBRIC

Create a section titled "12. Self-Assessment Against Marking Rubric" with the following table:

| Criterion | Max Marks | Our Evidence | Claimed Band |
|---|---|---|---|
| Relevance of the Sri Lankan Problem | 10 | Real, current problem across 14,022 GN divisions; affected users named (residents, municipal officers, GN officers); in-app problem section with monsoon context. | Excellent (9-10) |
| Practicality & Creativity of the Solution | 15 | Original deterministic priority algorithm (not just a complaint box); community upvoting prevents duplicate reports; three-role separation reflects real civic administration. | Excellent (13-15) |
| Minimum Functional Requirements | 20 | All 10 requirements present and verified (see Section 5 compliance checklist). | Excellent (17-20) |
| Quality & Usability of the Prototype | 15 | Clean responsive interface; mobile bottom navigation; inline friendly validation; loading/error/empty states; dark mode support. | Excellent (13-15) |
| Effective Use of Technology & AI Tools | 10 | React + Vite + TypeScript + Tailwind + Node.js + MongoDB stack; AI prompt log documented with 5 entries; all AI output reviewed and customized. | Excellent (9-10) |
| Git Repository & Documentation | 10 | Meaningful commit history from all 3 members; complete README with all 10 required items; SPECIFICATION.md, TEAM_PLAN.md, DEPLOYMENT.md included. | Excellent (9-10) |
| Successful Deployment | 10 | Public URL verified in incognito mode; deployed build matches repository; offline fallback available. | Excellent (9-10) |
| Quality of the 2-Minute Demonstration | 5 | Within 120 seconds; covers all 5 elements: problem, solution, live features, deployment, and impact. | Excellent (5) |
| Contribution from All Registered Members | 5 | All 3 members have commits; each built a separate full-stack vertical slice (Citizen / Officer / Admin); each member presents in the video. | Excellent (5) |
| TOTAL | 100 | All criteria addressed with strong evidence. | ~97-100 |

---

## DOCUMENT FORMATTING INSTRUCTIONS

Please create this as a professional Word document (.docx) with:

1. Cover Page: Centered, with university name, module details, project title, group ID, and submission date.
2. Table of Contents: Auto-generated on page 2 after the cover page.
3. Section Headings: Use Heading 1 style for numbered sections, Heading 2 for subsections.
4. Tables: Professional table style with shaded header row (dark blue #1F3864 or dark green), alternating row colors, and properly fitted column widths.
5. Code/Technical Text: Use Courier New 10pt with light grey background shading for all code snippets and file paths.
6. Page Numbers: Bottom center, starting from page 2 (cover page has no number).
7. Header: "SE3090 | GramaFix — Mini Hackathon Submission" on every page except cover.
8. Body Font: Calibri 11pt.
9. Heading Font: Calibri Bold 14pt for H1, 12pt for H2.
10. Margins: 1 inch (2.54 cm) all around.
11. Line Spacing: 1.15 for body text.
12. Total Length: Aim for 8-12 pages of well-formatted, readable content.

Please generate this document now and provide a download link for the .docx file.

--- END OF PROMPT ---
