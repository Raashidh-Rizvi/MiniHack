# Member 2 – Department Officer: Balance Work Plan

> **Updated: 04 Sep 2026** — Based on code audit after `git pull origin dev`.
> This file shows what is already done and what is left to build, divided into clear MVP phases.

---

## ✅ Already Completed — Do NOT rebuild these

| Area | Feature | Status |
|---|---|---|
| **Frontend Page** | Officer dashboard with header | ✅ Done |
| | 5 summary stat cards (Total, Open, Critical, In Progress, Resolved) | ✅ Done |
| | Assigned issue queue table (rank, title, location, category) | ✅ Done |
| | Search bar (by title and location) | ✅ Done |
| | Status filter chips (ALL / REPORTED / UNDER_REVIEW / IN_PROGRESS / RESOLVED) | ✅ Done |
| | Status update modal with allowed next-status buttons only | ✅ Done |
| | Field notes textarea (500 character limit) | ✅ Done |
| | Status timeline inside modal | ✅ Done |
| | Success toast, loading skeleton, error state, empty state | ✅ Done |
| | Auto-refresh stats after update, debounced search, refresh button | ✅ Done |
| | Mobile responsive table | ✅ Done |
| **Frontend Service** | `getOfficerStats()`, `getOfficerQueue()`, `officerUpdateStatus()`, `getOfficerList()` | ✅ Done |
| **Backend Controller** | `GET /api/officer/queue` – returns only that officer's issues | ✅ Done |
| | `GET /api/officer/stats` – counts for that officer | ✅ Done |
| | `PUT /api/officer/issues/:id/status` – updates status and field notes | ✅ Done |
| | `GET /api/officer/list` – for admin reassignment | ✅ Done |
| | MongoDB and memory-store fallback paths | ✅ Done |
| | Search, status, priority, category filters in queue | ✅ Done |

---

## 🔨 Remaining Work — Divided into Phases

---

## Phase 1 — JWT Auth Middleware (Backend Security Foundation)

**Goal:** Stop anyone from calling officer API routes without logging in first. Right now the routes have no protection at all.

**Files to touch:**
- **[NEW]** `server/middleware/authMiddleware.js`
- **[MODIFY]** `server/routes/officerRoutes.js`

### Step 1 — Create the middleware file

Create a new file at `server/middleware/authMiddleware.js`:

```javascript
const jwt = require('jsonwebtoken');

/** Verify JWT token and attach user to req.user */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains: { id, role, email }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

/** Check if the logged-in user has the required role */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied for your role' });
  }
  next();
};

module.exports = { protect, requireRole };
```

### Step 2 — Protect the officer routes

Update `server/routes/officerRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getMyQueue,
  getOfficerStats,
  officerUpdateStatus,
  getOfficerList,
} = require('../controllers/officerController');

router.get('/stats',             protect, requireRole('OFFICER'), getOfficerStats);
router.get('/queue',             protect, requireRole('OFFICER'), getMyQueue);
router.put('/issues/:id/status', protect, requireRole('OFFICER'), officerUpdateStatus);
router.get('/list',              protect, requireRole('ADMIN'),   getOfficerList);

module.exports = router;
```

### ✅ End of Phase 1 — Commit and Push to Dev

```bash
git add server/middleware/authMiddleware.js server/routes/officerRoutes.js
git commit -m "feat(officer): Phase 1 - JWT auth middleware and protected routes"
git push origin <your-branch-name>

# Go to GitHub → Open Pull Request to merge into 'dev'
# After it is merged, update your local branch:
git pull origin dev
```

---

## Phase 2 — Fix Controller Security Gap (Use Token, Not Body Data)

**Goal:** The backend currently trusts the `officerId` sent by the client. This is dangerous — anyone can pretend to be any officer. We must read the officer's identity from the verified JWT token instead.

**File to touch:** `server/controllers/officerController.js`

### What to change in `getMyQueue`

```javascript
// BEFORE (unsafe — trusts client input)
const officerId = Number(req.query.officerId) || 2;

// AFTER (safe — reads from verified token)
const officerId = req.user.id;
```

### What to change in `getOfficerStats`

```javascript
// BEFORE (unsafe)
const officerId = Number(req.query.officerId) || 2;

// AFTER (safe)
const officerId = req.user.id;
```

### What to change in `officerUpdateStatus`

```javascript
// BEFORE (unsafe — officerId is optional and comes from request body)
const { newStatus, fieldNotes, officerId } = req.body;
if (officerId) query.assignedOfficer = Number(officerId);

// AFTER (safe — officerId is mandatory and comes from the verified token)
const { newStatus, fieldNotes } = req.body;
const officerId = req.user.id;
query.assignedOfficer = officerId; // Always enforce this — no "if" needed
```

### ✅ End of Phase 2 — Commit and Push to Dev

```bash
git add server/controllers/officerController.js
git commit -m "fix(officer): Phase 2 - read officerId from JWT token, not request body"
git push origin <your-branch-name>

# Go to GitHub → Open Pull Request to merge into 'dev'
# After it is merged, update your local branch:
git pull origin dev
```

---

## Phase 3 — Status Transition Validation (Backend Rule Enforcement)

**Goal:** The backend currently allows any valid status to be set without checking if the step is logical. We must enforce the correct sequence: `REPORTED → UNDER_REVIEW → IN_PROGRESS → RESOLVED`.

**File to touch:** `server/controllers/officerController.js` — inside `officerUpdateStatus`

### What to add

Add this block **after** you find the issue from the database, **before** you update it:

```javascript
// Define the correct status steps
const ALLOWED_TRANSITIONS = {
  REPORTED:     ['UNDER_REVIEW'],
  UNDER_REVIEW: ['IN_PROGRESS'],
  IN_PROGRESS:  ['RESOLVED'],
  RESOLVED:     [],
};

// Check if the requested change is allowed
const currentStatus = issue.status;
const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

if (!allowedNextStatuses.includes(newStatus.toUpperCase())) {
  return res.status(400).json({
    success: false,
    message: `Cannot move from ${currentStatus} to ${newStatus}. Allowed next step: ${allowedNextStatuses.join(', ') || 'None (issue is resolved)'}`,
  });
}
```

Apply this same validation in **both** the MongoDB path and the memory-store fallback path.

### ✅ End of Phase 3 — Commit and Push to Dev

```bash
git add server/controllers/officerController.js
git commit -m "feat(officer): Phase 3 - backend status transition validation"
git push origin <your-branch-name>

# Go to GitHub → Open Pull Request to merge into 'dev'
# After it is merged, update your local branch:
git pull origin dev
```

---

## Phase 4 — Frontend Token Attachment + Final Cleanup

**Goal:** The frontend must send the JWT token with every API call. After that, clean up temporary code before the demo.

**Files to touch:**
- `client/src/services/officerService.ts`
- `client/src/pages/OfficerPage.tsx`

### Step 1 — Add JWT token to every API request

Add an Axios interceptor to `client/src/services/officerService.ts`, right after creating the `api` instance:

```typescript
// Add this block after: const api = axios.create({ ... });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gramafix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 2 — Remove officerId from frontend service calls

Once the backend reads `officerId` from the token, you no longer need to pass it from the client. Update the three functions in `officerService.ts`:

```typescript
// getOfficerStats — remove officerId parameter
export async function getOfficerStats(): Promise<OfficerStats> {
  const res = await api.get('/officer/stats');
  return res.data.data;
}

// getOfficerQueue — remove officerId parameter
export async function getOfficerQueue(
  filters?: { status?: string; search?: string }
): Promise<Issue[]> {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
  if (filters?.search) params.search = filters.search;
  const res = await api.get('/officer/queue', { params });
  return res.data.data;
}

// officerUpdateStatus — remove officerId from payload
export async function officerUpdateStatus(
  issueId: number,
  payload: { newStatus: IssueStatus; fieldNotes?: string }
): Promise<Issue> {
  const res = await api.put(`/officer/issues/${issueId}/status`, payload);
  return res.data.data;
}
```

### Step 3 — Update OfficerPage.tsx calls to match

In `OfficerPage.tsx`, remove the `officerId` argument from the three service calls:

```typescript
// BEFORE
const data = await getOfficerStats(officerId);
const data = await getOfficerQueue(officerId, { search, status });
const updated = await officerUpdateStatus(issueId, { ...payload, officerId });

// AFTER
const data = await getOfficerStats();
const data = await getOfficerQueue({ search: search || undefined, status: selectedStatus !== 'ALL' ? selectedStatus : undefined });
const updated = await officerUpdateStatus(issueId, payload);
```

Also remove the line `const officerId = currentUser.id || 2;` from the component — it is no longer needed.

### Step 4 — Final Cleanup
- Replace all `alert('...')` error messages with a proper error state in the UI (use the existing `setError()` pattern).
- Remove any `console.log()` lines used for debugging.

### ✅ End of Phase 4 — Commit and Push to Dev

```bash
git add client/src/services/officerService.ts client/src/pages/OfficerPage.tsx
git commit -m "feat(officer): Phase 4 - send JWT token from frontend, cleanup"
git push origin <your-branch-name>

# Go to GitHub → Open Pull Request to merge into 'dev'
# After it is merged, update your local branch:
git pull origin dev
```

---

## 📋 Final Checklist

```
[ ] Phase 1: Create authMiddleware.js and protect routes
[ ] Phase 2: Fix officerController.js to use req.user.id
[ ] Phase 3: Add status transition validation in officerController.js
[ ] Phase 4: Add JWT interceptor in officerService.ts
[ ] Phase 4: Remove officerId from frontend API calls
[ ] Phase 4: Replace alert() with setError() UI messages
[ ] Phase 4: Remove console.log() statements
```
