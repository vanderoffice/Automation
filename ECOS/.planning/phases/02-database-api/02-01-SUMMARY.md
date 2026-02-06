---
phase: 02-database-api
plan: 01
subsystem: database
tags: [supabase, postgresql, postgrest, schema, sql, migrations]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: project scaffold, Docker config, VPS deployment target
provides:
  - 7-table ecos schema (departments, employees, agreements, access groups, signatures, audit_log, form_versions)
  - PostgREST API exposure for ecos schema
  - SQL migration files (001-schema.sql, 002-workflow.sql)
  - updated_at trigger on agreements
  - FK cascade delete on agreement_access_groups and signatures
affects: [02-database-api, 03-form-ui, 04-signature-workflow, 05-role-switcher, 06-admin-dashboard]

# Tech tracking
tech-stack:
  added: [postgresql-15, postgrest, supabase-kong]
  patterns: [dedicated-schema-isolation, idempotent-migrations, updated_at-trigger]

key-files:
  created: [sql/001-schema.sql, sql/002-workflow.sql]
  modified: []

key-decisions:
  - "Removed graphql_public from PGRST_DB_SCHEMAS — schema didn't exist, was blocking PostgREST startup"
  - "Used IF NOT EXISTS on all CREATE TABLE/INDEX for idempotent migrations"

patterns-established:
  - "Schema isolation: ecos.* keeps tables separate from public/ai_solutions/kiddobot"
  - "Migration numbering: sql/NNN-description.sql"
  - "PostgREST Accept-Profile header for schema routing"

issues-created: []

# Metrics
duration: 4min
completed: 2026-02-06
---

# Phase 2 Plan 1: Schema Design Summary

**7-table ECOS schema on VPS Supabase with PostgREST API exposure — departments, employees, agreements, access groups, signatures, audit log, form versions**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-06T05:00:13Z
- **Completed:** 2026-02-06T05:04:26Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Created `ecos` schema with 7 tables covering full agreement lifecycle: departments, employees, agreements, agreement_access_groups, signatures, audit_log, form_versions
- CHECK constraints enforce enums (role, track, status, signer_role) with database-level safety
- Cascade deletes on agreement child tables (access groups, signatures); SET NULL on audit_log for preservation
- PostgREST configured and verified to serve ecos schema via `Accept-Profile: ecos` header through Kong API gateway

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ECOS schema and core tables** - `24fc5fe` (feat)
2. **Task 2: Create workflow and audit tables** - `d728729` (feat)

## Files Created/Modified
- `sql/001-schema.sql` - Schema creation, departments, employees, agreements, agreement_access_groups, updated_at trigger
- `sql/002-workflow.sql` - Signatures, audit_log, form_versions, PostgREST grants for anon/authenticated

## Decisions Made
- Removed `graphql_public` from `PGRST_DB_SCHEMAS` — this schema didn't exist on the VPS Supabase instance and was silently preventing PostgREST from starting. Config changed from `public,storage,graphql_public` to `public,storage,ecos`
- Used `IF NOT EXISTS` on all CREATE TABLE/INDEX statements for idempotent re-runnable migrations

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed PostgREST schema cache failure due to non-existent graphql_public schema**
- **Found during:** Task 2 (PostgREST configuration)
- **Issue:** `PGRST_DB_SCHEMAS` included `graphql_public` which doesn't exist on this Supabase instance — PostgREST was stuck in reconnect loop
- **Fix:** Removed `graphql_public` from the comma-separated list, leaving `public,storage,ecos`
- **Files modified:** VPS `/root/n8n-cloud-stack/docker-compose.yml` (line 145)
- **Verification:** PostgREST schema cache loaded successfully (21 Relations, 16 Relationships)

**2. [Rule 3 - Blocking] Used docker compose up -d instead of restart to pick up env changes**
- **Found during:** Task 2 (PostgREST configuration)
- **Issue:** `docker compose restart rest` only restarts the container with existing env — doesn't pick up docker-compose.yml changes
- **Fix:** Used `docker compose up -d rest` to recreate the container with updated environment
- **Verification:** `docker inspect` confirmed `PGRST_DB_SCHEMAS=public,storage,ecos`

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary to complete PostgREST exposure. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## Next Phase Readiness
- All 7 ecos tables created and verified on VPS Supabase
- PostgREST API serving ecos schema via Kong gateway (port 8000)
- Ready for 02-02-PLAN.md (PostgREST API layer — endpoints for CRUD operations, signature submission, workflow transitions)
- No blockers or concerns

---
*Phase: 02-database-api*
*Completed: 2026-02-06*
