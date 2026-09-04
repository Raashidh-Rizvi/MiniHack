# System Administrator Implementation Plan - Member 3

## Time-focused execution phases (IT24103352)

Implementation is organized into four checkpoints to respect the limited time:

1. **Foundation and access control** - original phases A/B: isolated startup, real sessions, role guards, and compatible API clients.
2. **Administrator workflow** - original phases C/D: transitions, assignment, moderation, private notes, scoring consistency, and recorded activity.
3. **Dashboard integration** - original phase E: existing UI completion, feedback, filters, responsive controls, and role navigation.
4. **Verification and handoff** - original phase F: focused backend tests, production build, browser checks, and a truthful execution record.

Branch `IT24103352` was created from `dev` for this work. Optional enhancements remain excluded.

## 1. Objective and instructions for the implementing AI

Complete and verify Member 3's System Administrator module in the existing GramaFix project. Extend the existing `/admin` dashboard, correct its integration gaps, and preserve the Citizen and Department Officer workflows.

**This is an executable implementation specification, not a request to rebuild the project.** When the user says to implement this file, implement the required phases below, verify the result, and report the actual outcome. Do not stop after producing another plan. Reuse completed work and implement only remaining changes. Optional enhancements in section 13 are excluded unless separately requested.

Reinspect the current checkout before acting: this audit describes a point in time. If a listed issue has already been corrected, verify it and skip that change. Do not undo newer work to reproduce this document's snapshot. Resolve routine implementation choices using the decisions below; ask only for a genuine missing credential, unresolved conflicting edit, or action requiring explicit authorization.

### Project context

| Item | Value |
| --- | --- |
| Product | GramaFix - community issue reporting and prioritization |
| Member 1 | Citizen dashboard, report CRUD, community feed, support |
| Member 2 | Department Officer dashboard and assigned-issue progress |
| Member 3 | System Administrator dashboard, triage, assignment, priority, moderation, shared access-control integration |
| Frontend | Existing React 18, TypeScript, Vite, Tailwind CSS, Axios |
| Backend | Existing Express 4, CommonJS, Mongoose/MongoDB |
| Alternate storage | Existing server in-memory store; separate browser-local citizen fallback |
| Role values | `CITIZEN`, `OFFICER`, `ADMIN`; retain legacy `RESIDENT` compatibility |
| Dashboard routes | Preserve `/admin` and `/officer`; citizen destination uses `/citizen` if implemented, otherwise `/my-reports` |
| Audit snapshot | 2026-09-04, branch `dev`, commit `b5552fb` |

Older `SPECIFICATION.md` and `TEAM_PLAN.md` describe a different stack or responsibility split. Follow the actual code and the user's revised three-role division. Do not migrate to Spring Boot/PostgreSQL or build another frontend.

## 2. Preservation rules

1. Begin with `git status --short`, current branch, applicable `AGENTS.md` instructions, and a targeted review of existing changes. The audit found an untracked `docs/` directory; it belongs to the user's workspace and must be preserved.
2. Add or adjust narrowly scoped modules. Preserve public routes, styling, existing IDs, API response envelopes, user records, and other members' work unless this plan explicitly requires a compatible adjustment.
3. Do not use destructive Git resets/cleans, delete project directories, clear browser storage wholesale, drop collections, or run a seed script against the user's database. Do not overwrite environment files or print credentials.
4. Keep dependencies and lockfiles unchanged unless a necessary dependency is deliberately added. Prefer existing packages and Node built-ins for the baseline plan.
5. Implement shared authentication and permission changes together with their client integration. Do not leave the other dashboards sending unauthenticated requests to newly protected endpoints.
6. Use a feature branch from `dev` when safe; follow current repository branch instructions, defaulting to a `codex/` prefix if none exists. Preserve dirty work and avoid forced branch switches. Do not commit directly to `main`.
7. This implementation request authorizes local implementation and verification. It does not by itself request deployment, pushing, merging, bulk database migration, or deleting real reports. Test mutations use disposable fixtures only.
8. Document any remaining environment-dependent check honestly. Never claim MongoDB verification based only on server-memory behavior.

## 3. Evidence-based current-state audit

**Meaning of labels:** Present = source implementation exists and should be reused; Adjust = a specific gap was observed; Missing = required behavior is absent from inspected source. Present does not mean runtime verified.

| Feature | State | Evidence and required action |
| --- | --- | --- |
| Separate admin page | Present / adjust | `client/src/pages/AdminPage.tsx` renders `AdminDashboard`; keep layout, update heading to System Administrator Dashboard, correct priority legend |
| Five KPI cards | Present / adjust | `AdminDashboard.tsx`, `MetricsCard.tsx`, `getAdminStats`; failures currently disappear and initial zero values can look like successful data |
| Global priority queue | Present / adjust | `getPriorityQueue`, `PriorityQueueTable.tsx`; search/status/priority exist; add category UI and reliable refresh after mutations |
| Status update modal | Present / adjust | `StatusUpdateModal.tsx`; preserve UI, reconcile server transitions, allow metadata-only saves |
| Duplicate/rejected moderation | Adjust | Client and controller allow `DUPLICATE`/`REJECTED`; `server/models/Issue.js` enum only permits four normal statuses |
| Status-transition validation | Missing on server | `adminController.updateIssueStatus` validates membership, not the transition from saved state |
| Assignment/reassignment | Present / adjust | Existing endpoint and selector trust client officer ID/name; officer existence/role is not checked |
| Initial routing | Present | `issueController.js` and `memoryStore.js` auto-assign categories to officer 2; preserve baseline routing, do not force manual assignment for every new report |
| Delete moderation | Present / adjust | Existing endpoint and inline Confirm/Cancel; add accessible pending/error handling and verify cancellation makes no request |
| Recalculate priority | Present backend/service; missing UI | Route and `adminService.recalculatePriority` exist but admin dashboard does not invoke it |
| Priority consistency | Adjust | Backend thresholds are 35/65/85; admin legend uses 25/50/75; frontend `utils/priority.ts` uses different scoring buckets from backend |
| Timeline | Present visual progression only | `StatusTimeline` accepts optional history, but admin modal supplies only current/selected status; no persisted event model exists |
| API authentication | Missing | `server/server.js` and admin/officer routes mount handlers without authentication middleware |
| Login token | Adjust | `authController.js` returns a formatted `gramafix_jwt_...` string; it is not a verified JWT/session |
| Role registration | Adjust | Public registration can request `ADMIN`, `SYSTEM_ADMIN`, or `OFFICER` |
| Password handling | Adjust | Existing server compares plaintext passwords; use compatible gradual upgrade rather than resetting existing accounts |
| Frontend session | Adjust | Default `demo_token`, local persona switching, and mock auth fallbacks can report authentication without server verification; logout does not clear token state |
| API client | Adjust | Shared client strips Axios status/response metadata; admin/officer services use separate clients without a shared token interceptor |
| Route guards / role redirect | Missing / adjust | `App.tsx` directly mounts privileged pages; login sends both officer/admin users to `/issues` |
| Citizen mutation bypass | Adjust, necessary shared boundary | Citizen edit/delete lack ownership enforcement; memory update spreads arbitrary body fields, allowing privileged fields through that alternate route |
| Officer mutation boundary | Adjust, necessary shared boundary | Officer identity comes from input; database assignment scope is optional and memory update is not scoped |
| Notes privacy | Adjust | Officer notes overwrite `adminNotes`; public issue responses serialize that field even though admin UI calls it internal |
| Responsive actions | Adjust | Table actions are hidden until hover; modal lacks a viewport-height scroll limit and full keyboard handling |
| Sorting | Adjust | Created-date descending comparator currently orders oldest first; fix direction while preserving priority tie behavior |
| Issue numeric IDs | Adjust | Mongo issue hook uses `101 + countDocuments()`; deleting a report can cause a later create to collide with an existing ID |
| Departments/user management | Out of baseline | No department membership model or full admin account-management UI; do not invent them as completed features |

### Verification performed while preparing this document

- Reviewed admin components/services/controllers/routes, authentication, models, server storage paths, priority calculators, and relevant Citizen/Officer integration points.
- `node client/node_modules/typescript/bin/tsc --noEmit --project client/tsconfig.json` completed successfully.
- No application server was launched, no database was contacted for runtime verification, and no report/account was modified during this audit.
- This document's creation changes documentation only. Runtime checks below are work for the implementing AI.

## 4. Final behavior and fixed scope decisions

### 4.1 Administrator journey

1. Sign in using a real server-validated administrator session.
2. Open `/admin` and see global counts plus a searchable/filterable priority queue.
3. Inspect full issue details, current assignment, notes, and saved administrative activity.
4. Assign/reassign to a valid officer, change an allowed status, adjust severity, or save an internal note.
5. Recalculate the selected report's priority when needed.
6. Mark an eligible issue duplicate/rejected or explicitly confirm deletion.
7. After success, show correct filtered/sorted rows and refreshed statistics. Show errors without discarding entered data or pretending the action succeeded.

### 4.2 Metrics and filtering contract

Preserve existing metric semantics: Total = all existing issues; Open = `REPORTED` + `UNDER_REVIEW`; In Progress = `IN_PROGRESS`; Resolved = `RESOLVED`; Critical = all issues whose saved priority is `CRITICAL`. Label Critical clearly as including closed reports. These cards overlap and are not expected to sum to Total.

Global cards remain independent of queue filters. Filters support search, category, priority, and all six statuses. Keep the existing query names. Treat search as literal case-insensitive text, including regex punctuation, and cap it at 100 characters. Default ranking is score descending, then oldest creation time first, then stable issue ID order. Default queue includes all statuses as it does now; optional active-only behavior is excluded.

### 4.3 Status rules

Use the existing admin modal's transition choices as the baseline server policy:

| Current status | Administrator allowed next status | Assigned officer allowed next status |
| --- | --- | --- |
| `REPORTED` | `UNDER_REVIEW`, `DUPLICATE`, `REJECTED` | `UNDER_REVIEW` |
| `UNDER_REVIEW` | `IN_PROGRESS`, `REPORTED`, `DUPLICATE`, `REJECTED` | `IN_PROGRESS` |
| `IN_PROGRESS` | `RESOLVED`, `UNDER_REVIEW` | `RESOLVED` |
| `RESOLVED` | None | None |
| `DUPLICATE` | None | None |
| `REJECTED` | None | None |

- No new reopening feature. Same-status requests may save changed notes/severity without manufacturing a status event.
- Allow administrator note/severity updates without `newStatus`; reject an empty update. On terminal records, allow internal notes only; no reassignment, severity changes, or manual recalculation.
- Require a nonempty note for rejection, duplicate moderation, backward transitions, and severity changes. Notes are strings of at most 500 characters. An empty string explicitly clears a note where a reason is not required; omitted means unchanged.
- Validate against the record's saved state. Return `409` for an invalid transition or conflicting concurrent edit; no partial save on failure.
- Citizen editing/cancellation remains restricted to the author and nonterminal records. Block all three terminal statuses, preserving existing nonterminal behavior instead of introducing a new early-stage-only restriction.

### 4.4 Authentication baseline

Implement one server-owned session mechanism with the existing stack. Default design: cryptographically random opaque bearer tokens generated using Node `crypto`, stored server-side by token digest with user ID, storage-mode identity, creation time, and an eight-hour expiry. Do not parse user identity/role from a token string supplied by the browser. Load the current user and role from the selected storage backend on each authenticated request.

For this single-process MVP, the session registry can be memory-resident; document that server restart expires sessions and multi-instance deployment needs a shared session store. Add `GET /api/auth/me` and `POST /api/auth/logout`. Expired/unknown/fabricated tokens receive `401`; verified users with the wrong role receive `403`.

Use salted password hashing with Node `crypto.scrypt`, constant-time verification, and an identifiable stored hash format. New accounts use hashes. Upgrade legacy plaintext credentials only after successful credential verification; preserve IDs/roles and do not reset passwords. Missing passwords must not authenticate. Exclude password/hash/token material from every user response and log.

Public registration creates citizens only. Reject requests for privileged roles with a clear error; existing officer/admin accounts can still log in. Do not silently convert a requested officer/admin account and report successful privileged registration.

Keep demo behavior explicit: existing known demo users may authenticate through the same server login in server-memory demo mode. Remove unrestricted client role escalation and invalid-login mock success. Any retained persona shortcuts must be explicitly enabled for local demonstration and obtain a server-validated session; hidden client configuration alone never grants server privileges. In MongoDB mode, do not publicly create default administrators on a GET request. If no valid admin exists, provide an explicit, non-destructive local provisioning command using environment-supplied credentials; do not execute it against the user's database automatically.

### 4.5 Data and priority baseline

- Server API records are authoritative for the shared three-dashboard workflow. Preserve browser-local citizen demos as clearly separate, unauthenticated demonstrations; never replay local privileged writes automatically.
- Select and initialize server storage before listening. Preserve graceful memory startup fallback. Add an explicit test/development memory selection so tests cannot accidentally contact the configured database. Do not change backend storage underneath active sessions or silently report a failed Mongo write as a successful memory write.
- Preserve the backend scoring formula and bucket definitions in `server/utils/priorityCalculator.js`; align client preview and admin legend with it. Severity/urgency points: 25/50/75/100. Impact points: 1-10 = 20; 11-50 = 45; 51-150 = 70; 151-300 = 85; above 300 = 100. Age points: up to 6 hours = 15; over 6 = 30; over 24 = 50; over 48 = 70; over 72 = 90. Urgency defaults to severity.
- Use one creation timestamp for create and initial calculation in both storage paths. Pass it into scoring to remove the current missing-date default discrepancy. Add an optional clock argument where useful for deterministic tests; maintain existing call compatibility.
- Weighted score is rounded and clamped to 0-100. Levels: 0-34 LOW, 35-64 MEDIUM, 65-84 HIGH, 85-100 CRITICAL. Frontend preview is an estimate; display server scores for saved reports.
- Recalculate on creation, severity/impact edits, and explicit admin recalculation. Do not introduce background jobs or mutate every issue on read. Seeded/historical scores may remain until deliberately recalculated; do not bulk rewrite them during implementation.

## 5. File ownership and allowed integration changes

| Area | Files / proposed additions | Scope |
| --- | --- | --- |
| Admin UI | `client/src/pages/AdminPage.tsx`, `client/src/components/admin/*` | Primary Member 3 work; reuse existing components |
| Admin API | `client/src/services/adminService.ts`, `server/routes/adminRoutes.js`, `server/controllers/adminController.js` | Primary Member 3 work |
| Priority | `server/utils/priorityCalculator.js`, `client/src/utils/priority.ts` | Align formula/display and verify parity; preserve styling helpers |
| Role/session integration | `server/controllers/authController.js`, `server/routes/authRoutes.js`, new auth/session/password helpers | Required shared boundary |
| Client session | `client/src/services/api.ts`, `authService.ts`, `hooks/useAuth.tsx`, new `components/auth/RequireRole.tsx` | Shared client, session restore, error handling, guards |
| Navigation | `App.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, layout navigation | Only role links, registration constraints, and redirect compatibility; no redesign |
| Officer compatibility | `officerService.ts`, `OfficerPage.tsx`, officer controller/routes | Attach session, derive officer identity, enforce assignment/status rules, preserve notes |
| Citizen compatibility | Citizen service/controller/routes/validator and relevant edit controls | Ownership, field allowlist, terminal-state protection, auth-error behavior, private-field filtering |
| Shared data | `server/models/Issue.js`, `User.js`, `memoryStore.js`, `client/src/types/issue.ts` | Additive schema/serialization changes; preserve field names and IDs |
| Startup/tests | `server/server.js`, `server/config/db.js`, new test helpers, server package scripts | Storage selection, app testability, focused tests |

Prefer focused helpers for policy, validation, serialization, and sessions to duplicating rules. These are suggested locations, not an instruction to create unused scaffolding. Check imports before changing duplicated form/modal component names.

## 6. API contracts

Preserve `{ success, data, message? }` and list `count` envelopes. Failures use `{ success: false, message, errors? }`. Validate types before `.toUpperCase()`, numeric conversion, or regex use. `400` = malformed input; `401` = no valid session; `403` = wrong role/ownership; `404` = missing record; `409` = invalid transition or concurrent edit.

| Endpoint | Access | Required behavior |
| --- | --- | --- |
| `POST /api/auth/login` | Public | Verify credentials; return safe user data and issued opaque token |
| `POST /api/auth/register` | Public | Citizen registration only; preserve normal success envelope |
| `GET /api/auth/me` (new) | Authenticated | Restore validated user and role after refresh |
| `POST /api/auth/logout` (new) | Authenticated | Revoke current token; client clears its state even if request fails |
| `GET /api/admin/stats` | Admin | Existing five counts |
| `GET /api/admin/queue` | Admin | `search`, `category`, `status`, `priorityLevel`; filters combine |
| `PUT /api/admin/issues/:id/status` | Admin | Optional `newStatus`, `adminNotes`, `adjustedSeverity`; enforce section 4.3 |
| `PUT /api/admin/issues/:id/assign` | Admin | `officerId` required; accept legacy `officerName` but ignore it and derive stored name |
| `PATCH /api/admin/issues/:id/priority` | Admin | Recalculate active issue; preserve `{ priorityScore, priorityLevel }` response |
| `DELETE /api/admin/issues/:id` | Admin | Existing single-record deletion, only following explicit UI confirmation |
| `GET /api/admin/issues/:id/history` (new) | Admin | Return actual saved administrative activity, empty for legacy records without history |
| `GET /api/officer/list` | Admin | Safe officer directory using compatible numeric public IDs |
| `GET /api/officer/queue`, `/stats` | Officer | Derive identity from session; client IDs cannot broaden scope |
| `PUT /api/officer/issues/:id/status` | Assigned officer | Derive identity from session; enforce transitions; save `fieldNotes` separately |
| Citizen create/own-read/edit/delete | Citizen/legacy Resident | Derive author from session; validate ownership and permitted fields |
| Public issue list/details | Public | Preserve routes; exclude internal notes and administrative history |

Normalize valid existing numeric public IDs and existing ObjectId lookup support without changing stored identifiers. Reject malformed IDs clearly. For assignment, use the canonical officer numeric ID because existing assignment fields are numeric; never coerce an ObjectId string with `Number()`.

For mutable admin requests, add optional `expectedUpdatedAt` and have the admin UI send it for status, assignment, recalculation, and deletion. Compare atomically with the saved version/timestamp and return `409` when stale. Continue accepting legacy callers that omit it, while always enforcing the saved status and permissions. Reuse any equivalent versioning already introduced by other work instead of adding a second system.

## 7. Required implementation phases

### Phase A - Baseline and test isolation

- [x] Reinspect current code and mark audit items already resolved. Record the starting diff without reverting anything.
- [x] Run the existing type check/build before changes and distinguish baseline failures from introduced failures.
- [x] Make Express app construction importable without starting a listener or connecting to a database. Preserve the normal `server.js` start command.
- [x] Provide explicit isolated server-memory mode for tests and opt-in disposable Mongo test configuration. Do not use the user's `.env` database for tests.
- [x] Retain existing design tokens and route structure. Do not add unrelated dependencies or new dashboards.

### Phase B - Sessions and role boundaries

- [x] Implement section 4.4's server-issued sessions, expiration, lookup, revocation, safe user serialization, and compatible password upgrade.
- [x] Add auth/role middleware; protect all admin routes and the officer directory. Apply the compatible Citizen/Officer ownership policies so those routes cannot bypass admin restrictions.
- [x] Public citizen edits must use an explicit allowlist: `title`, `description`, `location`, `severity`, `peopleAffected`. Never spread `req.body` into stored records. Protect `status`, assignment, score, author, private notes, and history in both storage paths.
- [x] Limit public registration to citizens and stop public demo-user reads from provisioning privileged accounts. Keep any necessary provisioning explicit and additive.
- [x] Use the shared Axios client for admin/officer requests; preserve `VITE_API_URL` and the existing `/api` proxy fallback. Add bearer authorization at request time using the active session token.
- [x] Preserve HTTP status/body metadata in rejected client errors. Do not replace an Axios error with a plain Error that destroys the distinction between network failure and `401`/`403`/validation failure.
- [x] Remove fake default tokens. Restore sessions through `/auth/me` with a loading state before protected pages fetch data. Clear token state and only relevant auth storage keys on logout/expiry.
- [x] Correct redirects: ADMIN -> `/admin`, OFFICER -> `/officer`, citizen -> existing citizen home. An unauthorized role must not briefly render/fetch privileged data. Preserve public browsing.
- [x] On network failure, do not fabricate privileged login or successful mutations. Citizen local-demo fallback must not swallow authentication, authorization, conflict, or validation errors.

Phase B exit: unauthenticated and wrong-role admin requests fail; each existing role can still complete its legitimate login/navigation/API flow.

### Phase C - Data correctness, transitions, and assignment

- [x] Add `DUPLICATE` and `REJECTED` to the Mongoose status enum, preserving old documents and defaults. Reuse all six status labels in relevant admin filters/badges.
- [x] Centralize the transition policy and enforce section 4.3 before modifying records. Validate all optional field types, enum values, positive finite IDs, and note length/reason requirements in both storage paths.
- [x] Support note/severity-only updates, explicit note clearing, and clear validation errors. Do not force an unrelated status change just to save a note.
- [x] Resolve assignment targets from stored users and require role `OFFICER`. Derive display names server-side; reject nonexistent/non-officer targets. Preserve existing initial auto-assignment behavior.
- [x] Ensure stale assignments no longer authorize the previous officer to update the report. Match assigned officer and expected saved status/version in the database write condition; mirror the check in memory.
- [x] Keep `adminNotes` internal. Add optional `fieldNotes` for officer progress, preserving existing legacy `adminNotes` values without guessing their original author. Redact internal fields from public/citizen responses and return field notes only through the appropriate role serializers.
- [x] Make deletion/recreation safe for numeric IDs. Replace count-based issue ID generation with a non-reusing allocation strategy, initialized from the current maximum without renumbering records. Prefer an atomic counter with duplicate-conflict handling; preserve explicitly assigned existing IDs. Do not bulk migrate/delete reports.
- [x] Add expected-version handling from section 6 for conflicting administrator actions. Failed validation, conflicts, or storage errors must not partially update notes/assignment/status.

Phase C exit: moderation works in MongoDB and memory, valid assignment changes the correct queue, and alternate routes cannot modify privileged fields.

### Phase D - Priority consistency and actual activity history

- [x] Keep backend scoring authoritative and align `client/src/utils/priority.ts` with section 4.5. Preserve its badge helper exports. Replace browser fallback's hardcoded score where it intersects this calculator.
- [x] Use consistent timestamps on new reports and deterministic boundary tests. Update the admin legend to the correct score thresholds and explain that impact/age are normalized points, not raw headcount/hours.
- [x] Wire the existing manual recalculation service into admin UI for active reports, with pending/error feedback and refresh.
- [x] Add an optional embedded `adminHistory` array to Issue with default `[]`, and equivalent memory support. Each event includes an event ID, event type, server timestamp, authenticated actor ID/name/role, and relevant before/after values and note.
- [x] Record successful admin status changes, assignments, severity changes, note edits, and manual priority recalculations. A combined status/severity/note request may create one event containing all changes. Do not record an event for rejected/failed/no-change operations.
- [x] Save the event and associated issue mutation atomically in the same record update. Expose history only through the protected history endpoint; exclude it from public issue responses.
- [x] Render actual saved events in the admin detail view. Keep lifecycle progression visually distinct from recorded activity. Legacy records show 'No recorded activity yet'; never invent historical actors or timestamps.
- [x] For duplicate/rejected reports, display the terminal outcome without implying the report reached Resolved. Retain optional props/defaults for shared timeline consumers.

History scope is deliberately bounded: it covers new administrator actions on an existing report. Existing deletion remains hard deletion and removes embedded history with the issue. Do not claim an immutable audit archive or historical completeness; soft deletion and a durable deletion audit are optional future work.

### Phase E - Finish the existing administrator dashboard

- [x] Rename the admin page heading to System Administrator Dashboard without rebuilding its layout/theme.
- [x] Show full issue description, category, location, reporter display name, timestamps, current severity/priority, and assignment in the detail modal. Avoid exposing unnecessary account data.
- [x] Add category filtering and duplicate/rejected status options. Prefer reusing known category constants/components; a new category-management backend is unnecessary.
- [x] Distinguish statistics, queue, officer-directory, and history loading/error/empty states. A failed metrics request displays unavailable/stale data with retry, not a fresh zero count. An empty officer directory differs from a failed fetch.
- [x] Prevent outdated search responses from overwriting newer results using cancellation or a request sequence. Preserve filters when retrying or refreshing.
- [x] After mutation, refetch queue and global stats under current filters. A report moved out of a selected status filter disappears; priority changes reorder correctly. Refresh selected issue/history without discarding unrelated unsaved form input.
- [x] Correct date sort direction. Default score ties stay oldest-first; ascending/descending controls behave consistently and expose keyboard-accessible sort state.
- [x] Return proper Promises from async modal callbacks. Assignment failures must propagate and keep the selector/error visible; the current parent catch must not make a failed call look resolved.
- [x] Use separate pending states for status, assignment, recalculation, and deletion; prevent duplicate submissions and incompatible simultaneous actions on the same record. Hide/disable quick-advance for terminal states.
- [x] Preserve destructive-action confirmation, identify the report being removed, and show per-action errors. Cancel sends no delete. Successful deletion removes only that report.
- [x] Make row actions visible on touch and keyboard focus, not only hover. Add meaningful labels to icon buttons, focused dialog heading, Escape behavior, focus containment/return, and `aria-live` action feedback.
- [x] Constrain modal height to the viewport with scrollable content. At mobile widths, keep essential details and assignment reachable through the detail view; no clipped buttons or page-wide overflow.

Phase E exit: the existing admin dashboard supports the full section 4.1 journey with truthful success/error feedback.

### Phase F - Integration verification and handoff

- [ ] Complete every environment-dependent check in section 8. Local tests pass; actual MongoDB runtime verification remains pending.
- [x] Run production client build and targeted server checks. Inspect the final diff for unrelated edits, generated files, secrets, or accidental lockfile changes.
- [x] Update this document's execution checklist with evidence, marking only verified work complete. Summarize files changed and remaining limitations.
- [x] Add concise Member 3 contribution/run/test details to the relevant existing documentation without overwriting other members' content or inventing team names/results.
- [x] Stop when required behavior is implemented and sufficiently verified. Do not start optional features, deploy, push, or merge as an automatic final step.

## 8. Verification matrix

Use Node's built-in test runner for focused backend/policy tests where practical. Add a `server` test script if absent. Use the existing browser tooling for integration and visual checks; add a test dependency only when necessary. Do not create tests that merely duplicate implementation or assert source text.

| Check | Expected evidence |
| --- | --- |
| Authentication | Missing, fabricated, expired, and revoked tokens return 401; valid admin session succeeds |
| Role isolation | Citizen/officer cannot access any admin operation or officer directory, including direct HTTP calls |
| Registration | Public ADMIN/OFFICER/SYSTEM_ADMIN requests fail; valid citizen registration/login still works |
| Invalid credentials | Wrong password is rejected even for known demo email; client does not fall back to success |
| Existing accounts | Correct legacy password works and upgrades its stored hash without changing user identity/role |
| Logout/refresh | Logout revokes token and clears client token state; browser refresh revalidates session; no protected-data flash |
| Stats | Controlled fixtures produce exact existing five counts, including terminal high-priority records |
| Query/filtering | Combined category/status/priority/search filters work in both storage modes; punctuation is literal; stale results do not replace latest search |
| Transitions | Every permitted transition succeeds; invalid/backward officer/terminal transitions fail without mutation |
| Moderation persistence | DUPLICATE and REJECTED save and read correctly using actual Mongoose persistence in a disposable database |
| Input validation | Null/object/array status/severity/ID, excessive notes, and invalid enums return clear 400 responses rather than 500 |
| Assignment | Valid officer accepted; nonexistent/citizen target rejected; submitted false officer name ignored |
| Officer scope | Reassignment removes access from previous officer; forged/omitted officer ID never broadens queue or update access |
| Citizen bypass | Another author's edit/delete is denied; arbitrary status/assignment/adminNotes/history fields cannot be mass-assigned |
| Terminal citizen records | Citizen cannot edit/cancel RESOLVED, DUPLICATE, or REJECTED in either storage path |
| Private fields | Public and citizen JSON excludes adminNotes/adminHistory; officer notes do not overwrite existing internal notes |
| Concurrent edits | A stale expectedUpdatedAt or status/assignment race returns 409; no partial mutation/history event |
| Priority | Boundary cases at population 10/11, 50/51, 150/151, 300/301 and age 6/24/48/72 hours; frontend/backend agree at fixed clock |
| Priority levels | Check score boundaries 34/35, 64/65, 84/85 and weighted output examples; create/recalculate use consistent dates |
| History | Successful changes append accurate actor/before/after events; failed/no-change updates append nothing; old data remains readable |
| Deletion | Cancel sends no request; confirmed delete removes only fixture; repeated deletion returns 404; create after delete does not collide on ID |
| UI mutations | After a filtered status change the row leaves the filter, stats refresh, errors retain input, and double clicks do not double-submit |
| UI layout | Check approximately 375px, 768px, and 1440px widths, light/dark theme, keyboard focus, modal scrolling, and touch-visible actions |
| Regression | Citizen report creation/read/edit, public feed/details/support UI, officer queue/status, navigation, and auth still work |
| Storage failure | DB failure is a clear error; it does not secretly create a different copy in memory/localStorage |

### Commands and environment handling

Baseline available commands from the repository root:

```powershell
node client/node_modules/typescript/bin/tsc --noEmit --project client/tsconfig.json
npm run build
```

After adding focused server tests, expose and run:

```powershell
npm --prefix server test
```

Start the existing app using `npm run dev` only after confirming that starting its backend cannot accidentally use the user's live database for test mutations. For tests, use an explicit memory mode and an available port rather than killing unrelated processes. Mongo verification must use an explicitly configured disposable database; do not drop or reseed the development database. Importing the app in tests must not start a second listener.

If MongoDB or browser access is unavailable, finish all implementation and available checks, then list the exact unexecuted checks. A mocked model or memory store is not proof of MongoDB persistence. Do not mark full verification complete in that case.

## 9. End-to-end demonstration

Use fixture accounts: one citizen, two officers, and one administrator in isolated test storage. Add fixture accounts through a test-only setup, not public privileged registration or changes to real accounts.

1. Citizen submits a report; note its returned ID.
2. Administrator logs in and lands on `/admin`, finds that report, and sees its current priority/initial assignment.
3. Administrator reviews it, saves an internal note, and reassigns it to the second officer.
4. Original officer refreshes: the report is absent. Assigned officer refreshes: it is present and can progress through permitted states.
5. Citizen and administrator refresh: both show the same saved status; citizen cannot see the internal note/history.
6. On a separate active fixture, administrator adjusts severity with a reason and recalculates; queue/order/cards remain correct.
7. On separate fixtures, demonstrate duplicate/rejected moderation, deletion cancellation, and confirmed deletion.
8. Show recorded administrator activity and one denied cross-role API attempt.

Do not conduct destructive demonstrations on real user reports.

## 10. Definition of done

- [x] Existing `/admin` is a working separate System Administrator dashboard.
- [x] Existing completed features are retained; observed admin gaps are corrected.
- [x] Server-authenticated role access works and alternate Citizen/Officer routes cannot bypass it.
- [x] Statistics, filters, assignment, triage, severity, recalculation, moderation, and recorded admin activity work end to end.
- [ ] Verify actual MongoDB persistence against the shared policy/data contracts. Code and opt-in test exist; no disposable Mongo database was supplied.
- [x] Existing records/IDs remain intact and additive fields tolerate legacy documents.
- [x] Citizen and Officer API workflow/ownership checks pass. Existing browser-local community support was not rewritten or exhaustively retested.
- [x] Client type check/build and focused tests pass; runtime/visual evidence or exact limitations are recorded.
- [x] Final diff contains only justified changes and no secrets, resets, or unrelated removals.
- [x] Completion report distinguishes implemented, verified, and environment-blocked work.

## 11. Implementation report template

The implementing AI should finish with a concise report covering:

1. Admin behavior completed and existing behavior preserved.
2. Main files changed, including why any Member 1/2 shared files were touched.
3. Verification commands/results and storage modes actually exercised.
4. Remaining limitations: for example, memory sessions expire on restart, memory reports are not durable, or a Mongo/browser check was unavailable.
5. Local run/demo instructions and any explicit environment configuration required. Never include real passwords/tokens in the report.

## 12. Execution record

**Implemented on branch IT24103352.** Local verification is complete as described below; actual MongoDB runtime verification remains pending. Checked implementation items mean the code is present and locally checked, not that every storage environment was exercised.

| Phase | Status | Evidence to fill during implementation |
| --- | --- | --- |
| A - Baseline and isolation | Complete | Baseline build passed; importable createApp; memory tests and opt-in dedicated Mongo test |
| B - Sessions and boundaries | Complete locally | Session, registration, role and ownership tests; browser login/logout/refresh verified |
| C - Data and workflow | Implemented; Mongo runtime pending | Memory assignment/conflict/moderation/privacy tests and Mongoose enum validation pass |
| D - Priority and activity | Complete locally | 324 preview/backend comparisons; history/privacy tests; browser recorded activity confirmed |
| E - Dashboard completion | Complete locally | Note-only save, filtered status advance, history, role denial, Escape/focus return, 375/768/1440px and theme checks |
| F - Integration and handoff | Local checks complete | Production build passes; 8 tests pass, 1 opt-in Mongo test skipped; diff check and README updated |

## 13. Optional future work - do not implement automatically

- Full user-management or account suspension dashboard.
- Department CRUD, department membership, department-wide queues, or geographic routing.
- Analytics charts, exports, notifications, maps, uploads, AI features, and background priority jobs.
- Soft deletion/restoration, reopening workflows, immutable audit archives, or long-term session storage.
- New Citizen/Officer dashboards, unrelated visual redesigns, or wholesale authentication infrastructure replacement.
- Deployment or production database operations.

These are not required to complete this plan and must not delay the required Administrator workflow.

## 14. One instruction to start implementation

> Implement `System_Admin_implementation_plan.md` completely for Member 3. Recheck the current project, preserve completed work and existing data, implement all required phases, skip optional enhancements, verify the Citizen and Officer integrations, and update the execution record with actual results. Do not rebuild the project or stop after writing another plan.

Related responsibility guide: [Member 3 - System Administrator](member_3_System%20Administrator.md).

## Implementation verification evidence (2026-09-04)

- Branch: `IT24103352`, created from `dev`. Contribution commits group the implementation into 15 meaningful parts: backend helpers, data models, authentication, shared issue policy, administrator API, citizen permissions, officer permissions, server startup, client authentication, API integration, priority display, report details, dashboard controls, navigation, and tests/documentation. No merge or deployment is included.
- Baseline and final `npm run build`: passed (TypeScript and Vite production build).
- Final `npm --prefix server test`: **8 passed, 0 failed, 1 skipped**. Mongo testing requires explicit `RUN_MONGO_TESTS=true` and `MONGO_TEST_URI` for a database named `gramafix_test` or `gramafix_test_<suffix>`.
- `git diff --check`: passed. Environment files, dependency lockfiles, and existing untracked `docs/` content were not modified.
- Browser checks used an isolated memory API on port 5055 and a separate preview on 5175. Verified admin sign-in redirect, note-only saving and history, filtered-row removal after status advance, session restoration, role denial, logout denial, Escape/focus return, mobile/tablet/desktop rendering, and light/dark themes. Corrected heading contrast and tablet navigation crowding found during checks.
- Citizen -> Admin assignment -> assigned Officer resolution -> Citizen readback was verified through HTTP tests using disposable accounts/reports. The user's database was not contacted for these checks.
- Shared files changed for role/session integration, ownership/private-field enforcement, scoring parity, additive fields, and navigation compatibility. Initial automatic officer routing remains in place.
- Remaining verification limits: actual MongoDB persistence and atomic counter behavior require the opt-in test; exhaustive browser testing of every non-admin feature and every failure/race was not performed. Memory tests and schema validation are not MongoDB runtime proof.
- Operational limits: sessions and memory reports expire on server restart; embedded history is removed with a hard-deleted issue; existing browser-local support/fallback behavior is separate from authoritative server records. No new department system, account-management dashboard, immutable audit archive, or deployment was added.
