# Roadmap: ECOS Security Agreement Modernization

## Overview

Replace CalHR's 14-page PDF + Adobe Sign workflow with a polished web-based demo at vanderdev.net/ecosform. Starting from project scaffolding through a fully deployed three-party signature workflow with admin dashboard, culminating in a Docker-deployed demo impressive enough to pitch to state executives.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Foundation** *(Complete)* - Project scaffolding, Docker config, Tailwind design system, dev environment
- [ ] **Phase 2: Database & API** - Supabase schema, PostgREST endpoints, RLS policies
- [ ] **Phase 3: Form UI** - Agreement form with both tracks, security content, access groups
- [ ] **Phase 4: Signature Workflow** - Three-party signing flow, audit metadata, typed-name signatures
- [ ] **Phase 5: Role Switcher & Demo** - Perspective switching UI, fictional data seeding, demo experience
- [ ] **Phase 6: Admin Dashboard** - Compliance status, pending approvals, audit trail viewer
- [ ] **Phase 7: Deployment & Polish** - Docker deploy, nginx-proxy routing, responsive QA, final polish

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
- [ ] 02-01: Schema design — forms, agreements, signatures, audit_log tables
- [ ] 02-02: PostgREST API layer — endpoints for CRUD operations, signature submission, workflow transitions
- [ ] 02-03: RLS policies and role simulation — row-level security for demo role switching

### Phase 3: Form UI
**Goal**: Complete, interactive ECOS agreement form with New/Updated User and Annual Renewal tracks, streamlined security content (pages 9-11), access group checkboxes, and form validation
**Depends on**: Phase 1 (design system), Phase 2 (API for persistence)
**Research**: Unlikely (internal UI using design tokens from Phase 1)
**Plans**: TBD

Plans:
- [ ] 03-01: Form structure — track selection (New/Updated vs Annual Renewal), employee info fields, department fields
- [ ] 03-02: Security agreement content — streamlined display of security requirements, acknowledgment sections
- [ ] 03-03: Access groups and validation — ECOS user group checkboxes, form validation, error states

### Phase 4: Signature Workflow
**Goal**: Working three-party signature flow (Employee → Manager → Admin) with typed-name signatures, "I certify" checkboxes, full audit metadata capture (timestamp, IP, user agent, session hash, form version hash)
**Depends on**: Phase 2 (API), Phase 3 (form)
**Research**: Unlikely (UETA/SAM 1734 requirements well-defined in PROJECT.md; signature UX is straightforward)
**Plans**: TBD

Plans:
- [ ] 04-01: Signature component — typed-name input, certification checkbox, audit metadata capture
- [ ] 04-02: Workflow engine — state machine for Employee → Manager → Admin transitions, status tracking
- [ ] 04-03: Workflow UI — pending/completed states, signature timeline, workflow status indicators

### Phase 5: Role Switcher & Demo
**Goal**: Role switcher UI letting demo viewers freely switch between Employee, Manager, and Admin perspectives; fictional demo data pre-seeded; smooth demo experience for executive presentations
**Depends on**: Phase 3 (form), Phase 4 (workflow)
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: Role switcher UI — persistent role selector, context-aware view switching
- [ ] 05-02: Demo data seeding — fictional employees/departments, pre-populated agreements in various workflow states
- [ ] 05-03: Demo polish — guided flow hints, smooth transitions between perspectives

### Phase 6: Admin Dashboard
**Goal**: Admin view showing compliance status across departments, pending approval queue, and full audit trail viewer with search/filter
**Depends on**: Phase 2 (API), Phase 4 (workflow data), Phase 5 (role switcher)
**Research**: Unlikely (internal dashboard using existing API and data)
**Plans**: TBD

Plans:
- [ ] 06-01: Compliance overview — department compliance rates, expiring agreements, status summary cards
- [ ] 06-02: Approval queue — pending signatures list, one-click approve workflow
- [ ] 06-03: Audit trail viewer — searchable/filterable log of all signature events and form changes

### Phase 7: Deployment & Polish
**Goal**: Production Docker deployment at vanderdev.net/ecosform with nginx-proxy auto-discovery, responsive design verified on mobile/desktop, final QA pass
**Depends on**: All previous phases
**Research**: Likely (VPS Docker deployment specifics, nginx-proxy VIRTUAL_PATH label configuration)
**Research topics**: Docker label configuration for nginx-proxy routing on existing VPS stack, SSL auto-provisioning for subpath, container resource limits
**Plans**: TBD

Plans:
- [ ] 07-01: Docker production build — Dockerfile, multi-stage build, VIRTUAL_PATH=/ecosform label
- [ ] 07-02: VPS deployment — push to VPS, nginx-proxy integration, SSL verification
- [ ] 07-03: Responsive polish and QA — mobile/desktop testing, animation polish, final demo walkthrough

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-02-06 |
| 2. Database & API | 0/3 | Not started | - |
| 3. Form UI | 0/3 | Not started | - |
| 4. Signature Workflow | 0/3 | Not started | - |
| 5. Role Switcher & Demo | 0/3 | Not started | - |
| 6. Admin Dashboard | 0/3 | Not started | - |
| 7. Deployment & Polish | 0/3 | Not started | - |
