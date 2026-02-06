---
phase: 07-deployment-polish
plan: 02
subsystem: infra
tags: [docker, nginx-proxy, vps, supabase, kong, ssl, deployment]

# Dependency graph
requires:
  - phase: 07-deployment-polish
    plan: 01
    provides: Dockerfile, docker-compose.prod.yml, nginx.conf, .env.production.example
  - phase: 02-database-api
    provides: ecos schema, Supabase client config, PostgREST endpoints
provides:
  - Live production deployment at vanderdev.net/ecosform
  - Supabase API proxy through nginx-proxy with valid SSL
  - VPS deployment workflow (clone → env → build → run)
affects: [07-03-responsive-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [nginx-proxy-vhost-location-override, supabase-ssl-proxy-passthrough, docker-healthcheck-ipv4]

key-files:
  created: []
  modified: [Dockerfile, docker-compose.prod.yml]

key-decisions:
  - "Manual vhost.d location config instead of VIRTUAL_PATH label auto-discovery"
  - "Path-based Supabase proxy (/supabase/) instead of subdomain"
  - "127.0.0.1 instead of localhost in Alpine healthchecks"
  - "n8n-cloud-stack_frontend as the external Docker network name"

patterns-established:
  - "VPS nginx-proxy custom routes: /var/lib/docker/volumes/n8n-cloud-stack_vhost/_data/{domain}_location"
  - "Supabase browser access: proxy Kong HTTP through nginx-proxy for valid SSL"

issues-created: []

# Metrics
duration: 28min
completed: 2026-02-06
---

# Phase 7 Plan 2: VPS Deployment Summary

**ECOS deployed at vanderdev.net/ecosform with Supabase API proxied through nginx-proxy for browser-valid SSL**

## Performance

- **Duration:** 28 min
- **Started:** 2026-02-06T19:08:16Z
- **Completed:** 2026-02-06T19:36:00Z
- **Tasks:** 2 auto + 1 human-verify checkpoint
- **Files modified:** 2 (local), 3 (VPS-only)

## Accomplishments
- ECOS container deployed and healthy on VPS at vanderdev.net/ecosform
- Supabase API accessible from browser via path-based proxy with valid Let's Encrypt SSL
- All 8 employees, 15 agreements, and full seed data loading from VPS Supabase
- Human-verified: app loads, role switcher visible, data flowing

## Task Commits

Each task was committed atomically:

1. **Task 1: Push code and deploy container on VPS** — `419f3db` (fix) — network name correction
2. **Task 1 cont: Fix healthcheck IPv4** — `7707f1f` (fix) — Alpine localhost → 127.0.0.1

**Plan metadata:** (pending — this commit)

## Files Created/Modified
- `Dockerfile` — Changed healthcheck from `localhost` to `127.0.0.1` (Alpine resolves localhost to IPv6 ::1)
- `docker-compose.prod.yml` — Added `name: n8n-cloud-stack_frontend` to network definition

**VPS-only files (not in repo):**
- `/var/lib/docker/volumes/n8n-cloud-stack_vhost/_data/vanderdev.net_location` — Custom nginx location blocks for /ecosform/ and /supabase/ proxy routes
- `/root/Automation/ECOS/.env.production` — VITE_SUPABASE_URL=https://vanderdev.net/supabase + ANON_KEY

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Manual vhost.d location config | nginx-proxy's VIRTUAL_PATH label auto-discovery silently failed — docker-gen processed events but didn't add the route. Manual `vanderdev.net_location` file is reliable and explicit. |
| Path-based Supabase proxy (`/supabase/`) | Kong's self-signed SSL cert on port 8443 is rejected by browsers. Routing through nginx-proxy at `/supabase/` → `supabase-kong:8000` gives valid Let's Encrypt SSL. No DNS changes needed. |
| `127.0.0.1` in healthcheck | Alpine Linux resolves `localhost` to `::1` (IPv6), but nginx listens on `0.0.0.0:80` (IPv4). `wget -qO- http://127.0.0.1:80/` forces IPv4. |
| `n8n-cloud-stack_frontend` network | VPS Docker network is named by the compose project prefix. The docker-compose.prod.yml `name:` field maps the local alias `nginx-proxy` to the actual network name. |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Wrong Docker network name**
- **Found during:** Task 1 (deploy container)
- **Issue:** docker-compose.prod.yml referenced `nginx-proxy` as external network, but VPS uses `n8n-cloud-stack_frontend`
- **Fix:** Added `name: n8n-cloud-stack_frontend` to network definition
- **Verification:** Container joined correct network, visible to nginx-proxy
- **Committed in:** `419f3db`

**2. [Rule 3 - Blocking] nginx-proxy VIRTUAL_PATH auto-discovery failure**
- **Found during:** Task 1 (verify nginx-proxy routing)
- **Issue:** docker-gen processed container events but generated config "did not change" — VIRTUAL_PATH label silently ignored
- **Fix:** Created manual `vanderdev.net_location` in vhost.d volume with explicit `location /ecosform/` and `proxy_pass http://ecos-form:80/`
- **Verification:** `curl https://vanderdev.net/ecosform/` returns app HTML
- **VPS-only change** (no repo commit needed)

**3. [Rule 3 - Blocking] Healthcheck failing — Alpine IPv6 resolution**
- **Found during:** Task 1 (container showing "unhealthy")
- **Issue:** `wget -qO- http://localhost:80/` fails because Alpine resolves `localhost` to `::1` but nginx listens on IPv4 only
- **Fix:** Changed to `wget -qO- http://127.0.0.1:80/`
- **Verification:** Container status: healthy
- **Committed in:** `7707f1f`

**4. [Rule 3 - Blocking] Supabase self-signed SSL cert rejected by browsers**
- **Found during:** Checkpoint (user reported blank page)
- **Issue:** VITE_SUPABASE_URL pointed to `https://212.38.95.33:8443` — Kong's self-signed cert works with `curl -sk` but browsers refuse the connection, so Supabase JS client fails silently
- **Fix:** Added `/supabase/` proxy route in vhost.d config → `supabase-kong:8000`, changed VITE_SUPABASE_URL to `https://vanderdev.net/supabase`, rebuilt container
- **Verification:** `curl https://vanderdev.net/supabase/rest/v1/employees` returns all 8 employees; user confirmed app loads with data
- **VPS-only change** (no repo commit needed)

---

**Total deviations:** 4 (all blocking, all auto-fixed)
**Impact on plan:** All fixes necessary for deployment to function. Core plan tasks executed as designed; deviations were infrastructure discovery issues only resolvable at deploy time.

## Issues Encountered
- 64 unpushed local commits discovered — pushed before VPS clone
- ecos schema already existed on VPS Supabase (from earlier Phase 2 work) — no migrations needed
- Docker daemon not available on dev machine (same as 07-01) — all builds done on VPS

## Next Phase Readiness
- Production deployment live and verified at https://vanderdev.net/ecosform/
- App loads, role switching works, data persists to VPS Supabase
- Ready for 07-03: Responsive polish and QA
- User noted "significant work needed to make this useable" — 07-03 scope may expand

---
*Phase: 07-deployment-polish*
*Completed: 2026-02-06*
