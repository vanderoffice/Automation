---
phase: 02-database-api
plan: 03
subsystem: database
tags: [rls, row-level-security, seed-data, react-context, role-simulation, supabase]

# Dependency graph
requires:
  - phase: 02-01
    provides: ecos schema with 7 tables
  - phase: 02-02
    provides: Supabase JS client and API helper modules
provides:
  - RLS enabled on all 7 ecos tables with demo-permissive policies
  - 8 fictional employees across 3 roles and 4 departments
  - 3 agreements in varying workflow states (draft, pending_manager, completed)
  - React RoleContext with switchable demo identity
  - Role-aware agreement filtering (employee/manager/admin perspectives)
  - Full stack proven end-to-end (React -> Supabase -> PostgreSQL -> data displayed)
affects: [03-form-ui, 04-signature-workflow, 05-role-switcher-demo, 06-admin-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [react-context-provider, role-based-filtering, localStorage-persistence, demo-permissive-rls]

key-files:
  created: [sql/003-rls-policies.sql, sql/004-seed-data.sql, src/context/RoleContext.jsx]
  modified: [src/main.jsx, src/lib/api/agreements.js, src/lib/api/index.js, src/pages/AgreementPage.jsx]

key-decisions:
  - "Demo-permissive RLS: anon role gets full access, production patterns documented in SQL comments"
  - "Role filtering at API layer (not RLS): getAgreementsForRole filters by role parameter"
  - "localStorage persistence for selected employee ID across page reloads"

patterns-established:
  - "React context provider wrapping app for global state (RoleProvider)"
  - "useRole() hook pattern for consuming role context"
  - "Deterministic UUIDs for seed data (reproducible test state)"

issues-created: []

# Metrics
duration: 10min
completed: 2026-02-06
---

# Phase 2 Plan 3: RLS Policies & Role Simulation Summary

**RLS enabled on all 7 tables, 8 fictional employees seeded across 3 roles, React role context with switchable identity proving full stack connectivity**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-06T05:13:41Z
- **Completed:** 2026-02-06T05:23:31Z
- **Tasks:** 2 auto + 1 checkpoint
- **Files modified:** 7

## Accomplishments
- RLS enabled on all 7 ecos tables with demo-permissive policies for anon role
- Production RLS patterns documented in SQL comments (auth.uid(), JWT claims)
- 4 departments, 8 fictional employees, 3 agreements, 4 signatures, 7 audit entries, 1 form version seeded
- RoleContext provides switchable demo identity with localStorage persistence
- Role-aware getAgreementsForRole filters by employee/manager/admin perspective
- AgreementPage replaced with data verification view showing live Supabase data
- Full stack proven: React -> Supabase JS -> Kong -> PostgREST -> PostgreSQL (ecos schema + RLS) -> data back to React

## Task Commits

Each task was committed atomically:

1. **Task 1: RLS policies and seed demo data** - `861b518` (feat)
2. **Task 2: Role context and demo identity system** - `21d6088` (feat)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified
- `sql/003-rls-policies.sql` - RLS enabled on all 7 tables, demo-permissive policies, production pattern comments
- `sql/004-seed-data.sql` - 4 departments, 8 employees, 3 agreements, signatures, audit log, form version
- `src/context/RoleContext.jsx` - React context with RoleProvider and useRole() hook
- `src/main.jsx` - Wrapped App with RoleProvider
- `src/lib/api/agreements.js` - Added getAgreementsForRole for role-based filtering
- `src/lib/api/index.js` - Added getAgreementsForRole to barrel export
- `src/pages/AgreementPage.jsx` - Replaced component preview with data verification view

## Decisions Made
- Demo-permissive RLS: anon gets full access since this is a demo app without real auth. Production policy patterns documented in SQL comments showing what auth.uid()-based policies would look like.
- Role filtering at API layer rather than RLS: getAgreementsForRole accepts role parameter and filters accordingly. Simpler for demo, demonstrates the concept.
- Added getAgreementsForRole to agreements.js (not workflow.js as plan mentioned) since it's agreement filtering logic, not workflow state transitions.
- localStorage persistence for selected employee ID so page reloads don't reset the demo role.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid hex characters in seed data UUIDs**
- **Found during:** Task 1 (seed data migration)
- **Issue:** Initial UUID values contained non-hex characters (s, l) which PostgreSQL rejected
- **Fix:** Replaced with valid hex-only characters (a-f, 0-9)
- **Files modified:** sql/004-seed-data.sql
- **Verification:** Migration applied successfully, all 8 employees confirmed
- **Committed in:** 861b518 (Task 1 commit)

### Deferred Enhancements

None logged.

---

**Total deviations:** 1 auto-fixed (1 bug), 0 deferred
**Impact on plan:** Minor fix for valid SQL. No scope creep.

## Issues Encountered
None

## Next Phase Readiness
- Phase 2 complete: all 7 tables, RLS, seed data, Supabase client, API helpers, role context
- Schema supports Phase 3 (form UI), Phase 4 (signature workflow), Phase 5 (role switcher UI)
- Role context ready for Phase 5's role switcher component to build on
- No blockers for Phase 3

---
*Phase: 02-database-api*
*Completed: 2026-02-06*
