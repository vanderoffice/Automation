-- ECOS Security Agreement Modernization
-- Migration 001: Schema and core tables
-- Creates ecos schema with departments, employees, agreements, agreement_access_groups

BEGIN;

-- Create schema
CREATE SCHEMA IF NOT EXISTS ecos;

-- Set search path for this session
SET search_path TO ecos, public;

-- =============================================================
-- Departments
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.departments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    code text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================
-- Employees
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.employees (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number text NOT NULL UNIQUE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    title text,
    department_id uuid NOT NULL REFERENCES ecos.departments(id),
    role text NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_department_id ON ecos.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_role ON ecos.employees(role);

-- =============================================================
-- Agreements
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.agreements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id uuid NOT NULL REFERENCES ecos.employees(id),
    track text NOT NULL CHECK (track IN ('new_updated', 'annual_renewal')),
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_employee', 'pending_manager', 'pending_admin', 'completed', 'expired')),
    fiscal_year text NOT NULL,
    supervisor_name text,
    work_phone text,
    work_location text,
    form_version_hash text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_agreements_employee_id ON ecos.agreements(employee_id);
CREATE INDEX IF NOT EXISTS idx_agreements_status ON ecos.agreements(status);

-- =============================================================
-- Agreement Access Groups (junction table)
-- =============================================================
CREATE TABLE IF NOT EXISTS ecos.agreement_access_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id uuid NOT NULL REFERENCES ecos.agreements(id) ON DELETE CASCADE,
    group_name text NOT NULL,
    access_level text NOT NULL DEFAULT 'standard',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (agreement_id, group_name)
);

CREATE INDEX IF NOT EXISTS idx_agreement_access_groups_agreement_id ON ecos.agreement_access_groups(agreement_id);

-- =============================================================
-- updated_at trigger function
-- =============================================================
CREATE OR REPLACE FUNCTION ecos.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_agreements_updated_at ON ecos.agreements;
CREATE TRIGGER trg_agreements_updated_at
    BEFORE UPDATE ON ecos.agreements
    FOR EACH ROW
    EXECUTE FUNCTION ecos.set_updated_at();

COMMIT;
