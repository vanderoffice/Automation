[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# Automation

Digitizing manual government processes into modern web applications.

---

## ECOS — Employee Compliance Onboarding System

**Live →** [vanderdev.net/ecosform](https://vanderdev.net/ecosform)

A role-based employee onboarding system that replaces paper-based cybersecurity compliance forms with an interactive workflow application.

### What It Does

- **Multi-step form wizard** — department selection, employee info, security requirements, access groups, and digital signatures
- **Role-based access** for employees, supervisors, and IT security staff
- **Workflow tracking** with status badges, progress dots, and audit timelines
- **Dashboard** for department-level agreement monitoring
- **Production demo:** 6 departments · 24 employees · 53 agreements

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 · Vite · Tailwind CSS |
| Backend | Supabase (PostgREST) |
| Database | PostgreSQL (`ecos` schema) |
| Hosting | Docker (nginx:alpine) behind nginx-proxy |
| CI/CD | Git push → Docker Compose rebuild on VPS |

### Project Structure

```
ECOS/
├── src/
│   ├── components/
│   │   ├── form/           # AgreementForm, FormStepper, SignatureBlock
│   │   ├── ui/             # Button, Card, TabBar, Badge, Select
│   │   └── workflow/       # WorkflowTimeline, StatusBadge, MiniProgressDots
│   ├── pages/              # AgreementPage, DashboardPage, WorkflowPage
│   ├── lib/
│   │   ├── api/            # Supabase API modules
│   │   └── supabase.js     # Client initialization
│   ├── data/               # Access groups, security requirements
│   └── context/            # Role-based context provider
├── sql/                    # Schema migrations + demo reset
├── docker-compose.prod.yml
├── Dockerfile              # Multi-stage build
├── nginx.conf
└── .planning/              # GSD project artifacts
```

### Deployment

```bash
git push origin main
ssh vps "cd /root/Automation/ECOS && git pull && docker compose -f docker-compose.prod.yml up -d --build"
```

### Demo Reset

```bash
ssh vps "cat /root/Automation/ECOS/sql/099-reset-demo.sql | \
  docker exec -i supabase-db psql -U postgres -d postgres"
```

---

## License

MIT
