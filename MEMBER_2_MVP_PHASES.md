# Member 2 - Department Officer MVP Phases

This document divides the Department Officer tasks into 4 Minimum Viable Product (MVP) phases. By completing each phase one by one, you will always have a working, testable product.

## Phase 1: Authentication & Basic Dashboard Skeleton
**Goal:** Ensure the officer can log in, access their specific dashboard route, and see their basic statistics and assigned issues.

**Tasks:**
1. Secure the `GET /api/officer/queue` backend route to only return issues assigned to the logged-in officer.
2. Secure the `GET /api/officer/stats` backend route to calculate counts exclusively for this officer.
3. On the frontend (`client/src/pages/OfficerPage.tsx`), successfully fetch and display these statistics and the list of issues.
4. Ensure the dashboard shows an empty state if the officer has no assigned work.

**End of Phase 1 - Pull Code to Dev:**
Once the basic queue and stats are displaying for the logged-in officer, commit and pull to dev:
```bash
git add .
git commit -m "feat(officer): Phase 1 - basic dashboard and secure queues"
git push origin <your-branch-name>

# Go to GitHub and open a Pull Request to merge this into the 'dev' branch.
# After it is merged by your team, update your local branch:
git pull origin dev
```

## Phase 2: Search, Filter, & UI Polish
**Goal:** Make the queue usable by allowing the officer to search, filter, and easily view details of their assigned issues.

**Tasks:**
1. Implement search functionality (e.g., by issue title/description).
2. Implement filtering by status (e.g., Critical, In Progress, Resolved).
3. Polish the responsive tables/cards for mobile layouts.
4. Test loading and error states to ensure the UI doesn't crash when the internet is slow or the backend fails.

**End of Phase 2 - Pull Code to Dev:**
Once the UI is fully functional for filtering and searching:
```bash
git add .
git commit -m "feat(officer): Phase 2 - search, filter and UI polish"
git push origin <your-branch-name>

# Go to GitHub and open a Pull Request to merge this into the 'dev' branch.
# After it is merged, update your local branch:
git pull origin dev
```

## Phase 3: Status Updates & Field Notes (Core Functionality)
**Goal:** Enable the officer to actively work on issues by changing their status and adding field notes.

**Tasks:**
1. Update `PUT /api/officer/issues/:id/status` on the backend to accept status changes and field notes.
2. Validate on the backend that:
   - The officer modifying the issue is actually the assigned officer.
   - The status change follows the correct sequence (`REPORTED -> UNDER_REVIEW -> IN_PROGRESS -> RESOLVED`).
3. Update the frontend modal to allow status selection and field note entry.
4. Upon successful update, refresh the queue and statistics cards automatically.

**End of Phase 3 - Pull Code to Dev:**
Once the officer can successfully progress an issue to RESOLVED and add notes:
```bash
git add .
git commit -m "feat(officer): Phase 3 - status updates and field notes"
git push origin <your-branch-name>

# Go to GitHub and open a Pull Request to merge this into the 'dev' branch.
# After it is merged, update your local branch:
git pull origin dev
```

## Phase 4: Final Integration & Edge Case Verification
**Goal:** Ensure the officer dashboard interacts perfectly with the Citizen and Admin systems, and no security holes exist.

**Tasks:**
1. Verify that if Member 3 (Admin) reassigns an issue to someone else, it disappears from your queue.
2. Verify that if you update a status to `RESOLVED`, Member 1 (Citizen) sees it on their end.
3. Test attempting to update an issue assigned to a different officer ID using Postman/ThunderClient to ensure the backend properly rejects it.
4. Final cleanup of `console.log`s and dead code.

**End of Phase 4 - Pull Code to Dev:**
Once all integrations are tested and edge cases are verified:
```bash
git add .
git commit -m "chore(officer): Phase 4 - final integration and security checks"
git push origin <your-branch-name>

# Go to GitHub and open a Pull Request to merge this into the 'dev' branch.
# After it is merged, update your local branch:
git pull origin dev
```
