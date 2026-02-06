-- ECOS Security Agreement Modernization
-- Migration 004: Seed data for demo
-- Fictional departments, employees, agreements, signatures, and audit log entries.
-- All names are fictional — no PII.

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- Departments (4)
-- =============================================================
-- Fixed UUIDs: aaaaaaaa-bbbb-cccc-dddd-dddddddd0001 through 0004
INSERT INTO ecos.departments (id, name, code)
VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'Office of Digital Innovation', 'ODI'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'Department of Technology', 'CDT'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'CalHR Human Resources', 'CALHR'),
  ('aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'State Controller''s Office', 'SCO')
ON CONFLICT (code) DO NOTHING;

-- =============================================================
-- Employees (8 fictional)
-- =============================================================
-- Fixed UUIDs: aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001 through 0008
-- Employees (4)
INSERT INTO ecos.employees (id, employee_number, first_name, last_name, email, title, department_id, role)
VALUES
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'EMP-001', 'Alex', 'Rivera', 'alex.rivera@example.gov', 'IT Specialist', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'EMP-002', 'Jordan', 'Chen', 'jordan.chen@example.gov', 'Systems Analyst', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'EMP-003', 'Sam', 'Washington', 'sam.washington@example.gov', 'Security Analyst', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'employee'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'EMP-004', 'Pat', 'Kim', 'pat.kim@example.gov', 'Fiscal Officer', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'employee'),
-- Managers (2)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'EMP-005', 'Morgan', 'Hayes', 'morgan.hayes@example.gov', 'IT Manager', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0001', 'manager'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'EMP-006', 'Taylor', 'Brooks', 'taylor.brooks@example.gov', 'Tech Lead', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0002', 'manager'),
-- Admins (2)
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'EMP-007', 'Casey', 'Nguyen', 'casey.nguyen@example.gov', 'HR Administrator', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0003', 'admin'),
  ('aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'EMP-008', 'Drew', 'Martinez', 'drew.martinez@example.gov', 'Audit Manager', 'aaaaaaaa-bbbb-cccc-dddd-dddddddd0004', 'admin')
ON CONFLICT (employee_number) DO NOTHING;

-- =============================================================
-- Form Versions (1)
-- =============================================================
-- Fixed UUID: aaaaaaaa-bbbb-cccc-ffff-ffffffffffff
INSERT INTO ecos.form_versions (id, version_hash, version_label, content_snapshot)
VALUES
  ('aaaaaaaa-bbbb-cccc-ffff-ffffffffffff', 'sha256_v1_demo_abc123', 'v1.0', '{"title": "ECOS Security Agreement Form", "version": "1.0"}'::jsonb)
ON CONFLICT (version_hash) DO NOTHING;

-- =============================================================
-- Agreements (3)
-- =============================================================
-- Fixed UUIDs: aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa001 through 003

-- Agreement 1: Draft (Alex Rivera, new_updated track)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa001', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'new_updated', 'draft', '2024-2025', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '5 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- Agreement 2: Pending manager (Jordan Chen, annual_renewal, employee already signed)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'pending_manager', '2024-2025', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '3 days', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 3: Completed (Sam Washington, new_updated, all 3 signatures)
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'new_updated', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '10 days', now() - interval '2 days', now() - interval '2 days', now() + interval '365 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Signatures
-- =============================================================
-- Fixed UUIDs: aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa001 through 004

-- Agreement 2 (pending_manager): employee signature recorded
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
-- Audit Log entries for non-draft agreements
-- =============================================================
-- Fixed UUIDs: aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0001 through 0007

-- Agreement 2: submitted, employee signed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0001', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '2 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0002', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa002', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Agreement 3: submitted, employee signed, manager signed, admin signed -> completed
INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0003', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0004', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '8 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0005', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '5 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0006', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '2 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0007', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa003"}'::jsonb, now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;
