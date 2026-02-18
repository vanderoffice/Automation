-- ECOS Security Agreement Modernization
-- Script 099: Reset demo to clean seeded state
-- Self-contained: truncates all data, then re-inserts everything from 004 + 005.
-- Run before demo presentations for a pristine starting point.
-- All names are fictional — no PII.

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- TRUNCATE all ecos tables (CASCADE handles FK dependencies)
-- =============================================================
TRUNCATE
  ecos.audit_log,
  ecos.signatures,
  ecos.agreement_access_groups,
  ecos.agreements,
  ecos.employees,
  ecos.departments,
  ecos.form_versions
CASCADE;

-- =============================================================
-- Departments (4) — from 004
-- =============================================================
INSERT INTO ecos.departments (id, name, code)
VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'Office of Digital Innovation', 'ODI'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'Department of Technology', 'CDT'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'CalHR Human Resources', 'CALHR'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'State Controller''s Office', 'SCO'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'Department of Finance', 'DOF'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'Employment Development Department', 'EDD')
ON CONFLICT (code) DO NOTHING;

-- =============================================================
-- Employees (8) — from 004
-- =============================================================
INSERT INTO ecos.employees (id, employee_number, first_name, last_name, email, title, department_id, role)
VALUES
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'EMP-001', 'Alex', 'Rivera', 'alex.rivera@example.gov', 'IT Specialist', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'EMP-002', 'Jordan', 'Chen', 'jordan.chen@example.gov', 'Systems Analyst', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'EMP-003', 'Sam', 'Washington', 'sam.washington@example.gov', 'Security Analyst', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'EMP-004', 'Pat', 'Kim', 'pat.kim@example.gov', 'Fiscal Officer', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'EMP-005', 'Morgan', 'Hayes', 'morgan.hayes@example.gov', 'IT Manager', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'EMP-006', 'Taylor', 'Brooks', 'taylor.brooks@example.gov', 'Tech Lead', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'EMP-007', 'Casey', 'Nguyen', 'casey.nguyen@example.gov', 'HR Administrator', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'admin'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'EMP-008', 'Drew', 'Martinez', 'drew.martinez@example.gov', 'Audit Manager', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'admin'),
  -- DOF
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0009', 'EMP-009', 'Riley',   'Torres',   'riley.torres@example.gov',   'Data Analyst',          'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0010', 'EMP-010', 'Avery',   'Patel',    'avery.patel@example.gov',    'Budget Specialist',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0011', 'EMP-011', 'Quinn',   'Foster',   'quinn.foster@example.gov',   'Fiscal Manager',        'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0012', 'EMP-012', 'Reese',   'Coleman',  'reese.coleman@example.gov',  'Finance Director',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0005', 'admin'),
  -- EDD
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0013', 'EMP-013', 'Dakota',  'Singh',    'dakota.singh@example.gov',   'Claims Specialist',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0014', 'EMP-014', 'Jamie',   'Okafor',   'jamie.okafor@example.gov',   'Benefits Analyst',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0015', 'EMP-015', 'Skyler',  'Young',    'skyler.young@example.gov',   'Claims Supervisor',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0016', 'EMP-016', 'Finley',  'Dunn',     'finley.dunn@example.gov',    'EDD Administrator',     'aaaaaaaa-bbbb-cccc-dddd-dddddddd0006', 'admin'),
  -- ODI (additional)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0017', 'EMP-017', 'Rowan',   'Ellis',    'rowan.ellis@example.gov',    'Policy Analyst',        'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0021', 'EMP-021', 'Sage',    'Morales',  'sage.morales@example.gov',   'DevOps Engineer',       'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  -- CDT (additional)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0018', 'EMP-018', 'Blair',   'Santos',   'blair.santos@example.gov',   'Network Engineer',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0022', 'EMP-022', 'Phoenix', 'Nakamura', 'phoenix.nakamura@example.gov','Systems Admin',         'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  -- CALHR (additional)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0019', 'EMP-019', 'Harper',  'Reed',     'harper.reed@example.gov',    'HR Specialist',         'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0023', 'EMP-023', 'Emery',   'Walsh',    'emery.walsh@example.gov',    'Benefits Coordinator',  'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'employee'),
  -- SCO (additional)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0020', 'EMP-020', 'Cameron', 'Liu',      'cameron.liu@example.gov',    'Accounting Tech',       'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0024', 'EMP-024', 'Kendall', 'Odom',     'kendall.odom@example.gov',   'Audit Specialist',      'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee')
ON CONFLICT (employee_number) DO NOTHING;

-- =============================================================
-- Form Versions (1) — from 004
-- =============================================================
INSERT INTO ecos.form_versions (id, version_hash, version_label, content_snapshot)
VALUES
  ('aaaaaaaa-bbbb-cccc-ffff-ffffffffffff', 'sha256_v1_demo_abc123', 'v1.0', '{"title": "ECOS Security Agreement Form", "version": "1.0"}'::jsonb)
ON CONFLICT (version_hash) DO NOTHING;

-- =============================================================
-- Agreements (13 total: 3 from 004 + 10 from 005)
-- =============================================================

-- Agreement 1: Alex Rivera — draft (from 004)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa001', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'new_updated', 'draft', '2024-2025', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '5 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 2: Jordan Chen — pending_manager (from 004)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'pending_manager', '2024-2025', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '3 days', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 3: Sam Washington — completed (from 004)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'new_updated', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '10 days', now() - interval '2 days', now() - interval '2 days', now() + interval '365 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 4: Alex Rivera — pending_employee (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa004', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'new_updated', 'pending_employee', '2025-2026', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '1 day', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 5: Alex Rivera — completed, prior year (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'annual_renewal', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '28 days', now() - interval '20 days', now() - interval '20 days', now() + interval '345 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 6: Jordan Chen — completed, prior year (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'completed', '2024-2025', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '25 days', now() - interval '18 days', now() - interval '18 days', now() + interval '347 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 7: Pat Kim — pending_admin (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'new_updated', 'pending_admin', '2025-2026', 'Morgan Hayes', '(916) 555-0404', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '12 days', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 8: Sam Washington — pending_manager (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'new_updated', 'pending_manager', '2025-2026', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '7 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 9: Alex Rivera — pending_manager (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'annual_renewal', 'pending_manager', '2025-2026', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '6 days', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 10: Jordan Chen — pending_manager (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'new_updated', 'pending_manager', '2025-2026', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '3 days', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 11: Sam Washington — pending_admin (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'annual_renewal', 'pending_admin', '2025-2026', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '15 days', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 12: Jordan Chen — pending_admin (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'pending_admin', '2025-2026', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '10 days', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 13: Pat Kim — completed, prior year (from 005)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'new_updated', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0404', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '30 days', now() - interval '22 days', now() - interval '22 days', now() + interval '335 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Signatures — from 004
-- =============================================================

-- Agreement 2 (pending_manager): employee signature
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa001', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '1 day')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 3 (completed): all 3 signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'employee', 'Sam Washington', true, 'sha256_v1_demo_abc123', now() - interval '8 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '5 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa004', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'admin', 'Casey Nguyen', true, 'sha256_v1_demo_abc123', now() - interval '2 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- =============================================================
-- Signatures — from 005
-- =============================================================

-- Agreement 5 (completed): all 3 signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'employee', 'Alex Rivera', true, 'sha256_v1_demo_abc123', now() - interval '27 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'admin', 'Casey Nguyen', true, 'sha256_v1_demo_abc123', now() - interval '20 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 6 (completed): all 3 signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'manager', 'Taylor Brooks', true, 'sha256_v1_demo_abc123', now() - interval '21 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'admin', 'Casey Nguyen', true, 'sha256_v1_demo_abc123', now() - interval '18 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 7 (pending_admin): employee + manager signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'employee', 'Pat Kim', true, 'sha256_v1_demo_abc123', now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '4 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 8 (pending_manager): employee signature
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'employee', 'Sam Washington', true, 'sha256_v1_demo_abc123', now() - interval '5 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 9 (pending_manager): employee signature
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa014', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'employee', 'Alex Rivera', true, 'sha256_v1_demo_abc123', now() - interval '4 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 10 (pending_manager): employee signature
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa015', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '2 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 11 (pending_admin): employee + manager signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa016', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'employee', 'Sam Washington', true, 'sha256_v1_demo_abc123', now() - interval '14 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa017', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '8 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 12 (pending_admin): employee + manager signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa018', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa019', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'manager', 'Taylor Brooks', true, 'sha256_v1_demo_abc123', now() - interval '6 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- Agreement 13 (completed): all 3 signatures
INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa020', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'employee', 'Pat Kim', true, 'sha256_v1_demo_abc123', now() - interval '29 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa021', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa022', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'admin', 'Drew Martinez', true, 'sha256_v1_demo_abc123', now() - interval '22 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

-- =============================================================
-- Audit Log — from 004
-- =============================================================

-- Agreement 2: submitted, employee signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0001', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '2 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0002', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 3: full lifecycle
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0003', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0004', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '8 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0005', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '5 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0006', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '2 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0007', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003"}'::jsonb, now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Audit Log — from 005
-- =============================================================

-- Agreement 4: submitted
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0008', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa004', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 5: full lifecycle
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0009', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '28 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0010', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '27 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0011', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0012', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '20 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0013', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005"}'::jsonb, now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 6: full lifecycle
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0014', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0015', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0016', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '21 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0017', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '18 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0018', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006"}'::jsonb, now() - interval '18 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 7: submitted, employee signed, manager signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0019', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '12 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0020', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0021', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 8: submitted, employee signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0022', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '7 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0023', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 9: submitted, employee signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0024', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '6 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0025', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 10: submitted, employee signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0026', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '3 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0027', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 11: submitted, employee signed, manager signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0028', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '15 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0029', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '14 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0030', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 12: submitted, employee signed, manager signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0031', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0032', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0033', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 13: full lifecycle
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0034', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '30 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0035', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '29 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0036', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0037', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '22 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0038', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013"}'::jsonb, now() - interval '22 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Scale seed: 40 more agreements (14-53) from 006
-- Generated procedurally for compactness
-- =============================================================
DO $$
DECLARE
  agr_pfx text := 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa';
  emp_pfx text := 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee';
  sig_pfx text := 'aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa';
  log_pfx text := 'aaaaaaaa-bbbb-cccc-1111-bbbbbbbb';
  sig_seq int := 23;
  log_seq int := 39;
  agr_id uuid; emp_id uuid; mgr_id uuid; adm_id uuid;
  emp_nm text; mgr_nm text; adm_nm text; fy text;
  r RECORD;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      (14,9,'new_updated','draft','Quinn Foster',3,NULL::int,NULL::int,NULL::int,NULL::int),
      (15,13,'annual_renewal','draft','Skyler Young',2,NULL,NULL,NULL,NULL),
      (16,21,'new_updated','draft','Morgan Hayes',1,NULL,NULL,NULL,NULL),
      (17,10,'new_updated','pending_employee','Quinn Foster',2,NULL,NULL,NULL,NULL),
      (18,14,'annual_renewal','pending_employee','Skyler Young',3,NULL,NULL,NULL,NULL),
      (19,17,'new_updated','pending_employee','Morgan Hayes',1,NULL,NULL,NULL,NULL),
      (20,18,'new_updated','pending_employee','Taylor Brooks',4,NULL,NULL,NULL,NULL),
      (21,19,'annual_renewal','pending_employee','Morgan Hayes',2,NULL,NULL,NULL,NULL),
      (22,20,'new_updated','pending_manager','Morgan Hayes',8,6,NULL,NULL,NULL),
      (23,24,'annual_renewal','pending_manager','Morgan Hayes',5,3,NULL,NULL,NULL),
      (24,22,'new_updated','pending_manager','Taylor Brooks',10,7,NULL,NULL,NULL),
      (25,23,'new_updated','pending_manager','Morgan Hayes',6,4,NULL,NULL,NULL),
      (26,9,'annual_renewal','pending_manager','Quinn Foster',9,5,NULL,NULL,NULL),
      (27,13,'new_updated','pending_manager','Skyler Young',7,3,NULL,NULL,NULL),
      (28,17,'annual_renewal','pending_manager','Morgan Hayes',12,9,NULL,NULL,NULL),
      (29,10,'annual_renewal','pending_admin','Quinn Foster',14,12,6,NULL,NULL),
      (30,14,'new_updated','pending_admin','Skyler Young',16,14,7,NULL,NULL),
      (31,18,'annual_renewal','pending_admin','Taylor Brooks',11,9,5,NULL,NULL),
      (32,20,'annual_renewal','pending_admin','Morgan Hayes',18,16,10,NULL,NULL),
      (33,21,'new_updated','pending_admin','Morgan Hayes',13,11,8,NULL,NULL),
      (34,9,'new_updated','completed','Quinn Foster',45,43,38,35,330),
      (35,10,'new_updated','completed','Quinn Foster',50,48,43,40,325),
      (36,13,'new_updated','completed','Skyler Young',55,53,47,42,323),
      (37,14,'new_updated','completed','Skyler Young',48,46,41,38,327),
      (38,17,'annual_renewal','completed','Morgan Hayes',40,38,35,32,333),
      (39,18,'annual_renewal','completed','Taylor Brooks',38,36,33,30,335),
      (40,19,'new_updated','completed','Morgan Hayes',35,33,30,28,337),
      (41,20,'new_updated','completed','Morgan Hayes',42,40,37,34,331),
      (42,24,'annual_renewal','completed','Morgan Hayes',52,50,47,44,321),
      (43,22,'new_updated','completed','Taylor Brooks',33,31,28,25,340),
      (44,23,'annual_renewal','completed','Morgan Hayes',36,34,31,29,336),
      (45,21,'annual_renewal','completed','Morgan Hayes',44,42,39,36,329),
      (46,1,'annual_renewal','completed','Morgan Hayes',380,378,375,370,-5),
      (47,2,'new_updated','completed','Taylor Brooks',375,373,370,365,0),
      (48,3,'annual_renewal','completed','Morgan Hayes',350,348,345,340,25),
      (49,4,'annual_renewal','completed','Morgan Hayes',340,338,335,330,35),
      (50,9,'annual_renewal','completed','Quinn Foster',60,58,53,50,15),
      (51,13,'annual_renewal','completed','Skyler Young',58,56,51,48,60),
      (52,24,'new_updated','completed','Morgan Hayes',56,54,49,46,80),
      (53,22,'annual_renewal','completed','Taylor Brooks',54,52,48,45,55)
    ) AS t(agr_num,emp_num,track,status,supervisor,created_d,emp_sign_d,mgr_sign_d,completed_d,expires_d)
  LOOP
    agr_id := (agr_pfx || lpad(r.agr_num::text, 3, '0'))::uuid;
    emp_id := (emp_pfx || lpad(r.emp_num::text, 4, '0'))::uuid;
    SELECT first_name || ' ' || last_name INTO emp_nm FROM ecos.employees WHERE id = emp_id;
    SELECT e2.id, e2.first_name || ' ' || e2.last_name INTO mgr_id, mgr_nm
      FROM ecos.employees e1 JOIN ecos.employees e2 ON e2.department_id = e1.department_id AND e2.role = 'manager'
      WHERE e1.id = emp_id LIMIT 1;
    IF mgr_id IS NULL THEN mgr_id := (emp_pfx || '0005')::uuid; mgr_nm := 'Morgan Hayes'; END IF;
    SELECT e2.id, e2.first_name || ' ' || e2.last_name INTO adm_id, adm_nm
      FROM ecos.employees e1 JOIN ecos.employees e2 ON e2.department_id = e1.department_id AND e2.role = 'admin'
      WHERE e1.id = emp_id LIMIT 1;
    IF adm_id IS NULL THEN adm_id := (emp_pfx || '0007')::uuid; adm_nm := 'Casey Nguyen'; END IF;
    fy := CASE WHEN r.created_d > 200 THEN '2024-2025' ELSE '2025-2026' END;
    IF r.status = 'completed' THEN
      INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
      VALUES (agr_id, emp_id, r.track, r.status, fy, r.supervisor, '(916) 555-' || lpad(r.emp_num::text, 4, '0'), 'Sacramento HQ', 'sha256_v1_demo_abc123',
        now() - (r.created_d || ' days')::interval, now() - (r.completed_d || ' days')::interval,
        now() - (r.completed_d || ' days')::interval, now() + (r.expires_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
    ELSE
      INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
      VALUES (agr_id, emp_id, r.track, r.status, fy, r.supervisor, '(916) 555-' || lpad(r.emp_num::text, 4, '0'), 'Sacramento HQ', 'sha256_v1_demo_abc123',
        now() - (r.created_d || ' days')::interval, now() - (coalesce(r.emp_sign_d, r.created_d) || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
    END IF;
    IF r.status != 'draft' THEN
      INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
      VALUES ((log_pfx || lpad(log_seq::text, 4, '0'))::uuid, agr_id, emp_id, 'agreement_submitted',
        '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - (r.created_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;
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
        format('{"agreement_id": "%s"}', agr_id)::jsonb, now() - (r.completed_d || ' days')::interval)
      ON CONFLICT (id) DO NOTHING;
      log_seq := log_seq + 1;
    END IF;
  END LOOP;
END;
$$;

COMMIT;
