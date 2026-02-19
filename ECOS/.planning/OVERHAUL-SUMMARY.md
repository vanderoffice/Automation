# ECOS UX Overhaul — Session Reference

**Date:** 2026-02-17
**Duration:** ~95 minutes (5 phases, 11 plans + 2 hotfixes)
**Commits:** `3971f9b`, `ccb53c0`, `3876e2a`
**Live:** https://vanderdev.net/ecosform

---

## Problem Statement

The ECOS MVP was functionally complete (7 phases, 21 plans, deployed 2026-02-07) but the UX hadn't kept pace with polish standards established during bot overhauls. The core problem: Dashboard and list views rendered ALL items in a single vertical scroll with no pagination, filtering, tabs, or compact modes. With 10+ items, it became a confusing wall of cards. DashboardPage was 511 lines rendering 5 stacked sections, and WorkflowPage rendered full-height AgreementCards (~250px each) for every agreement.

## What Shipped

### Phase 8: Dashboard UX Overhaul (3 plans)

**Plan 8-1: Tab Layout + Data Hook Extraction**
- Split 511-line DashboardPage into 3-tab layout: **Overview** (default), **Approvals**, **Audit Trail**
- Created `src/components/ui/TabBar.jsx` — reusable horizontal pill-tab component with orange active state and optional count badges
- Created `src/lib/useDashboardData.js` — extracted `computeStats()`, `computeDepartments()`, data fetching, and all derived state into a custom hook (187 lines)
- DashboardPage became a thin shell that renders the active tab

**Plan 8-2: Compact Approval Cards with Quick-Sign**
- Replaced inline SignatureBlock-per-item (~150px each) with compact cards (~48px collapsed)
- Accordion pattern: click to expand one card at a time, revealing full SignatureBlock
- 2-column grid: `grid grid-cols-1 sm:grid-cols-2 gap-3 items-start`
- Urgency left-border color based on wait time (green < 7d, orange 7-14d, red > 14d)
- Expanded cards span full width (`sm:col-span-2`) to prevent grid row gaps

**Plan 8-3: Paginated Audit Trail**
- Extracted audit trail into dedicated `AuditTab` component
- Client-side pagination (25 items/page, prev/next with page counter)
- Date range quick-filters: Today, This Week, This Month, All
- Expandable detail rows showing full audit entry JSON
- Retained existing search + action type filter

### Phase 9: Workflow Page Redesign (2 plans)

**Plan 9-1: Status Tabs + Compact Agreement Cards**
- Added status filter tabs: **Needs Action** (default), **In Progress**, **Completed**, **All** — each with count badge
- Created `src/components/workflow/CompactAgreementCard.jsx` (inline in WorkflowPage) with collapsed/expanded states
- Created `src/components/workflow/MiniProgressDots.jsx` — 3-dot progress indicator (green=signed, orange=current, gray=pending)
- Collapsed cards: name, dept, track/status badges, mini dots, relative time (~60px)
- Expanded cards: full WorkflowTimeline + access group checkboxes + SignatureBlock, spans full width

**Plan 9-2: Workflow Search + Sort**
- Search bar filtering by employee name or department (client-side, debounced)
- Sort dropdown: Wait Time, Most Recent, Name A-Z, Department
- Per-tab empty states ("All caught up — nothing needs your signature" for Needs Action, etc.)

### Phase 10: Form Experience Improvements (2 plans)

**Plan 10-1: Stepper Form with Progress Indicator**
- Created `src/components/form/FormStepper.jsx` — horizontal 4-step indicator with connecting lines
  - Desktop: numbered dots with labels (Employee & Dept Info → Security Requirements → Review → Submit)
  - Mobile: "Step X of 4" with compact dot indicators
- Created `StepNavigation` component — Back/Next buttons with step validation
- Wrapped AgreementForm sections in step containers with progressive disclosure
- Step validation gates: Step 1 requires supervisor/phone/location; Step 3 requires acknowledgment checkbox

**Plan 10-2: Draft Auto-Save + Resume**
- localStorage auto-save every 30 seconds, keyed by `ecos_draft_{employee_id}`
- On mount: detects saved draft, shows Alert banner with Resume/Discard buttons
- "Draft saved" toast notification on auto-save
- Clears draft on successful form submission
- Survives page refresh and role switches

### Phase 11: Demo Scale + Visualization (2 plans)

**Plan 11-1: Expanded Seed Data (53 Agreements)**
- Created `sql/006-scale-seed.sql` with PL/pgSQL DO block
- Added 2 departments: Department of Finance (DOF), Employment Development Department (EDD) — total: 6
- Added 16 employees (EMP-009 through EMP-024) — total: 24
- Generated 40 additional agreements via procedural SQL (total: 53)
- Distribution: 24 completed, 11 pending_manager, 8 pending_admin, 6 pending_employee, 4 draft
- Staggered dates over 60-day range with varied expiry (including expired, this week, this month, this quarter)
- Updated `sql/099-reset-demo.sql` to be fully self-contained (truncate + re-seed everything)

**Plan 11-2: Department Compliance Visualization + Expiring Soon Grouping**
- Enhanced Overview tab with compliance summary line: "X of Y depts above 80%" + average rate
- Expiring Soon section grouped by urgency buckets:
  - **Expired** (red) — past due
  - **This Week** (orange) — 0-7 days
  - **This Month** (yellow) — 8-30 days
  - **This Quarter** (neutral) — 31-90 days
- Count badges per urgency group, collapsible with "+N more" links

### Phase 12: Platform Patterns + Polish (2 plans)

**Plan 12-1: Component Library Extraction**
- Created `src/components/workflow/WorkflowTimeline.jsx` — generic N-step vertical timeline
  - Props: `steps` (array of {id, label}), `data` (keyed by step.id), `currentId`
  - Green checkmark for completed, orange pulse for current, gray for pending
  - Exports `formatRelativeTime` utility
- Created `src/components/workflow/StatusBadge.jsx` — status-to-badge mapper
  - Exports `StatusBadge`, `STATUS_LABELS`, `STATUS_VARIANTS`
- Updated `src/components/ui/index.js` barrel exports
- Refactored WorkflowPage to use extracted components via `buildTimelineData()` adapter

**Plan 12-2: Responsive Polish + Print Export**
- Added `@media print` stylesheet to `src/index.css`:
  - White background, hide nav/aside/buttons/demo-banner
  - Override dark card styles to white with light borders
  - Text color overrides for readability
  - Single-column grids, disabled animations
  - `print-color-adjust: exact` for badges and progress bars
- Added `.scrollbar-hide` CSS utility for TabBar horizontal scroll
- Added "Print / Export PDF" button on completed agreements (`window.print()`)
- Added `data-demo-banner` attribute to DemoBanner for print targeting

### Post-Deploy Hotfixes

**Hotfix 1: Grid row stretching (`ccb53c0`)**
- Added `items-start` to 2-column grids on Dashboard Approvals and Workflow pages
- Prevented collapsed cards from stretching to match expanded card height

**Hotfix 2: Expanded card col-span (`3876e2a`)**
- Added `sm:col-span-2` to expanded cards on both pages
- Expanded cards take full grid width, eliminating awkward row gaps

---

## Files Created (10)

| File | Lines | Purpose |
|------|-------|---------|
| `src/components/ui/TabBar.jsx` | 37 | Reusable horizontal pill-tab component |
| `src/lib/useDashboardData.js` | 187 | Dashboard data hook (fetch, compute, derive) |
| `src/components/form/FormStepper.jsx` | 132 | 4-step horizontal indicator + StepNavigation |
| `src/components/workflow/MiniProgressDots.jsx` | 64 | 3-dot signature progress indicator |
| `src/components/workflow/StatusBadge.jsx` | 29 | Status string → Badge variant mapper |
| `src/components/workflow/WorkflowTimeline.jsx` | 84 | Generic N-step vertical timeline |
| `sql/006-scale-seed.sql` | 247 | PL/pgSQL seed: 2 depts, 16 employees, 40 agreements |
| `.planning/OVERHAUL-SUMMARY.md` | — | This file |

## Files Modified (8)

| File | Nature of Changes |
|------|-------------------|
| `src/pages/DashboardPage.jsx` | Decomposed into 3-tab layout, extracted sections, added compliance viz |
| `src/pages/WorkflowPage.jsx` | Added status tabs, compact cards, search/sort, extracted components |
| `src/components/form/AgreementForm.jsx` | Wrapped in 4-step stepper, added auto-save + draft recovery |
| `src/components/DemoBanner.jsx` | Added `data-demo-banner` attribute for print stylesheet |
| `src/components/ui/index.js` | Added TabBar export |
| `src/index.css` | Added print stylesheet + scrollbar-hide utility |
| `sql/099-reset-demo.sql` | Self-contained reset with all 53 agreements |
| `.planning/ROADMAP.md` | Added Milestone 2 phases 8-12 |

## Architecture Decisions

1. **Inline CompactAgreementCard** — kept in WorkflowPage rather than extracting to a separate file, since it's tightly coupled to the page's state (expandedId, signatures, signing flow). Extracting would require passing 7+ props with no reuse benefit.

2. **PL/pgSQL DO block for seed data** — procedural SQL with a definition table (`VALUES` array) and loop generates 40 agreements in ~50 lines vs ~400 lines of individual INSERTs. Manager/admin lookups are dynamic (same-department first, fallback to known users).

3. **localStorage over sessionStorage for drafts** — drafts should survive tab closes. Keyed by employee_id so different demo roles don't clobber each other.

4. **Client-side pagination/filtering** — with 53 records, server-side pagination adds complexity without benefit. All data fits in one PostgREST call. Threshold for switching: ~500 records.

5. **`sm:col-span-2` accordion pattern** — expanded cards span both grid columns to avoid the CSS Grid row-height problem. This is preferable to CSS `columns` (masonry) which breaks DOM order and makes accordion state harder to manage.

6. **Generic WorkflowTimeline** — extracted to accept any N-step workflow via props, making it reusable for future form automation projects beyond ECOS (e.g., travel requests, procurement approvals).

## Key Patterns for Future Forms

| Pattern | Component | Reuse Notes |
|---------|-----------|-------------|
| Horizontal tabs with counts | `TabBar` | Generic — pass `tabs[]` with `{id, label, count}` |
| Accordion cards in grid | Inline pattern | `items-start` + conditional `sm:col-span-2` |
| N-step workflow timeline | `WorkflowTimeline` | Pass `steps[]`, `data{}`, `currentId` |
| Status → Badge mapping | `StatusBadge` | Extend `STATUS_LABELS`/`STATUS_VARIANTS` for new statuses |
| Form stepper | `FormStepper` | Hardcoded to 4 steps — generalize `STEPS` array for reuse |
| Auto-save drafts | Pattern in AgreementForm | Extract to `useDraftAutoSave(key, formData)` hook for reuse |
| Print stylesheet | `index.css @media print` | Generic dark-to-light override — works for any dark-themed app |
| Mini progress dots | `MiniProgressDots` | 3-step only — generalize for N steps if needed |

## Demo Reset Command

```bash
ssh vps "cat /root/Automation/ECOS/sql/099-reset-demo.sql | docker exec -i supabase-db psql -U postgres -d postgres"
```

## Deployment

```bash
# From local
cd /Users/slate/Documents/GitHub/Automation
git push origin main

# On VPS
ssh vps "cd /root/Automation && git pull origin main && cd ECOS && docker compose -f docker-compose.prod.yml up -d --build"
```

## Data Summary (Post-Reset)

| Entity | Count |
|--------|-------|
| Departments | 6 (CDTFA, SCO, ODI, DOT, DOF, EDD) |
| Employees | 24 (EMP-001 through EMP-024) |
| Agreements | 53 (24 completed, 11 pending_manager, 8 pending_admin, 6 pending_employee, 4 draft) |

## Gotchas

- **React Router `basename="/ecosform"`** — never double-prefix `navigate()` paths
- **`ecos` schema** — all tables in `ecos.*`, not `public.*`. Use `SET search_path TO ecos` in raw SQL
- **Docker network** — container joins `n8n-cloud-stack_frontend` (external) for nginx-proxy discovery
- **Grid accordion** — always pair `items-start` with `sm:col-span-2` on expanded items
- **Print stylesheet** — uses `[data-demo-banner]` attribute selector, not class name
