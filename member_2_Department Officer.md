# Member 2 - Department Officer Dashboard

## Purpose and ownership

Own the complete Department Officer experience: assigned work queue, officer statistics, issue inspection, field notes, and progress updates. Deliver the frontend, backend logic, data integration, validation, and verification for this role.

This guide records the team's revised three-role division: Member 1 = Citizen, Member 2 = Department Officer, Member 3 = System Administrator. It replaces the earlier responsibility allocation for planning purposes. Member 1 now owns the community feed and support features. This documentation does not change application behavior.

The current implementation uses React/TypeScript in `client/` and Express/Mongoose in `server/`. Extend those existing modules.

## Separate dashboard

- **Role value:** `OFFICER`.
- **Existing dashboard route:** `/officer`.
- **Existing page:** `client/src/pages/OfficerPage.tsx`.
- **Scope:** Issues assigned to the signed-in officer.

The business role is called Department Officer, while the existing application uses `OFFICER` and some Municipal Officer labels. Keep the code role value stable. The current user model has no department membership field; a department-wide queue or department administration would be additional scope. Use existing officer assignment for the baseline dashboard.

| Dashboard section | Responsibility |
| --- | --- |
| Officer summary | Total assigned, open, critical, in-progress, and resolved issue counts |
| Assigned issue queue | Assigned reports ordered by priority, with search and status filtering |
| Issue details | Description, category, location, severity, priority, and current status |
| Progress action | Move assigned reports through the agreed operational status sequence |
| Field notes | Record work performed or resolution information |
| Refresh/feedback | Reflect successful updates in both the queue and summary cards |

Use responsive tables/cards, clear status labels, and loading/error/empty states. An officer with no assigned work must see an empty state, not another officer's queue.

## Frontend responsibilities

- Maintain the officer dashboard, summary cards, filters, and assigned issue display.
- Maintain the officer status update modal and field-note input.
- Present only allowed next actions for the current issue status.
- Refresh the queue and statistics after successful updates.
- Coordinate the `/officer` navigation entry and login destination with Members 1 and 3.
- Keep assignment/reassignment controls in the System Administrator dashboard.

## Backend and data responsibilities

| Operation | Existing API | Member 2 responsibility |
| --- | --- | --- |
| Read statistics | `GET /api/officer/stats` | Calculate counts for the authenticated officer |
| Read assigned work | `GET /api/officer/queue` | Scope, search, filter, and sort assigned issues |
| Update progress | `PUT /api/officer/issues/:id/status` | Validate assignment, allowed transition, and field notes |
| Officer directory | `GET /api/officer/list` | Maintain the response consumed by Member 3's assignment UI; coordinate admin-only access |

The current service sends `officerId` in query/body data. Treat that as an existing interface, not proof of authorization. Verify the officer from the authenticated session on the server.

**CRUD contribution:** Primarily Read and Update of assigned issues, with field notes saved as part of updates. This role does not need report deletion. A separate create/delete work-log feature is optional additional scope, not an existing capability or a requirement to invent unnecessary CRUD.

## Files to work in

- `client/src/pages/OfficerPage.tsx`
- `client/src/services/officerService.ts`
- `server/controllers/officerController.js`
- `server/routes/officerRoutes.js`

Coordinate changes to `server/models/Issue.js`, `server/models/memoryStore.js`, shared types, shared status components, and authentication. Member 3 coordinates shared model/schema changes and owns the priority calculation. Member 2 supplies the officer-specific requirements.

## Workflow and permission requirements

Baseline operational sequence:

`REPORTED -> UNDER_REVIEW -> IN_PROGRESS -> RESOLVED`

- Member 3 assigns or reassigns the issue; assignment is separate from status.
- Member 2 implements the agreed officer transitions on both UI and server.
- Officers can update only issues currently assigned to them.
- Officers cannot reassign issues, edit citizen report content, change the priority formula, delete reports, or perform administrator moderation.
- `DUPLICATE` and `REJECTED` are administrator moderation outcomes.
- Validate permissions in both MongoDB and server memory-fallback paths.
- Preserve notes deliberately: the current backend writes officer `fieldNotes` into `adminNotes`. Coordinate a separate note/history design before promising an append-only timeline or private/public note separation.

These are implementation and verification requirements. Existing role labels and queue filtering do not establish that all permissions or transition rules are enforced.

## Handoffs

- **From Member 3:** Assignment uses existing `assignedOfficer` and `assignedOfficerName` fields. The officer directory response must remain compatible with the admin assignment UI.
- **To Member 1:** Updated status is visible when the citizen retrieves the same report.
- **To Member 3:** Officer progress updates affect global dashboard statistics and queue results.
- **On reassignment:** The issue leaves the previous officer's queue and appears in the new officer's queue after refresh.
- **Shared priority:** Display the existing score supplied by the application; request formula changes through Member 3.

## Completion checklist

- [ ] Officer login opens the separate `/officer` dashboard.
- [ ] Queue and statistics contain only that officer's assigned issues.
- [ ] Search/filtering works within the assignment scope.
- [ ] Valid progress changes and field notes save and refresh correctly.
- [ ] Invalid transitions and attempts to update another officer's issue are rejected.
- [ ] Omitting or changing a client-supplied officer ID cannot bypass assignment checks.
- [ ] Administrator reassignment updates both officers' queues.
- [ ] Citizen and administrator views show the saved status.
- [ ] Mobile layout and loading/error/empty states are checked.
- [ ] Commits and the demonstration identify Member 2's actual frontend and backend contributions.

## Safe implementation and demo

Make small changes to the existing officer modules in a feature branch based on `dev`; submit changes to `dev`. Preserve other dashboards and stored data. Agree on shared model or API changes before editing them, and keep any fallback behavior compatible with the same role rules.

Demo: sign in as an officer, show an issue assigned by the administrator, filter the queue, add field notes, and progress the issue to resolution. Show that another officer's issue is unavailable for editing.

Related guides: [Citizen](member_1_Citizen.md) and [System Administrator](member_3_System%20Administrator.md).
