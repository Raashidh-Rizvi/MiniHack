# GramaFix 🇱🇰
> **Report. Prioritize. Fix.**  
> *Community Issue Coordination and Prioritization Platform for Sri Lankan Neighborhoods*

---

## 📌 Project Overview
**GramaFix** is a responsive civic-tech web application built for Sri Lankan communities that enables residents to report, discover, support, and track local problems (potholes, blocked drains, broken streetlights, garbage accumulation, water leaks, etc.) while providing administrators with a transparent, deterministic **Community Priority Queue** based on community impact.

For complete project details, architecture, scoring formulas, and rubric alignment, see [SPECIFICATION.md](file:///d:/Project/MiniHack/SPECIFICATION.md). For the 4-hour hackathon execution plan and 3-person team responsibilities, see [TEAM_PLAN.md](file:///d:/Project/MiniHack/TEAM_PLAN.md).

---

## 🎯 Core Features
- 🚀 **Interactive Responsive Landing Page**: Problem showcase, community metrics, categories, and direct reporting call-to-action.
- 📝 **Smart Issue Reporting & Validation**: Clean mobile-first forms with inline validation (severity, affected population, location).
- ⚖️ **Deterministic Community Priority Score**: Impact ranking calculated via:
  $$\text{Priority Score} = (\text{Severity} \times 0.40) + (\text{Impact} \times 0.30) + (\text{Urgency} \times 0.20) + (\text{Age} \times 0.10)$$
- 🔍 **Community Issues Feed & Discovery**: Filter by category, priority, status, and search keywords.
- 🤝 **Issue Support / Upvoting**: Prevent duplicate reports and rally community weight behind urgent issues.
- 📊 **Admin Priority Queue & Lifecycle Tracking**: Managed statuses (`REPORTED` → `UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`) with internal notes.
- 📱 **Mobile-First UX**: Responsive card layout, bottom navigation for mobile, and touch-friendly controls.

---

## 🛠️ Technology Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / Storage**: REST API / Deterministic Priority Engine with seeded Sri Lankan community sample data & localStorage persistence
- **Version Control**: Git & GitHub

---

## 🚀 Quick Start & Development

```bash
# Clone the repository
git clone https://github.com/Raashidh-Rizvi/MiniHack.git

# Navigate to project directory
cd MiniHack

# Install dependencies
npm install

# Start local dev server
npm run dev
```

---

## 👥 Team & Contributions
- SE3090 – Software Engineering Frameworks | Assignment 2 – Mini Hackathon

---

## 📄 License & Declarations
See [SPECIFICATION.md](file:///d:/Project/MiniHack/SPECIFICATION.md) for full assignment details, AI usage declarations, and demonstration scripts.
