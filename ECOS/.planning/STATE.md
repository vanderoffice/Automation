# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-05)

**Core value:** A visually compelling, fully functional demo that makes the current PDF process look obsolete -- polished enough to pitch to executives and backed by real data persistence.
**Current focus:** Phase 3 in progress — Form UI (1/3 plans done). Form shell with track selection and employee info built.

## Current Position

Phase: 3 of 7 (Form UI)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-02-06 — Completed 03-01-PLAN.md

Progress: █████████░░░░░░░░░░░ 33%

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 5 min
- Total execution time: 0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3/3 | 12 min | 4 min |
| 2. Database & API | 3/3 | 18 min | 6 min |
| 3. Form UI | 1/3 | 2 min | 2 min |

**Recent Trend:**
- Last 5 plans: 6 min, 4 min, 4 min, 10 min, 2 min
- Trend: —

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | Port 5180 for dev server | Avoid collision with vanderdev-website on 5173 |
| 01-01 | Manual scaffold (no create-vite) | Full control over project structure |
| 01-01 | Copy vanderdev-website index.css wholesale | Design system foundation, not recreating from scratch |
| 01-02 | BrowserRouter basename in main.jsx | Separates routing config from route definitions |
| 01-02 | Layout route with Outlet pattern | Layout renders once, child routes swap inside |
| 01-02 | Emoji icons for nav items | No icon library needed until Phase 3+ |
| 01-03 | No clsx/twMerge — plain string concatenation | Minimize dependencies in v1 |
| 01-03 | Checkbox inline SVG overlay for checkmark | Self-contained, no extra CSS rules needed |
| 02-01 | Removed graphql_public from PGRST_DB_SCHEMAS | Schema didn't exist, was blocking PostgREST startup |
| 02-01 | IF NOT EXISTS on all CREATE TABLE/INDEX | Idempotent migrations for safe re-runs |
| 02-02 | persistSession: false on Supabase client | Demo app with simulated auth, not real Supabase Auth |
| 02-02 | db: { schema: 'ecos' } at client level | All queries target ecos schema automatically |
| 02-03 | Demo-permissive RLS policies | anon gets full access; production patterns in SQL comments |
| 02-03 | Role filtering at API layer, not RLS | getAgreementsForRole filters by role param; simpler for demo |
| 02-03 | localStorage for selected employee ID | Persists demo role across page reloads |
| 03-01 | Separate form/ directory from ui/ | Form-specific components distinct from reusable design system |
| 03-01 | Curried handleChange(field) pattern | Clean, scalable for adding fields in later plans |
| 03-01 | Employee info as styled text, not inputs | Never user-editable, sourced from employee record |

### Deferred Issues

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-06
Stopped at: Completed 03-01-PLAN.md — Form shell with track selector, employee info, and department fields. Ready for 03-02 (security content).
Resume file: None
