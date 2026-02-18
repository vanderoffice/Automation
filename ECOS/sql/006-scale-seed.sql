-- ECOS Security Agreement Modernization
-- Migration 006: Scale seed data for demo at 50+ agreements
-- Adds 2 departments, 16 employees, 40 agreements with matching signatures and audit log.
-- Uses PL/pgSQL DO block to auto-generate signatures and audit entries from agreement definitions.
-- All names are fictional — no PII.

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- Departments (2 new — total: 6)
-- =============================================================
INSERT INTO ecos.departments (id, name, code) VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'Department of Finance', 'DOF'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'Employment Development Department', 'EDD')
ON CONFLICT (code) DO NOTHING;

-- =============================================================
-- Employees (16 new — total: 24)
-- =============================================================
INSERT INTO ecos.employees (id, employee_number, first_name, last_name, email, title, department_id, role) VALUES
  -- DOF: 2 employees, 1 manager, 1 admin
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0009', 'EMP-009', 'Riley',   'Torres',   'riley.torres@example.gov',   'Data Analyst',          'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0010', 'EMP-010', 'Avery',   'Patel',    'avery.patel@example.gov',    'Budget Specialist',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0011', 'EMP-011', 'Quinn',   'Foster',   'quinn.foster@example.gov',   'Fiscal Manager',        'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0012', 'EMP-012', 'Reese',   'Coleman',  'reese.coleman@example.gov',  'Finance Director',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'admin'),
  -- EDD: 2 employees, 1 manager, 1 admin
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0013', 'EMP-013', 'Dakota',  'Singh',    'dakota.singh@example.gov',   'Claims Specialist',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0014', 'EMP-014', 'Jamie',   'Okafor',   'jamie.okafor@example.gov',   'Benefits Analyst',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0015', 'EMP-015', 'Skyler',  'Young',    'skyler.young@example.gov',   'Claims Supervisor',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0016', 'EMP-016', 'Finley',  'Dunn',     'finley.dunn@example.gov',    'EDD Administrator',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'admin'),
  -- ODI: 2 more employees
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0017', 'EMP-017', 'Rowan',   'Ellis',    'rowan.ellis@example.gov',    'Policy Analyst',        'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0021', 'EMP-021', 'Sage',    'Morales',  'sage.morales@example.gov',   'DevOps Engineer',       'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  -- CDT: 2 more employees
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0018', 'EMP-018', 'Blair',   'Santos',   'blair.santos@example.gov',   'Network Engineer',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0022', 'EMP-022', 'Phoenix', 'Nakamura', 'phoenix.nakamura@example.gov','Systems Admin',         'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  -- CALHR: 2 more employees
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0019', 'EMP-019', 'Harper',  'Reed',     'harper.reed@example.gov',    'HR Specialist',         'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0023', 'EMP-023', 'Emery',   'Walsh',    'emery.walsh@example.gov',    'Benefits Coordinator',  'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'employee'),
  -- SCO: 2 more employees
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0020', 'EMP-020', 'Cameron', 'Liu',      'cameron.liu@example.gov',    'Accounting Tech',       'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0024', 'EMP-024', 'Kendall', 'Odom',     'kendall.odom@example.gov',   'Audit Specialist',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee')
ON CONFLICT (employee_number) DO NOTHING;

-- =============================================================
-- Agreements (40 new — total: 53) + Signatures + Audit Log
-- Generated procedurally from a compact definition table.
-- =============================================================
DO $$
DECLARE
  agr_pfx text := 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa';
  emp_pfx text := 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee';
  sig_pfx text := 'aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa';
  log_pfx text := 'aaaaaaaa-bbbb-cccc-1111-bbbbbbbb';

  sig_seq int := 23;
  log_seq int := 39;

  agr_id  uuid;
  emp_id  uuid;
  mgr_id  uuid;
  adm_id  uuid;
  emp_nm  text;
  mgr_nm  text;
  adm_nm  text;
  fy      text;

  r RECORD;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      -- (agr#, emp#, track, status, supervisor, created_d, emp_sign_d, mgr_sign_d, completed_d, expires_d)
      -- NULLs mean "not yet reached that workflow step"

      -- DRAFT (3)
      (14, 9,  'new_updated',    'draft',            'Quinn Foster',  3,   NULL::int, NULL::int, NULL::int, NULL::int),
      (15, 13, 'annual_renewal', 'draft',            'Skyler Young',  2,   NULL, NULL, NULL, NULL),
      (16, 21, 'new_updated',    'draft',            'Morgan Hayes',  1,   NULL, NULL, NULL, NULL),

      -- PENDING_EMPLOYEE (5)
      (17, 10, 'new_updated',    'pending_employee', 'Quinn Foster',  2,   NULL, NULL, NULL, NULL),
      (18, 14, 'annual_renewal', 'pending_employee', 'Skyler Young',  3,   NULL, NULL, NULL, NULL),
      (19, 17, 'new_updated',    'pending_employee', 'Morgan Hayes',  1,   NULL, NULL, NULL, NULL),
      (20, 18, 'new_updated',    'pending_employee', 'Taylor Brooks', 4,   NULL, NULL, NULL, NULL),
      (21, 19, 'annual_renewal', 'pending_employee', 'Morgan Hayes',  2,   NULL, NULL, NULL, NULL),

      -- PENDING_MANAGER (7)
      (22, 20, 'new_updated',    'pending_manager',  'Morgan Hayes',  8,   6,  NULL, NULL, NULL),
      (23, 24, 'annual_renewal', 'pending_manager',  'Morgan Hayes',  5,   3,  NULL, NULL, NULL),
      (24, 22, 'new_updated',    'pending_manager',  'Taylor Brooks', 10,  7,  NULL, NULL, NULL),
      (25, 23, 'new_updated',    'pending_manager',  'Morgan Hayes',  6,   4,  NULL, NULL, NULL),
      (26, 9,  'annual_renewal', 'pending_manager',  'Quinn Foster',  9,   5,  NULL, NULL, NULL),
      (27, 13, 'new_updated',    'pending_manager',  'Skyler Young',  7,   3,  NULL, NULL, NULL),
      (28, 17, 'annual_renewal', 'pending_manager',  'Morgan Hayes',  12,  9,  NULL, NULL, NULL),

      -- PENDING_ADMIN (5)
      (29, 10, 'annual_renewal', 'pending_admin',    'Quinn Foster',  14,  12, 6,  NULL, NULL),
      (30, 14, 'new_updated',    'pending_admin',    'Skyler Young',  16,  14, 7,  NULL, NULL),
      (31, 18, 'annual_renewal', 'pending_admin',    'Taylor Brooks', 11,  9,  5,  NULL, NULL),
      (32, 20, 'annual_renewal', 'pending_admin',    'Morgan Hayes',  18,  16, 10, NULL, NULL),
      (33, 21, 'new_updated',    'pending_admin',    'Morgan Hayes',  13,  11, 8,  NULL, NULL),

      -- COMPLETED (20) — varied expiry dates for dashboard demo
      (34, 9,  'new_updated',    'completed', 'Quinn Foster',  45,  43, 38, 35, 330),
      (35, 10, 'new_updated',    'completed', 'Quinn Foster',  50,  48, 43, 40, 325),
      (36, 13, 'new_updated',    'completed', 'Skyler Young',  55,  53, 47, 42, 323),
      (37, 14, 'new_updated',    'completed', 'Skyler Young',  48,  46, 41, 38, 327),
      (38, 17, 'annual_renewal', 'completed', 'Morgan Hayes',  40,  38, 35, 32, 333),
      (39, 18, 'annual_renewal', 'completed', 'Taylor Brooks', 38,  36, 33, 30, 335),
      (40, 19, 'new_updated',    'completed', 'Morgan Hayes',  35,  33, 30, 28, 337),
      (41, 20, 'new_updated',    'completed', 'Morgan Hayes',  42,  40, 37, 34, 331),
      (42, 24, 'annual_renewal', 'completed', 'Morgan Hayes',  52,  50, 47, 44, 321),
      (43, 22, 'new_updated',    'completed', 'Taylor Brooks', 33,  31, 28, 25, 340),
      (44, 23, 'annual_renewal', 'completed', 'Morgan Hayes',  36,  34, 31, 29, 336),
      (45, 21, 'annual_renewal', 'completed', 'Morgan Hayes',  44,  42, 39, 36, 329),
      -- Soon-to-expire / expired — makes "Expiring Soon" section interesting
      (46, 1,  'annual_renewal', 'completed', 'Morgan Hayes',  380, 378, 375, 370, -5),
      (47, 2,  'new_updated',    'completed', 'Taylor Brooks', 375, 373, 370, 365, 0),
      (48, 3,  'annual_renewal', 'completed', 'Morgan Hayes',  350, 348, 345, 340, 25),
      (49, 4,  'annual_renewal', 'completed', 'Morgan Hayes',  340, 338, 335, 330, 35),
      (50, 9,  'annual_renewal', 'completed', 'Quinn Foster',  60,  58, 53, 50, 15),
      (51, 13, 'annual_renewal', 'completed', 'Skyler Young',  58,  56, 51, 48, 60),
      (52, 24, 'new_updated',    'completed', 'Morgan Hayes',  56,  54, 49, 46, 80),
      (53, 22, 'annual_renewal', 'completed', 'Taylor Brooks', 54,  52, 48, 45, 55)
    ) AS t(agr_num, emp_num, track, status, supervisor, created_d, emp_sign_d, mgr_sign_d, completed_d, expires_d)
  LOOP
    agr_id := (agr_pfx || lpad(r.agr_num::text, 3, '0'))::uuid;
    emp_id := (emp_pfx || lpad(r.emp_num::text, 4, '0'))::uuid;

    -- Look up employee name
    SELECT first_name || ' ' || last_name INTO emp_nm FROM ecos.employees WHERE id = emp_id;

    -- Find same-department manager; fall back to Morgan Hayes
    SELECT e2.id, e2.first_name || ' ' || e2.last_name INTO mgr_id, mgr_nm
    FROM ecos.employees e1 JOIN ecos.employees e2 ON e2.department_id = e1.department_id AND e2.role = 'manager'
    WHERE e1.id = emp_id LIMIT 1;
    IF mgr_id IS NULL THEN
      mgr_id := (emp_pfx || '0005')::uuid;
      mgr_nm := 'Morgan Hayes';
    END IF;

    -- Find same-department admin; fall back to Casey Nguyen
    SELECT e2.id, e2.first_name || ' ' || e2.last_name INTO adm_id, adm_nm
    FROM ecos.employees e1 JOIN ecos.employees e2 ON e2.department_id = e1.department_id AND e2.role = 'admin'
    WHERE e1.id = emp_id LIMIT 1;
    IF adm_id IS NULL THEN
      adm_id := (emp_pfx || '0007')::uuid;
      adm_nm := 'Casey Nguyen';
    END IF;

    -- Fiscal year: old agreements get prior year
    fy := CASE WHEN r.created_d > 200 THEN '2024-2025' ELSE '2025-2026' END;

    -- Insert agreement
    IF r.status = 'completed' THEN
      INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
      VALUES (agr_id, emp_id, r.track, r.status, fy, r.supervisor,
        '(916) 555-' || lpad(r.emp_num::text, 4, '0'), 'Sacramento HQ', 'sha256_v1_demo_abc123',
        now() - (r.created_d || ' days')::interval,
        now() - (r.completed_d || ' days')::interval,
        now() - (r.completed_d || ' days')::interval,
        now() + (r.expires_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
    ELSE
      INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
      VALUES (agr_id, emp_id, r.track, r.status, fy, r.supervisor,
        '(916) 555-' || lpad(r.emp_num::text, 4, '0'), 'Sacramento HQ', 'sha256_v1_demo_abc123',
        now() - (r.created_d || ' days')::interval,
        now() - (coalesce(r.emp_sign_d, r.created_d) || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Audit: agreement_submitted (all non-draft)
    IF r.status != 'draft' THEN
      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, emp_id, 'agreement_submitted',
        '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb,
        now() - (r.created_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;

    -- Employee signature + audit (pending_manager, pending_admin, completed)
    IF r.status IN ('pending_manager', 'pending_admin', 'completed') THEN
      INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
      VALUES ((sig_pfx || lpad(sig_seq::text, 3, '0'))::uuid, agr_id, emp_id, 'employee', emp_nm, true, 'sha256_v1_demo_abc123',
        now() - (r.emp_sign_d || ' days')::interval)
      ON CONFLICT (agreement_id, signer_role) DO NOTHING;
      sig_seq := sig_seq + 1;

      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, emp_id, 'signature_recorded',
        '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb,
        now() - (r.emp_sign_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;

    -- Manager signature + audit (pending_admin, completed)
    IF r.status IN ('pending_admin', 'completed') THEN
      INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
      VALUES ((sig_pfx || lpad(sig_seq::text, 3, '0'))::uuid, agr_id, mgr_id, 'manager', mgr_nm, true, 'sha256_v1_demo_abc123',
        now() - (r.mgr_sign_d || ' days')::interval)
      ON CONFLICT (agreement_id, signer_role) DO NOTHING;
      sig_seq := sig_seq + 1;

      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, mgr_id, 'signature_recorded',
        '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb,
        now() - (r.mgr_sign_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;

    -- Admin signature + audit + completed event (completed only)
    IF r.status = 'completed' THEN
      INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
      VALUES ((sig_pfx || lpad(sig_seq::text, 3, '0'))::uuid, agr_id, adm_id, 'admin', adm_nm, true, 'sha256_v1_demo_abc123',
        now() - (r.completed_d || ' days')::interval)
      ON CONFLICT (agreement_id, signer_role) DO NOTHING;
      sig_seq := sig_seq + 1;

      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, adm_id, 'signature_recorded',
        '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb,
        now() - (r.completed_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;

      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, adm_id, 'agreement_completed',
        format('{"agreement_id": "%s"}', agr_id)::jsonb,
        now() - (r.completed_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;

  END LOOP;

  RAISE NOTICE 'Scale seed complete: inserted 40 agreements, % signatures, % audit entries',
    sig_seq - 23, log_seq - 39;
END;
$$;

COMMIT;
