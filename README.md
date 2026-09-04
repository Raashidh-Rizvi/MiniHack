# GramaFix 🇱🇰
> **Report. Prioritize. Fix.**  
> *Community Issue Coordination and Prioritization Platform for Sri Lankan Neighborhoods*

---

## 📌 Project Overview
**GramaFix** is a responsive civic-tech web application built for Sri Lankan communities that enables residents to report, discover, support, and track local problems (potholes, blocked drains, broken streetlights, garbage accumulation, water leaks, etc.) while providing administrators with a transparent, deterministic **Community Priority Queue** based on community impact.

For complete project details, architecture, scoring formulas, and rubric alignment, see [SPECIFICATION.md](file:///d:/Project/MiniHack/SPECIFICATION.md). For the 4-hour hackathon execution plan and 3-person team responsibilities, see [TEAM_PLAN.md](file:///d:/Project/MiniHack/TEAM_PLAN.md). For UI tokens, component blueprints, and dark/light color palettes, see [THEME.md](file:///d:/Project/MiniHack/THEME.md). For cloud hosting, environment configuration, and live launch steps, see [DEPLOYMENT.md](file:///d:/Project/MiniHack/DEPLOYMENT.md).

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

### Member 3 - System Administrator (IT24103352)

The implementation on branch `IT24103352` adds verified server sessions and role guards, administrative assignment/triage/moderation, private notes and recorded activity, consistent priority scoring, and responsive dashboard controls. Existing Citizen and Officer endpoints share the same identity/ownership rules. See [the implementation plan](System_Admin_implementation_plan.md) for phase results and remaining verification limits.

Run `npm run build` for the frontend and `npm --prefix server test` for isolated backend tests. Tests use disposable in-memory fixtures by default and never load the development database credentials. Mongo integration is opt-in: set `RUN_MONGO_TESTS=true` and `MONGO_TEST_URI` to a dedicated database named `gramafix_test` or `gramafix_test_<suffix>` before running the tests. Only test-created records are cleaned up; collections are never dropped.

For an isolated local demonstration in PowerShell:

```powershell
$env:STORAGE_MODE='memory'
npm run dev
```

Use the existing sign-in page presets for the memory demo. Roles now require server sign-in; changing a browser-local persona cannot grant administrator access. Public registration creates citizens only. Real MongoDB officer/admin accounts can be provisioned explicitly with `npm --prefix server run provision`, using environment values `MONGO_URI`, `PROVISION_EMAIL`, `PROVISION_PASSWORD`, `PROVISION_NAME`, and `PROVISION_ROLE` (`ADMIN` or `OFFICER`). Provisioning refuses to overwrite existing accounts and is never automatic.

Sessions last eight hours and expire when the API process restarts. In-memory reports are temporary; browser-local citizen demo storage is separate. Use `STORAGE_MODE=mongo` to require the configured database rather than falling back on startup. Normal startup retains the existing MongoDB-with-memory-fallback behavior. Optional offline public demo data can be enabled with `VITE_LOCAL_DEMO=true`; authenticated failures are never treated as successful citizen writes. Community support retains its existing browser-local fallback behavior and is not a new administrator feature.

---

## 📄 License & Declarations
See [SPECIFICATION.md](file:///d:/Project/MiniHack/SPECIFICATION.md) for full assignment details, AI usage declarations, and demonstration scripts.
