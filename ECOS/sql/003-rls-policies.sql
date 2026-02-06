-- ECOS Security Agreement Modernization
-- Migration 003: Row Level Security policies
-- Enables RLS on all ecos tables with demo-permissive policies.
-- Production policy patterns documented in comments.

BEGIN;

SET search_path TO ecos, public;

-- =============================================================
-- Enable RLS on all 7 ecos tables
-- =============================================================
ALTER TABLE ecos.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.agreement_access_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecos.form_versions ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- Demo-permissive RLS policies
-- These allow anon full access for the demo app.
-- Role-based filtering is handled in the API layer.
-- =============================================================

-- Departments: everyone can read
DROP POLICY IF EXISTS "departments_read" ON ecos.departments;
CREATE POLICY "departments_read" ON ecos.departments FOR SELECT TO anon USING (true);

-- Employees: everyone can read (demo needs to show all perspectives)
DROP POLICY IF EXISTS "employees_read" ON ecos.employees;
CREATE POLICY "employees_read" ON ecos.employees FOR SELECT TO anon USING (true);

-- Agreements: full access for demo (role filtering in API layer)
DROP POLICY IF EXISTS "agreements_select" ON ecos.agreements;
CREATE POLICY "agreements_select" ON ecos.agreements FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "agreements_insert" ON ecos.agreements;
CREATE POLICY "agreements_insert" ON ecos.agreements FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "agreements_update" ON ecos.agreements;
CREATE POLICY "agreements_update" ON ecos.agreements FOR UPDATE TO anon USING (true);

-- Access groups: follow agreement access
DROP POLICY IF EXISTS "access_groups_select" ON ecos.agreement_access_groups;
CREATE POLICY "access_groups_select" ON ecos.agreement_access_groups FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "access_groups_insert" ON ecos.agreement_access_groups;
CREATE POLICY "access_groups_insert" ON ecos.agreement_access_groups FOR INSERT TO anon WITH CHECK (true);

-- Signatures: full access for demo
DROP POLICY IF EXISTS "signatures_select" ON ecos.signatures;
CREATE POLICY "signatures_select" ON ecos.signatures FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "signatures_insert" ON ecos.signatures;
CREATE POLICY "signatures_insert" ON ecos.signatures FOR INSERT TO anon WITH CHECK (true);

-- Audit log: read all, insert new
DROP POLICY IF EXISTS "audit_read" ON ecos.audit_log;
CREATE POLICY "audit_read" ON ecos.audit_log FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "audit_insert" ON ecos.audit_log;
CREATE POLICY "audit_insert" ON ecos.audit_log FOR INSERT TO anon WITH CHECK (true);

-- Form versions: read-only
DROP POLICY IF EXISTS "form_versions_read" ON ecos.form_versions;
CREATE POLICY "form_versions_read" ON ecos.form_versions FOR SELECT TO anon USING (true);

-- =============================================================
-- PRODUCTION NOTE: In a real deployment, policies would use
-- auth.uid() and JWT claims for proper row-level access control.
--
-- Example production policies:
--
-- CREATE POLICY "agreements_employee" ON ecos.agreements FOR SELECT
--   USING (employee_id = auth.uid());
--
-- CREATE POLICY "agreements_manager" ON ecos.agreements FOR SELECT
--   USING (employee_id IN (SELECT id FROM ecos.employees WHERE department_id = (
--     SELECT department_id FROM ecos.employees WHERE id = auth.uid()
--   )));
--
-- CREATE POLICY "agreements_admin" ON ecos.agreements FOR SELECT
--   USING (true);  -- admins see everything
--
-- CREATE POLICY "audit_read_own" ON ecos.audit_log FOR SELECT
--   USING (actor_id = auth.uid()
--     OR EXISTS (SELECT 1 FROM ecos.employees WHERE id = auth.uid() AND role IN ('manager', 'admin'))
--   );
--
-- CREATE POLICY "signatures_employee" ON ecos.signatures FOR INSERT
--   WITH CHECK (signer_id = auth.uid());
-- =============================================================

COMMIT;
