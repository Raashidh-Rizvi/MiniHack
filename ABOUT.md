# About GramaFix 🇱🇰
> **Community Issue Coordination and Prioritization Platform for Sri Lankan Neighborhoods**  
> *Report. Prioritize. Fix.*

---

## 🧭 Executive Summary

**GramaFix** is a civic-tech intelligence and coordination platform purpose-built for Sri Lankan local communities. It bridges the gap between everyday residents, Grama Niladhari ward officers, and municipal administrative bodies (Municipal Councils, Urban Councils, and Pradeshiya Sabhas) through transparent, deterministic issue reporting, community prioritization, and end-to-end resolution tracking.

This document details the core rationale, architectural motivations, societal objectives, and technical focus areas of the GramaFix platform.

---

## 1. 🔍 Why This Is There (The Origin & Civic Context)

In Sri Lanka, local civic administration is divided across multiple administrative layers:
- **Provincial Councils & District Secretariats**
- **Local Authorities**: 24 Municipal Councils (MC), 41 Urban Councils (UC), and 276 Pradeshiya Sabhas (PS)
- **Grama Niladhari (GN) Divisions**: Over 14,000 grassroots administrative units serving rural, suburban, and urban communities

Despite this extensive governance framework, the day-to-day management of municipal infrastructure faces severe systemic challenges:

1. **Fragmented Communication Channels**: Residents currently report civic issues (collapsed culverts, damaged roads, broken streetlights, overflowing garbage dumps, ruptured water lines) through unorganized channels—such as handwritten letters, personal telephone calls to local politicians, WhatsApp groups, or social media posts.
2. **Unrecorded Grievances**: Complaints routinely get lost between departments or misfiled in paper records, leaving residents completely in the dark regarding whether their issue was ever logged or inspected.
3. **Information Asymmetry**: Local ward officers lack real-time visibility into the collective pain points of their neighborhoods, while citizens have no insight into municipal maintenance backlogs, scheduling constraints, or active repair projects.
4. **Geographic Inequity**: Peripheral neighborhoods and lower-income wards often struggle to get basic infrastructure repairs noticed compared to commercial centers or affluent zones.

**GramaFix exists to solve this fundamental breakdown** by introducing a unified, open, and standardized digital coordination layer connecting citizens directly with responsible local authorities.

---

## 2. 🛠️ What It Fixes (Key Problems Solved)

| Legacy Problem | The Broken Reality | GramaFix Solution |
| :--- | :--- | :--- |
| **Lost & Discarded Complaints** | Paper complaint slips and verbal requests vanish with zero paper trail or accountability. | **Permanent Digital Ledger**: Every issue receives a unique ID, timestamp, GPS coordinate, photographic evidence, and public audit history. |
| **Subjective Bias & Favoritism** | What gets fixed often depends on personal ties, political influence, or who complains the loudest. | **Deterministic Priority Engine**: Priority is calculated strictly via mathematical criteria—severity, community population affected, urgency, and wait time. |
| **Duplicate Report Inundation** | 50 citizens in a neighborhood call the council about the same collapsed culvert, overwhelming office staff. | **Community Upvoting & Endorsement**: Residents upvote and support existing reports, elevating the issue's community priority score instead of cluttering the system. |
| **The "Black Box" Process** | Citizens file a report and never hear back; they have no idea if someone came to inspect or if parts were ordered. | **Transparent 4-Stage Lifecycle**: Real-time status badges (`REPORTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`) with officer updates and resolution notes. |
| **Field Officer Triage Chaos** | Municipal field teams receive vague directions and disorganized paper lists without geospatial priority. | **Geospatial Prioritization Queue**: Field officers access an organized, priority-sorted dashboard with interactive Leaflet map pinpoints and severity tags. |

---

## 3. 🎯 What Is The Goal (Mission & Objectives)

The overarching goal of GramaFix is to establish a **fair, data-driven, and transparent municipal management ecosystem** that accelerates civic hazard resolution across Sri Lankan communities.

### Strategic Goals:
1. **Empower Grassroots Citizens**: Provide every resident—regardless of technical literacy—a frictionless, mobile-first method to report hazards and track improvements in their immediate living environment.
2. **Eliminate Bureaucratic Inertia**: Automate prioritization so municipal councils immediately identify high-risk infrastructure failures before minor issues escalate into catastrophic failures.
3. **Foster Mutual Trust & Civic Pride**: Rebuild trust between citizens and civic authorities through total transparency: every citizen can monitor when an issue was triaged, assigned, worked on, and resolved.
4. **Data-Driven Municipal Budgeting**: Provide municipal executives and Pradeshiya Sabha leaders with aggregate spatial analytics to allocate public funding where community infrastructure is most degraded.

---

## 4. 🔬 What Is The Focus (Core Pillars & Architecture)

GramaFix is focused on four operational and technical pillars:

### 4.1. Neighborhood-Level & Spatial Focus
- **Hyper-Local Resolution**: Tracking issues down to specific wards, Grama Niladhari divisions, and exact OpenStreetMap coordinates via Leaflet.
- **Geographic Clustering**: Preventing municipal crews from crisscrossing districts blindly by grouping proximate high-priority reports.

### 4.2. Three-Tier Multi-Role Synergy
GramaFix unites the three essential civic actors into one cohesive system:
- **👤 Citizen / Resident**:
  - Submits structured reports with photographic proof, severity tags, and GPS location.
  - Explores the community feed and endorses (upvotes) existing neighborhood issues.
  - Tracks the personal history and resolution milestones of their submitted reports.
- **👷 Department Officer**:
  - Receives assigned municipal issues categorized by domain (Roads, Water, Electricity, Sanitation).
  - Inspects on-site reports, validates severity, and updates the official status lifecycle.
  - Logs internal investigation notes and records resolution verification details.
- **🛡️ System Administrator**:
  - Oversees holistic municipal queue health and balances departmental workloads.
  - Manages verified role assignments, user access, and community jurisdiction filters.
  - Audits priority scoring consistency and system integrity.

### 4.3. The Deterministic Priority Formula
Unlike black-box algorithms or opaque ranking models, GramaFix prioritizes issues using an open, transparent, and reproducible mathematical engine:

$$\text{Priority Score} = (\text{Severity} \times 0.40) + (\text{Impact} \times 0.30) + (\text{Urgency} \times 0.20) + (\text{Age} \times 0.10)$$

Where:
- **Severity ($40\%$)**: Physical danger or structural hazard scale ($1.0$ to $5.0$).
- **Impact ($30\%$)**: Volume of affected residents and community upvotes.
- **Urgency ($20\%$)**: Immediacy of intervention required (e.g. active flooding vs. faded road paint).
- **Age ($10\%$)**: Days elapsed since initial reporting, preventing lingering neglect of non-critical issues.

### 4.4. Mobile-First, Accessible Architecture
- Designed for lightweight mobile web performance over 3G/4G cellular networks throughout Sri Lanka.
- Clean high-contrast UI compliant with Obsidian Crimson (Dark) and Alabaster Ruby (Light) themes.
- Clear bilingual compatibility considerations for Sinhala, Tamil, and English-speaking users.

---

## 5. 💡 Why It Is Important (Value & Societal Impact)

The societal value of GramaFix extends far beyond software utility:

### 1. Saving Lives & Preventing Tragic Accidents
Unrepaired open manholes, submerged electrical junction boxes during monsoon seasons, and washed-away bridge railings claim lives every year in Sri Lanka. GramaFix’s deterministic priority algorithm flags critical hazards instantly, triggering urgent municipal mobilization.

### 2. Curbing Vector-Borne & Public Health Outbreaks
Uncollected refuse piles and blocked drainage ditches are primary breeding grounds for dengue mosquitoes (*Aedes aegypti*). By streamlining rapid sanitation and drainage reporting, GramaFix directly contributes to community disease prevention.

### 3. Economic Resilience & Optimal Resource Usage
Local councils operate under strict budgetary and equipment constraints. GramaFix guarantees that limited asphalt trucks, backhoes, and electrical maintenance crews are dispatched to the highest-impact community needs first, maximizing return on public funds.

### 4. Democratic Participation & Civic Cohesion
When residents witness their reports being acknowledged and systematically repaired by local officers, civic apathy transforms into proactive community participation. GramaFix strengthens the social contract between the public and their local government.

---

## 🤝 Project Information

- **Project**: GramaFix Sri Lanka
- **Repository**: [https://github.com/Raashidh-Rizvi/MiniHack](https://github.com/Raashidh-Rizvi/MiniHack)
- **Live System**: [https://mini-hack-clod.vercel.app/citizen](https://mini-hack-clod.vercel.app/citizen)
- **Academic Context**: SE3090 – Software Engineering Frameworks | Assignment 2 – Mini Hackathon
- **Academic Period / Term**: **August – September 2026** (Year 3 | Semester 1)
- **Development Sprint**: **September 2026** (4-Hour Rapid Mini Hackathon Sprint)
- **Date of Submission**: **4th September 2026**
- **Faculty / Institution**: SLIIT Faculty of Computing, BSc (Hons) in Information Technology
- **Specification**: [SPECIFICATION.md](SPECIFICATION.md)
- **Design Tokens**: [THEME.md](THEME.md)

---

## 👥 Engineering & Development Team

GramaFix was engineered by a dedicated 3-member team for the SE3090 Software Engineering Frameworks Mini Hackathon:

| Member | Developer Name | Student ID | Core Engineering Role & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Raashidh M.R** | `IT24104191` | **Priority Queue & Feed Discovery**<br>• Community Feed Discovery: Neighborhood issue exploration, search & category filtering<br>• Community Priority Queue: Impact-ranked queue display with real-time score sorting<br>• Community Upvoting & Issue Endorsement system preventing duplicate submissions<br>• Public Priority Score visualization, community engagement & transparency indicators |
| **Member 2** | **Atheek M.F** | `IT24103933` | **Department Officer Portal & Reporting Journey**<br>• Department Officer Dashboard (`/officer`) & assigned municipal issue triage<br>• Complete Reporting Journey: Issue intake form, validation & Leaflet location selector<br>• Officer field investigation note logging & photographic evidence verification<br>• Status progression controls (`REPORTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`) |
| **Member 3** | **Ahamed M.A.W** | `IT24103352` | **System Administrator**<br>• Executive Admin Dashboard (`/admin`) with cross-district analytics, metrics & KPIs<br>• Global priority queue moderation & cross-departmental officer workload assignment<br>• Deterministic Community Priority Score mathematical calculation engine<br>• Verified server sessions, token guards & multi-tier role authorization |


