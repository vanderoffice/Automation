-- ECOS Security Agreement Modernization
-- Migration 005: Expanded seed data for demo role perspectives
-- Adds 10 agreements across all workflow states so every role has interesting demo content.
-- All names are fictional — no PII.

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- Agreement 4: Alex Rivera — pending_employee (just submitted, no signature yet)
-- Visible to Alex as "needs your signature"
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa004', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'new_updated', 'pending_employee', '2025-2026', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '1 day', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0008', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa004', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 5: Alex Rivera — completed (prior year annual renewal)
-- Shows in Alex's history as a past completed agreement
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'annual_renewal', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '28 days', now() - interval '20 days', now() - interval '20 days', now() + interval '345 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'employee', 'Alex Rivera', true, 'sha256_v1_demo_abc123', now() - interval '27 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'admin', 'Casey Nguyen', true, 'sha256_v1_demo_abc123', now() - interval '20 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0009', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '28 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0010', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '27 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0011', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0012', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '20 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0013', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa005"}'::jsonb, now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 6: Jordan Chen — completed (prior year annual renewal)
-- Shows in Jordan's history as a past completed agreement
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'completed', '2024-2025', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '25 days', now() - interval '18 days', now() - interval '18 days', now() + interval '347 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'manager', 'Taylor Brooks', true, 'sha256_v1_demo_abc123', now() - interval '21 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'admin', 'Casey Nguyen', true, 'sha256_v1_demo_abc123', now() - interval '18 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0014', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0015', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '24 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0016', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '21 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0017', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '18 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0018', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0007', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa006"}'::jsonb, now() - interval '18 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 7: Pat Kim (SCO) — pending_admin (employee + manager signed)
-- Drew Martinez (SCO admin) sees this pending their sign-off
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'new_updated', 'pending_admin', '2025-2026', 'Morgan Hayes', '(916) 555-0404', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '12 days', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'employee', 'Pat Kim', true, 'sha256_v1_demo_abc123', now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '4 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0019', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '12 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0020', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0021', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa007', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 8: Sam Washington (ODI) — pending_manager (employee signed)
-- Morgan Hayes (ODI manager) sees this in their review queue
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'new_updated', 'pending_manager', '2025-2026', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '7 days', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'employee', 'Sam Washington', true, 'sha256_v1_demo_abc123', now() - interval '5 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0022', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '7 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0023', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa008', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 9: Alex Rivera (ODI) — pending_manager (employee signed)
-- Morgan Hayes (ODI manager) sees this in their review queue
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'annual_renewal', 'pending_manager', '2025-2026', 'Morgan Hayes', '(916) 555-0101', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '6 days', now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa014', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'employee', 'Alex Rivera', true, 'sha256_v1_demo_abc123', now() - interval '4 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0024', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '6 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0025', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa009', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0001', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '4 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 10: Jordan Chen (CDT) — pending_manager (employee signed)
-- Taylor Brooks (CDT manager) sees this in their review queue
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'new_updated', 'pending_manager', '2025-2026', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '3 days', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa015', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '2 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0026', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '3 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0027', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa010', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 11: Sam Washington (ODI) — pending_admin (employee + manager signed)
-- Casey Nguyen (CALHR admin) sees this pending their sign-off
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'annual_renewal', 'pending_admin', '2025-2026', 'Morgan Hayes', '(916) 555-0103', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '15 days', now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa016', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'employee', 'Sam Washington', true, 'sha256_v1_demo_abc123', now() - interval '14 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa017', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '8 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0028', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '15 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0029', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0003', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '14 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0030', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa011', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '8 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 12: Jordan Chen (CDT) — pending_admin (employee + manager signed)
-- Casey Nguyen (CALHR admin) sees this pending their sign-off
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'annual_renewal', 'pending_admin', '2025-2026', 'Taylor Brooks', '(916) 555-0202', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '10 days', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa018', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'employee', 'Jordan Chen', true, 'sha256_v1_demo_abc123', now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa019', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'manager', 'Taylor Brooks', true, 'sha256_v1_demo_abc123', now() - interval '6 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0031', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '10 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0032', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0002', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '9 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0033', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa012', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0006', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Agreement 13: Pat Kim (SCO) — completed (prior year new_updated)
-- Shows in Pat's history; Drew Martinez signed as admin
-- =============================================================
INSERT INTO ecos.agreements (id, employee_id, track, status, fiscal_year, supervisor_name, work_phone, work_location, form_version_hash, created_at, updated_at, completed_at, expires_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'new_updated', 'completed', '2024-2025', 'Morgan Hayes', '(916) 555-0404', 'Sacramento HQ', 'sha256_v1_demo_abc123', now() - interval '30 days', now() - interval '22 days', now() - interval '22 days', now() + interval '335 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ecos.signatures (id, agreement_id, signer_id, signer_role, typed_name, certified, form_version_hash, signed_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa020', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'employee', 'Pat Kim', true, 'sha256_v1_demo_abc123', now() - interval '29 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa021', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'manager', 'Morgan Hayes', true, 'sha256_v1_demo_abc123', now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-5555-aaaaaaaaa022', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'admin', 'Drew Martinez', true, 'sha256_v1_demo_abc123', now() - interval '22 days')
ON CONFLICT (agreement_id, signer_role) DO NOTHING;

INSERT INTO ecos.audit_log (id, agreement_id, actor_id, action, details, created_at)
VALUES
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0034', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'agreement_submitted', '{"from_status": "draft", "to_status": "pending_employee"}'::jsonb, now() - interval '30 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0035', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0004', 'signature_recorded', '{"signer_role": "employee", "from_status": "pending_employee", "to_status": "pending_manager"}'::jsonb, now() - interval '29 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0036', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0005', 'signature_recorded', '{"signer_role": "manager", "from_status": "pending_manager", "to_status": "pending_admin"}'::jsonb, now() - interval '25 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0037', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'signature_recorded', '{"signer_role": "admin", "from_status": "pending_admin", "to_status": "completed"}'::jsonb, now() - interval '22 days'),
  ('aaaaaaaa-bbbb-cccc-1111-bbbbbbbb0038', 'aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013', 'aaaaaaaa-bbbb-cccc-eeee-eeeeeeee0008', 'agreement_completed', '{"agreement_id": "aaaaaaaa-bbbb-cccc-aaaa-aaaaaaaaa013"}'::jsonb, now() - interval '22 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;
