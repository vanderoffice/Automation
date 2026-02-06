# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-05)

**Core value:** A visually compelling, fully functional demo that makes the current PDF process look obsolete -- polished enough to pitch to executives and backed by real data persistence.
**Current focus:** Phase 7 in progress — Docker production build complete. Next: VPS deployment (07-02).

## Current Position

Phase: 7 of 7 (Deployment & Polish)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-02-06 — Completed 07-01-PLAN.md

Progress: ███████████████████████████░░░ 90%

## Performance Metrics

**Velocity:**
- Total plans completed: 19
- Average duration: 7 min
- Total execution time: 2h 12min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Foundation | 3/3 | 12 min | 4 min |
| 2. Database & API | 3/3 | 18 min | 6 min |
| 3. Form UI | 3/3 | 15 min | 5 min |
| 4. Signature Workflow | 3/3 | 45 min | 15 min |
| 5. Role Switcher & Demo | 3/3 | 39 min | 13 min |
| 6. Admin Dashboard | 3/3 | 8 min | 3 min |
| 7. Deployment & Polish | 1/3 | 4 min | 4 min |

**Recent Trend:**
- Last 5 plans: 30 min, 3 min, 2 min, 3 min, 4 min
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
| 03-02 | Separate data file for security requirements | Content is data, not UI — reusable across SecurityContent and Acknowledgment |
| 03-02 | onOpen callback on CollapsibleSection | Parent tracks "ever opened" without lifting accordion state |
| 03-02 | BulletList local helper, not separate file | Avoids duplication without over-abstracting |
| 03-03 | Flat 5-group access list (no categories) | User feedback: categorized layout was too complex for streamlined demo |
| 03-03 | system_admin triggers admin section | Only meaningful conditional — real operational logic preserved |
| 03-03 | Two-step DB write (agreement → groups) | Simple API helpers, acceptable for demo |
| 04-01 | ip_address null client-side | Server-side population only for honest audit trails |
| 04-01 | Session hash via crypto.subtle.digest | Raw UUID never exposed outside sessionStorage |
| 04-01 | Sub-component pattern for SignatureBlock states | Clean separation of active/disabled/signed rendering |
| 04-02 | Inline signing after submit | Employee signs immediately on success screen, no separate page |
| 04-02 | Error isolation on signature failure | Signature failure doesn't lose the created agreement |
| 04-03 | Temp role switcher on WorkflowPage | Phase 5 replaces with global switcher; needed for testing |
| 04-03 | SignatureTimeline as local component | Single-use, avoids file bloat |
| 05-01 | React key remount for form reset | Simpler than useEffect; resets all state at once |
| 05-01 | Self-contained RoleSwitcher | Sidebar doesn't import useRole, component manages own context |
| 05-02 | Additive migration (005) not modifying 004 | Preserves migration history |
| 05-02 | SQL-only reset script, no in-app reset | Overkill for exec demo audience |
| 05-03 | Existing animate-in sufficient for role switch transitions | No explicit transition state needed — key remount triggers fadeIn |
| 05-03 | Skipped AgreementPage existing-agreement notice | Would require additional API call, per plan guidance |
| 06-01 | Client-side stats from single getAgreements() call | Avoids multiple API round-trips for dashboard aggregation |
| 06-01 | Department table sorted worst-first | Draws executive attention to departments needing action |
| 06-01 | Parallel Promise.all for both API calls | Faster initial dashboard load |
| 06-02 | useRole() for admin signer identity | Pulls from demo role context, not hardcoded name |
| 06-02 | Urgency border colors (red/orange/neutral) | Visual priority at a glance for executive demo |
| 06-03 | Client-side filtering on 100 audit entries | No server round-trips per filter change |
| 06-03 | Set-based expandedAudit state | O(1) per-row expand toggle |
| 06-03 | Fiscal year from current month | July = FY start |
| 07-01 | Build args for VITE_ env vars | Vite injects at build time, not runtime |
| 07-01 | VIRTUAL_DEST=/ in nginx-proxy labels | Strips /ecosform prefix before forwarding to container |
| 07-01 | Dual-path nginx config | location / for behind proxy, /ecosform/ for direct access |
| 07-01 | wget for HEALTHCHECK | nginx:alpine has wget, not curl |

### Deferred Issues

None yet.

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-06
Stopped at: Completed 07-01-PLAN.md — Production Docker build with Vite build-arg injection, nginx-proxy labels, dual-path nginx. Next: 07-02 VPS deployment.
Resume file: None
