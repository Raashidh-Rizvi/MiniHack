# Member 3 - System Administrator Dashboard

## Purpose and ownership

Own the complete System Administrator experience: system-wide issue visibility, triage, officer assignment, priority scoring, moderation, and cross-role access-control coordination. Deliver the frontend, backend logic, data integration, validation, and verification for this role.

This guide records the team's revised three-role division: Member 1 = Citizen, Member 2 = Department Officer, Member 3 = System Administrator. It replaces the earlier responsibility allocation for planning purposes. Older specifications may still describe two roles; this guide follows the team's new decision. This documentation does not change application behavior.

Use the existing React/TypeScript frontend and Express/Mongoose backend. The role title does not require replacing the application or introducing unrelated infrastructure administration.

## Separate dashboard

- **Role value:** `ADMIN`.
- **Existing dashboard route:** `/admin`.
- **Existing page:** `client/src/pages/AdminPage.tsx`.
- **Scope:** All community issues and the overall operational workflow.

| Dashboard section | Responsibility |
| --- | --- |
| System overview | Total, open, critical, in-progress, and resolved issue counts |
| Priority queue | Global issue list with search, category/status/priority filters, and ranking |
| Triage | Review reports and apply appropriate administrative decisions |
| Officer assignment | Assign/reassign issues using the existing officer directory |
| Priority controls | Maintain deterministic scoring and supported severity adjustments |
| Moderation | Mark duplicate/rejected reports or remove inappropriate reports with confirmation |

Use responsive tables/cards and clear loading/error/empty states. Keep the administrator's global overview distinct from the officer's personal assigned queue.

## Frontend responsibilities

- Maintain the admin dashboard, metrics, priority queue, and issue action modal.
- Maintain officer selection and assignment/reassignment feedback.
- Maintain administrative status changes, notes, severity adjustment, and moderation controls.
- Coordinate role-aware navigation, route guards, and login destinations with Members 1 and 2.
- Clearly distinguish global statistics from an individual officer's workload.

## Backend and data responsibilities

| Operation | Existing API | Member 3 responsibility |
| --- | --- | --- |
| Read global statistics | `GET /api/admin/stats` | Correct system-wide counts |
| Read priority queue | `GET /api/admin/queue` | Ranking, filters, and search |
| Update triage/status | `PUT /api/admin/issues/:id/status` | Validate status, notes, and supported severity adjustments |
| Assign/reassign | `PUT /api/admin/issues/:id/assign` | Verify the target officer and save the assignment |
| Recalculate priority | `PATCH /api/admin/issues/:id/priority` | Apply the shared deterministic scoring logic |
| Moderate/delete | `DELETE /api/admin/issues/:id` | Administrator-only removal with clear UI confirmation |

Member 2 owns the implementation of `GET /api/officer/list`; Member 3 consumes it and coordinates its administrator-only access policy.

**CRUD contribution:** Read global data, Update assignment/status/priority, and Delete through moderation. Creating officer accounts or departments is optional additional scope, not a claimed existing admin dashboard capability.

## Files to work in

Existing primary files:

- `client/src/pages/AdminPage.tsx`
- `client/src/components/admin/`
- `client/src/services/adminService.ts`
- `server/controllers/adminController.js`
- `server/routes/adminRoutes.js`
- `server/utils/priorityCalculator.js`

Shared integration files coordinated by Member 3, with input from affected members:

- `client/src/App.tsx`, `client/src/hooks/useAuth.tsx`, and `client/src/types/issue.ts`
- `client/src/services/authService.ts`
- `server/controllers/authController.js` and `server/routes/authRoutes.js`
- `server/models/User.js`, `Issue.js`, `Category.js`, and `memoryStore.js`
- `server/config/db.js`, `server/server.js`, and `server/seedDatabase.js`

Coordination ownership means agreeing on and integrating shared changes; it does not transfer every member's backend implementation to Member 3. Members 1 and 2 remain responsible for their own endpoint permissions and validation.

## Permission and workflow requirements

- Implement and verify administrator access on the server as well as the frontend.
- Coordinate authenticated identity handling across all three roles. Client role values, route visibility, and supplied IDs alone are insufficient authorization.
- Prevent ordinary public registration from granting officer or administrator privileges. Agree on controlled provisioning or explicitly labelled demo accounts.
- Preserve existing `CITIZEN`, `OFFICER`, and `ADMIN` values and legacy `RESIDENT` compatibility while integrating the revised dashboards.
- Validate assignments against actual officer records; use the officer's stored name rather than trusting an arbitrary submitted name.
- Keep normal progress aligned with `REPORTED -> UNDER_REVIEW -> IN_PROGRESS -> RESOLVED`. Agree on any administrator override/reopening rules and validate them server-side.
- Reserve `DUPLICATE` and `REJECTED` for administrator moderation.
- Treat durable audit history and private/public note separation as planned additions if required; existing note fields alone do not establish either capability.

These are acceptance requirements, not a statement that existing access controls are complete.

## Scope boundaries and handoffs

- **Member 1:** Owns the citizen dashboard, report CRUD, public feed, and support experience. Member 3 provides shared role-policy and priority integration support.
- **Member 2:** Owns the officer dashboard, assigned work, and progress updates. Member 3 supplies assignment actions and the shared priority calculation.
- **Department management:** The current user model has no department membership field. Keep officer assignment as the baseline. Department CRUD, department routing, and department-wide permissions require an agreed model/API extension.
- **Account management:** A full user-management panel is optional additional scope. Do not claim that it already exists or add it at the expense of the three working dashboards.
- **Integration:** Use the same issue records across all dashboards. Verify the connected API path end to end; browser-local citizen storage and server memory fallback are separate stores and must not be presented as automatically synchronized.

## Completion checklist

- [ ] Administrator login opens the separate `/admin` dashboard.
- [ ] Global statistics and priority queue reflect the same saved records.
- [ ] Assignment/reassignment accepts valid officers and rejects invalid targets.
- [ ] An assigned report appears in the correct officer's queue.
- [ ] Officer updates appear in citizen and administrator views.
- [ ] Priority calculations remain consistent across report creation and later updates.
- [ ] Status changes and moderation validate requests and refresh the UI.
- [ ] Citizen/officer requests to admin operations are rejected by the backend.
- [ ] Mobile layout and loading/error/empty states are checked.
- [ ] All members demonstrate their own frontend and backend contributions.

## Safe implementation and demo

Integrate small feature changes through `dev`, preserving existing routes, records, and other members' work. Do not replace the stack, rewrite unrelated modules, or reset/reseed data as part of this responsibility division. Coordinate shared-file edits before merging. Deployment remains a separate execution task.

Demo: show a newly submitted issue in the global queue, review its priority, assign an officer, then show the officer's progress reflected in system statistics and the citizen's report.

Related guides: [Citizen](member_1_Citizen.md) and [Department Officer](member_2_Department%20Officer.md).
