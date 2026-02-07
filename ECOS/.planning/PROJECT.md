# ECOS Security Agreement Modernization

## What This Is

A web-based replacement for CalHR's ECOS Security Agreement PDF form, deployed as a demo at `vanderdev.net/ecosform`. State employees currently sign a 14-page PDF through Adobe Sign with PKI certificates -- a process that is legally unnecessary and creates compliance friction across 160+ state agencies. This demo proves the concept: a polished, legally sufficient web form with a working three-party signature workflow backed by a real database.

Built as the first project in a reusable government form automation platform.

## Core Value

A visually compelling, fully functional demo that makes the current PDF process look obsolete -- polished enough to pitch to executives and backed by real data persistence.

## Requirements

### Validated

All requirements shipped and verified at vanderdev.net/ecosform:

- [x] Polished web form UI matching vanderdev.net design language (dark theme, orange accents, Inter/JetBrains Mono, Tailwind CSS)
- [x] Two form tracks: New/Updated User and Annual Renewal
- [x] Three-party signature workflow: Employee -> Manager -> Department Admin
- [x] Role switcher UI allowing demo viewers to experience all three perspectives
- [x] Typed-name signature with "I certify" checkbox (legally sufficient under UETA/SAM 1734)
- [x] Full audit metadata capture per signature (timestamp, IP, user agent, session hash, form version hash)
- [x] Supabase PostgREST backend for real data persistence and audit trail
- [x] Admin dashboard showing compliance status, pending approvals, and audit trail
- [x] Streamlined agreement content: all security requirements + admin responsibilities shown in full, administrative filler removed
- [x] Access group assignment by manager during approval step (moved from employee self-selection -- least-privilege by design)
- [x] Docker container deployment with VIRTUAL_PATH=/ecosform label for nginx-proxy routing
- [x] Responsive design -- works on mobile and desktop
- [x] No PII in demo data -- use fictional employee names and departments

### Active

(None -- all requirements shipped)

### Out of Scope

- Real SSO/state authentication integration -- simulated auth for demo purposes
- Email notifications -- workflow transitions shown in-app only
- PDF generation of completed agreements -- database is the record
- CalHR API integration -- standalone demo, not connected to real ECOS
- Real CalHR branding/logo -- uses vanderdev.net design language instead

## Context

### The Problem Being Solved

The ECOS Security Agreement requires annual renewal by every state employee with ECOS access (~200,000+ annually across 160+ entities). The current process:
1. 14-page PDF form filled manually
2. Adobe Sign with PKI digital certificates (requires state computer)
3. Three sequential signatures routed via email
4. Completed PDFs scattered across departmental file shares
5. Annual SARC reconciliation done manually

### Legal Foundation

PKI-level signatures are NOT required for internal policy acknowledgments:
- **SAM 1734** mandates e-signatures (not digital signatures) as default
- **UETA (Civ. Code 1633.7)** validates typed names and click-to-agree
- **Gov. Code 16.5(e)-(f)** explicitly says PKI is optional
- **CalPERS, FI$Cal, SCO** all use simpler methods for comparable agreements

### Target Audience

State department executives and CalHR leadership. The demo must be impressive enough to greenlight a pilot program.

### Pitch Document

Detailed writeup with full legal analysis, business case, and implementation plan:
`~/Documents/ecos-modernization-pitch.md`

### Design Language

Match vanderdev.net aesthetic:
- **Background:** #050505 (near-black)
- **Cards:** #0b0b0b with neutral-800 borders
- **Accent:** #f97316 (orange) for highlights, active states, glows
- **Fonts:** Inter (body), JetBrains Mono (code/data)
- **Effects:** `.glow-text`, `.glow-box` hover effects, fadeIn animations
- **Status colors:** green-500 (success), red-500 (error), yellow-500 (warning)
- **Framework:** Tailwind CSS 3

### Platform Vision

This is the first project in a reusable form automation platform. Architecture should support future form conversions with:
- Shared Supabase schema patterns (forms, workflows, signatures, audit)
- Reusable signature components
- Consistent deployment pattern (Docker + VIRTUAL_PATH labels)

## Constraints

- **Hosting:** VPS at vanderdev.net -- Ubuntu 24.04, Docker, nginx-proxy with auto-SSL, limited vCPU/RAM (no heavy compute)
- **Database:** Existing Supabase stack on VPS -- use PostgREST API, create dedicated schema
- **Routing:** Docker label `VIRTUAL_PATH=/ecosform` for nginx-proxy auto-discovery
- **Repo:** `vanderoffice/Automation` GitHub repo, code lives in `ECOS/` directory
- **No PII:** All demo data uses fictional names, emails, departments
- **Design:** Must match vanderdev.net look and feel -- dark theme, orange accents, Inter font

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Separate repo (Automation) vs. vanderdev-website | Clean separation; forms platform has different purpose than infra dashboard; executive isolation; future-proof for more forms | Automation repo with ECOS/ directory |
| Docker label routing vs. manual nginx config | Consistent with existing VPS pattern; auto-discovery; no manual config edits per form | Docker labels + manual vhost.d fallback (labels silently failed) |
| Supabase PostgREST API vs. direct PostgreSQL | Cleanest integration; row-level security; RESTful; no custom backend ORM needed | Supabase PostgREST with ecos schema |
| Typed-name signature vs. drawn signature | Legally equivalent under UETA; faster; accessible; matches CalPERS/FI$Cal precedent | Typed-name with "I certify" checkbox |
| Role switcher vs. separate URLs vs. guided walkthrough | Role switcher lets executive freely explore all perspectives in one session; most intuitive for demo | Sidebar role switcher with employee selector |
| Frontend-only vs. lightweight backend vs. full Supabase | Full Supabase provides real persistence, real audit trail, most impressive for exec demo; reusable for future forms | Full Supabase stack |
| Per-section acknowledgment vs. single certification | UETA/SAM 5320 + CalHR STD 270 research: single certification is legally sufficient and matches state form precedent | Single acknowledgment checkbox |
| Employee self-selects access groups vs. manager assigns | Employees shouldn't self-select their own permission levels; least-privilege principle | Manager assigns during approval step |
| Conditional admin section vs. show all content | Full transparency — all employees see all security requirements; access groups assigned post-submission | All content shown to all employees |

---
*Last updated: 2026-02-07 — all requirements shipped*
