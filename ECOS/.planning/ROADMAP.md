# Roadmap: ECOS Security Agreement Modernization

## Overview

Replace CalHR's 14-page PDF + Adobe Sign workflow with a polished web-based demo at vanderdev.net/ecosform. Starting from project scaffolding through a fully deployed three-party signature workflow with admin dashboard, culminating in a Docker-deployed demo impressive enough to pitch to state executives.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Foundation** *(Complete)* - Project scaffolding, Docker config, Tailwind design system, dev environment
- [x] **Phase 2: Database & API** *(Complete)* - Supabase schema, PostgREST endpoints, RLS policies
- [x] **Phase 3: Form UI** *(Complete)* - Agreement form with both tracks, security content, access groups
- [x] **Phase 4: Signature Workflow** *(Complete)* - Three-party signing flow, audit metadata, typed-name signatures
- [x] **Phase 5: Role Switcher & Demo** *(Complete)* - Perspective switching UI, fictional data seeding, demo experience
- [x] **Phase 6: Admin Dashboard** *(Complete)* - Compliance status, pending approvals, audit trail viewer
- [x] **Phase 7: Deployment & Polish** *(Complete)* - Docker deploy, nginx-proxy routing, responsive QA, final polish

## Phase Details

### Phase 1: Foundation
**Goal**: Standing project with Docker dev environment, Tailwind configured with vanderdev.net design tokens, base layout shell, and working hot-reload
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard scaffolding with established patterns)
**Plans**: TBD

Plans:
- [x] 01-01: Project scaffolding — package.json, Docker setup, Tailwind config with design tokens
- [x] 01-02: Base layout shell — app chrome, navigation skeleton, responsive container
- [x] 01-03: Design system components — buttons, cards, inputs, status badges matching vanderdev.net

### Phase 2: Database & API
**Goal**: Supabase schema with forms, workflows, signatures, and audit tables; PostgREST endpoints tested and accessible; RLS policies for role-based access
**Depends on**: Phase 1
**Research**: Likely (Supabase PostgREST integration patterns, RLS policy design for multi-role workflow)
**Research topics**: PostgREST API patterns for existing VPS Supabase stack, RLS policies for employee/manager/admin roles, schema design for reusable form platform
**Plans**: TBD

Plans:
- [x] 02-01: Schema design — forms, agreements, signatures, audit_log tables
- [x] 02-02: PostgREST API layer — endpoints for CRUD operations, signature submission, workflow transitions
- [x] 02-03: RLS policies and role simulation — row-level security for demo role switching

### Phase 3: Form UI
**Goal**: Complete, interactive ECOS agreement form with New/Updated User and Annual Renewal tracks, streamlined security content (pages 9-11), access group checkboxes, and form validation
**Depends on**: Phase 1 (design system), Phase 2 (API for persistence)
**Research**: Unlikely (internal UI using design tokens from Phase 1)
**Plans**: TBD

Plans:
- [x] 03-01: Form structure — track selection (New/Updated vs Annual Renewal), employee info fields, department fields
- [x] 03-02: Security agreement content — streamlined display of security requirements, acknowledgment sections
- [x] 03-03: Access groups and validation — ECOS user group checkboxes, form validation, error states

### Phase 4: Signature Workflow
**Goal**: Working three-party signature flow (Employee → Manager → Admin) with typed-name signatures, "I certify" checkboxes, full audit metadata capture (timestamp, IP, user agent, session hash, form version hash)
**Depends on**: Phase 2 (API), Phase 3 (form)
**Research**: Unlikely (UETA/SAM 1734 requirements well-defined in PROJECT.md; signature UX is straightforward)
**Plans**: TBD

Plans:
- [x] 04-01: Signature component — typed-name input, certification checkbox, audit metadata capture
- [x] 04-02: Workflow engine — state machine for Employee → Manager → Admin transitions, status tracking
- [x] 04-03: Workflow UI — pending/completed states, signature timeline, workflow status indicators

### Phase 5: Role Switcher & Demo
**Goal**: Role switcher UI letting demo viewers freely switch between Employee, Manager, and Admin perspectives; fictional demo data pre-seeded; smooth demo experience for executive presentations
**Depends on**: Phase 3 (form), Phase 4 (workflow)
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [x] 05-01: Role switcher UI — persistent role selector, context-aware view switching
- [x] 05-02: Demo data seeding — fictional employees/departments, pre-populated agreements in various workflow states
- [x] 05-03: Demo polish — guided flow hints, smooth transitions between perspectives

### Phase 6: Admin Dashboard
**Goal**: Admin view showing compliance status across departments, pending approval queue, and full audit trail viewer with search/filter
**Depends on**: Phase 2 (API), Phase 4 (workflow data), Phase 5 (role switcher)
**Research**: Unlikely (internal dashboard using existing API and data)
**Plans**: TBD

Plans:
- [x] 06-01: Compliance overview — department compliance rates, expiring agreements, status summary cards
- [x] 06-02: Approval queue — pending signatures list, one-click approve workflow
- [x] 06-03: Audit trail viewer — searchable/filterable log of all signature events and form changes

### Phase 7: Deployment & Polish
**Goal**: Production Docker deployment at vanderdev.net/ecosform with nginx-proxy auto-discovery, responsive design verified on mobile/desktop, final QA pass
**Depends on**: All previous phases
**Research**: Likely (VPS Docker deployment specifics, nginx-proxy VIRTUAL_PATH label configuration)
**Research topics**: Docker label configuration for nginx-proxy routing on existing VPS stack, SSL auto-provisioning for subpath, container resource limits
**Plans**: TBD

Plans:
- [x] 07-01: Docker production build — Dockerfile, multi-stage build, VIRTUAL_PATH=/ecosform label
- [x] 07-02: VPS deployment — push to VPS, nginx-proxy integration, SSL verification
- [x] 07-03: Responsive polish and QA — mobile/desktop testing, animation polish, final demo walkthrough

---

## Milestone 2: UX Overhaul (2026-02-17)

**Goal:** Overhaul the MVP to match bot-overhaul polish standards. Fix the vertical scroll problem, add tabs/filtering/pagination, progressive disclosure for forms, expand demo data to 50+ records, extract reusable platform components.

### Phase 8: Dashboard UX Overhaul
**Goal**: Make DashboardPage scannable at 50+ records with tab layout, compact cards, paginated audit
**Depends on**: Phase 6 (existing dashboard)

Plans:
- [x] 08-01: Tab layout + data hook extraction — TabBar component, useDashboardData hook, 3-tab layout
- [x] 08-02: Compact approval cards with quick-sign — accordion cards, 2-col grid
- [x] 08-03: Paginated audit trail — extracted component, pagination, date range filters

### Phase 9: Workflow Page Redesign
**Goal**: Make WorkflowPage scannable at 10+ items with status tabs, compact cards, search/sort
**Depends on**: Phase 8 (TabBar component)

Plans:
- [x] 09-01: Status tabs + compact agreement cards — filter tabs, MiniProgressDots, accordion cards
- [x] 09-02: Workflow search + sort — search bar, sort dropdown, per-tab empty states

### Phase 10: Form Experience Improvements
**Goal**: Progressive disclosure stepper and draft auto-save for the agreement form
**Depends on**: Phase 3 (existing form)

Plans:
- [x] 10-01: Stepper form with progress indicator — 4-step stepper, next/back nav
- [x] 10-02: Draft auto-save + resume — localStorage auto-save, resume/discard UI

### Phase 11: Demo Scale + Visualization
**Goal**: 50+ seed records for realistic scale demo, enhanced compliance visualization
**Depends on**: Phase 8 (dashboard tabs)

Plans:
- [x] 11-01: Expanded seed data — 24 employees, 6 departments, 53 agreements
- [x] 11-02: Department compliance visualization + expiring soon grouping

### Phase 12: Platform Patterns + Polish
**Goal**: Extract reusable components, responsive polish, print export
**Depends on**: Phase 9 (workflow components)

Plans:
- [x] 12-01: Component library extraction — WorkflowTimeline, StatusBadge, barrel exports
- [x] 12-02: Responsive polish + print export — @media print, Download PDF button

## Progress

**Milestone 1 (MVP) — Complete:**

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-02-06 |
| 2. Database & API | 3/3 | Complete | 2026-02-06 |
| 3. Form UI | 3/3 | Complete | 2026-02-06 |
| 4. Signature Workflow | 3/3 | Complete | 2026-02-06 |
| 5. Role Switcher & Demo | 3/3 | Complete | 2026-02-06 |
| 6. Admin Dashboard | 3/3 | Complete | 2026-02-06 |
| 7. Deployment & Polish | 3/3 | Complete | 2026-02-07 |

**Milestone 2 (UX Overhaul) — Complete:**

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 8. Dashboard UX Overhaul | 3/3 | Complete | 2026-02-17 |
| 9. Workflow Page Redesign | 2/2 | Complete | 2026-02-17 |
| 10. Form Experience | 2/2 | Complete | 2026-02-17 |
| 11. Demo Scale + Viz | 2/2 | Complete | 2026-02-17 |
| 12. Platform + Polish | 2/2 | Complete | 2026-02-17 |

See `.planning/OVERHAUL-SUMMARY.md` for detailed session reference.
