# Member 1 - Citizen Dashboard

## Purpose and ownership

Own the complete citizen experience in GramaFix: dashboard, reporting, personal report management, community discovery, and support/upvoting. Deliver the frontend, backend logic, data integration, validation, and verification for this role.

This guide records the team's revised three-role division: Member 1 = Citizen, Member 2 = Department Officer, Member 3 = System Administrator. It replaces the earlier responsibility allocation for planning purposes. Older documents and code comments may still describe the previous split. This documentation does not change application behavior.

The current implementation uses React/TypeScript in `client/` and Express/Mongoose in `server/`. Build on that implementation; older Spring Boot examples are not instructions to replace it.

## Separate dashboard

- **Role value:** `CITIZEN`; preserve existing `RESIDENT` compatibility.
- **Planned dashboard route:** `/citizen` with a new `CitizenDashboardPage.tsx`.
- **Existing supporting routes:** `/report`, `/my-reports`, `/issues`, `/issues/:id`.
- **Current state:** Citizen features exist, but `/citizen` is not currently registered. The dedicated dashboard is planned work.

| Dashboard section | Responsibility |
| --- | --- |
| Personal summary | Counts of the signed-in citizen's total, open, in-progress, and resolved reports |
| Report an issue | Clear action opening the existing reporting form |
| My recent reports | Own reports with status, priority, location, and links to details |
| Report management | Edit or cancel eligible own reports with validation and confirmation |
| Community issues | Browse, search, filter, view details, and support existing reports |
| Progress tracking | Display current status and any available citizen-visible progress information |

Use responsive cards, readable status labels, loading/error/empty states, and touch-friendly controls. Personal dashboard totals must be scoped to the current citizen; the public community feed has a separate scope.

## Frontend responsibilities

- Build the dedicated citizen dashboard by reusing existing report and feed services.
- Maintain reporting, My Reports, issue details, search/filtering, and support controls.
- Maintain the public landing experience and shared navigation presentation; coordinate role links with Members 2 and 3.
- Own login/register page presentation, with authentication and role policy coordinated with Member 3.
- Keep form validation consistent with server validation and show actual API failures.
- Refresh affected lists and counts after successful changes.

## Backend and data responsibilities

| Operation | Existing API or implementation | Member 1 responsibility |
| --- | --- | --- |
| Create report | `POST /api/issues` | Validate report fields and associate the report with its author |
| Read own reports | `GET /api/issues/my-reports` | Return only the current citizen's reports |
| Edit report | `PUT /api/issues/:id` | Enforce ownership and agreed status eligibility |
| Cancel report | `DELETE /api/issues/:id` | Enforce ownership and eligibility; handle missing reports |
| Community feed | `GET /api/issues` | Maintain searching, filtering, and sorting |
| Issue details | `GET /api/issues/:id` | Return the issue details needed by citizen views |
| Support/un-support | Existing `feedService.ts` behavior | Maintain duplicate-support prevention; agree on any new persistence API before adding it |

The current feed service includes browser-local support behavior. Do not describe it as a completed server-backed voting system. A new citizen statistics endpoint is optional: reuse own-report data first where practical.

## Files to work in

Existing primary files:

- `client/src/pages/ReportIssuePage.tsx`, `MyReportsPage.tsx`, `IssuesPage.tsx`, `IssueDetailPage.tsx`, and `LandingPage.tsx`
- `client/src/pages/LoginPage.tsx` and `RegisterPage.tsx` for presentation changes
- `client/src/components/citizen/` and `client/src/components/feed/`
- `client/src/services/citizenService.ts` and `feedService.ts`
- `server/controllers/issueController.js`
- `server/routes/issueRoutes.js`
- `server/middleware/validator.js`

Planned new file: `client/src/pages/CitizenDashboardPage.tsx`.

Coordinate edits to `client/src/App.tsx`, shared issue components, authentication hooks, shared types, and database models. Check which component is imported before editing: similarly named issue forms and edit modals exist in multiple folders.

## Permission requirements to implement and verify

- Citizens can create reports, read their own dashboard, and browse public issues.
- Citizens can edit/cancel only their own eligible reports. Agree on eligible statuses with the team before implementation.
- Citizens cannot assign officers, change official issue status, moderate reports, or access privileged operations.
- The backend must verify identity and ownership; a supplied `userId` or hidden button alone is insufficient.
- Coordinate role guards and login redirects with Member 3. These are acceptance requirements, not a claim that current access controls are complete.

## Handoffs

- **To Member 3:** Newly created issues appear in the administrator queue for review and officer assignment.
- **From Member 2:** Officer status changes must appear when the citizen refreshes the same report.
- **Shared contract:** Preserve `Issue.id`, `reportedBy`, `status`, `priorityScore`, `priorityLevel`, and assignment fields. Member 3 owns the priority formula.
- **Community feed ownership:** Under this revised division, feed/search/support move to Member 1; Member 2 owns the officer workflow.

## Completion checklist

- [ ] Citizen has a dedicated dashboard and correct navigation after login.
- [ ] Report creation, viewing, eligible editing, and cancellation work through the API.
- [ ] Personal totals exclude other citizens' reports.
- [ ] Search/filtering and support controls behave consistently.
- [ ] Another citizen's report cannot be edited or cancelled by changing an ID.
- [ ] Citizen requests to officer/admin operations are denied by the backend.
- [ ] One report can be followed through administrator assignment and officer resolution.
- [ ] Mobile layout and loading/error/empty states are checked.
- [ ] Commits and the demonstration identify Member 1's actual frontend and backend contributions.

## Safe implementation and demo

Make small, additive changes in a feature branch based on `dev`; submit changes to `dev`. Preserve existing routes and user work. Coordinate shared-file changes, and do not replace the stack, reset stored data, or remove existing features as part of this role assignment.

Demo: open the Citizen Dashboard, submit an issue, find it in My Reports/community feed, then show its updated status after the officer acts.

Related guides: [Department Officer](member_2_Department%20Officer.md) and [System Administrator](member_3_System%20Administrator.md).
